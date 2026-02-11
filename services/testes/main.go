package main

import (
	"bytes"
	"crypto/sha1"
	"encoding/csv"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
)

// ========================================
// 🚀 Configuração básica do servidor
// ========================================

func enableCORS(w http.ResponseWriter, r *http.Request) bool {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Internal-API-Key, X-User-Id")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return false
	}
	return true
}

// ========================================
// 🧩 Gera ID determinístico (idempotente)
// ========================================

func generateDeterministicID(userID, date, description, amount string) string {
	key := fmt.Sprintf("%s|%s|%s|%s", userID, date, strings.ToUpper(description), amount)
	hash := sha1.Sum([]byte(key))
	return hex.EncodeToString(hash[:])[:22] // 22 caracteres curtos e únicos
}

// ========================================
// 🔁 Remove duplicadas dentro do mesmo CSV
// ========================================

func uniqueTransactions(transactions []map[string]any) []map[string]any {
	seen := make(map[string]bool)
	var result []map[string]any
	for _, tx := range transactions {
		id, ok := tx["id"].(string)
		if !ok {
			continue
		}
		if !seen[id] {
			seen[id] = true
			result = append(result, tx)
		}
	}
	return result
}

// ========================================
// 📄 Preview do CSV (Frontend → /import/preview)
// ========================================

func previewImportHandler(w http.ResponseWriter, r *http.Request) {
	if !enableCORS(w, r) {
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, "Use POST", http.StatusMethodNotAllowed)
		return
	}
	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Erro lendo arquivo: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	tmpPath := "./" + header.Filename
	out, _ := os.Create(tmpPath)
	defer out.Close()
	io.Copy(out, file)

	f, err := os.Open(tmpPath)
	if err != nil {
		http.Error(w, "Erro abrindo CSV: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer f.Close()
	os.Remove(tmpPath)

	reader := csv.NewReader(f)
	reader.Comma = ';'
	reader.FieldsPerRecord = -1

	var allRows [][]string
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			http.Error(w, "Erro lendo CSV: "+err.Error(), http.StatusInternalServerError)
			return
		}
		allRows = append(allRows, record)
	}

	resp := map[string]any{
		"message":  "CSV processado com sucesso",
		"filename": header.Filename,
		"rows":     allRows,
		"total":    len(allRows),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)

	fmt.Printf("✅ Preview de CSV recebido: %s (%d linhas)\n", header.Filename, len(allRows))
}

// ========================================
// 💾 Importa batch para Incomes e Expenses
// ========================================

func saveBatchHandler(w http.ResponseWriter, r *http.Request) {
	if !enableCORS(w, r) {
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Use POST", http.StatusMethodNotAllowed)
		return
	}

	var payload struct {
		UserID     string     `json:"user_id"`
		CategoryID string     `json:"category_id"`
		Rows       [][]string `json:"rows"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Erro lendo JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	if payload.UserID == "" {
		http.Error(w, "user_id é obrigatório", http.StatusBadRequest)
		return
	}
	if payload.CategoryID == "" {
		http.Error(w, "category_id é obrigatório", http.StatusBadRequest)
		return
	}
	if len(payload.Rows) < 3 {
		http.Error(w, "Nenhum dado válido encontrado", http.StatusBadRequest)
		return
	}

	var incomes []map[string]any
	var expenses []map[string]any

	parseDate := func(d string) string {
		parts := strings.Split(d, "/")
		if len(parts) == 3 {
			return fmt.Sprintf("%s-%s-%sT00:00:00Z", parts[2], parts[1], parts[0])
		}
		return d
	}

	parseValue := func(v string) float64 {
		v = strings.ReplaceAll(v, ".", "")
		v = strings.ReplaceAll(v, ",", ".")
		val, _ := strconv.ParseFloat(v, 64)
		return val
	}

	for i, row := range payload.Rows {
		if i == 0 {
			continue
		}
		if len(row) < 6 {
			continue
		}

		date := strings.TrimSpace(row[0])
		description := strings.TrimSpace(row[1])
		credit := strings.TrimSpace(row[3])
		debit := strings.TrimSpace(row[4])

		if date == "" || description == "" ||
			strings.EqualFold(date, "Data") ||
			strings.Contains(strings.ToLower(description), "histórico") ||
			strings.Contains(strings.ToLower(description), "saldo") ||
			strings.Contains(strings.ToLower(description), "total") {
			continue
		}

		date = parseDate(date)

		if credit != "" && credit != "0,00" {
			amount := fmt.Sprintf("%.2f", parseValue(credit))
			id := generateDeterministicID(payload.UserID, date, description, amount)
			incomes = append(incomes, map[string]any{
				"id":          id,
				"user_id":     payload.UserID,
				"category_id": payload.CategoryID,
				"description": description,
				"amount":      amount,
				"date":        date,
			})
		}
		if debit != "" && debit != "0,00" {
			amount := fmt.Sprintf("%.2f", parseValue(debit))
			id := generateDeterministicID(payload.UserID, date, description, amount)
			expenses = append(expenses, map[string]any{
				"id":          id,
				"user_id":     payload.UserID,
				"category_id": payload.CategoryID,
				"description": description,
				"amount":      amount,
				"date":        date,
			})
		}
	}

	// 🔹 Remove duplicados internos
	incomes = uniqueTransactions(incomes)
	expenses = uniqueTransactions(expenses)

	fmt.Printf("📦 Pronto pra enviar: %d incomes | %d expenses\n", len(incomes), len(expenses))

	internalKey := os.Getenv("INTERNAL_API_KEY")
	if internalKey == "" {
		internalKey = "mude-me"
	}

	userId := payload.UserID
	var totalIncomes, totalExpenses int

	if len(incomes) > 0 {
		if err := sendBatch("http://localhost:3002/incomes/batch", incomes, internalKey, userId); err == nil {
			totalIncomes = len(incomes)
		}
	}
	if len(expenses) > 0 {
		if err := sendBatch("http://localhost:3003/expenses/batch", expenses, internalKey, userId); err == nil {
			totalExpenses = len(expenses)
		}
	}

	resp := map[string]any{
		"message":  fmt.Sprintf("Importação concluída: %d receitas, %d despesas", totalIncomes, totalExpenses),
		"incomes":  totalIncomes,
		"expenses": totalExpenses,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// ========================================
// 📡 Envia lote para outro microserviço
// ========================================

func sendBatch(url string, data []map[string]any, internalKey, userId string) error {
	body, _ := json.Marshal(data)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Internal-API-Key", internalKey)
	req.Header.Set("X-User-Id", userId)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Println("❌ Erro ao enviar batch:", err)
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Printf("⚠️ Erro do serviço destino (%s): %s\n", url, resp.Status)
	}
	return nil
}

// ========================================
// 🧩 main
// ========================================

func main() {
	http.HandleFunc("/import/preview", previewImportHandler)
	http.HandleFunc("/import/save-batch", saveBatchHandler)

	port := ":3006"
	fmt.Printf("🚀 Servidor rodando em http://localhost%s\n", port)
	http.ListenAndServe(port, nil)
}
