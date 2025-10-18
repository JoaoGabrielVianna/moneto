// // package main

// // import (
// // 	"encoding/json"
// // 	"fmt"
// // 	"log"
// // 	"net/http"
// // 	"os"
// // 	"regexp"
// // 	"strconv"
// // 	"strings"

// // 	"github.com/ledongthuc/pdf"
// // )

// // // ===================== MODELOS =====================

// // type Transacao struct {
// // 	Data      string  `json:"data"`
// // 	Historico string  `json:"historico"`
// // 	Documento string  `json:"documento"`
// // 	Credito   float64 `json:"credito"`
// // 	Debito    float64 `json:"debito"`
// // 	Saldo     float64 `json:"saldo"`
// // }

// // type PdfMetadata struct {
// // 	Banco        string `json:"banco"`
// // 	DataEmissao  string `json:"data_emissao"`
// // 	Titular      string `json:"titular"`
// // 	Agencia      string `json:"agencia"`
// // 	Conta        string `json:"conta"`
// // 	PeriodoIni   string `json:"periodo_inicio"`
// // 	PeriodoFim   string `json:"periodo_fim"`
// // 	TotalPaginas int    `json:"total_paginas"`
// // }

// // type PdfResponse struct {
// // 	Metadata   PdfMetadata `json:"metadata"`
// // 	Transacoes []Transacao `json:"transacoes"`
// // 	TextoBruto string      `json:"texto_bruto"`
// // }

// // // ===================== FUNÇÕES AUXILIARES =====================

// // func parseFloatBr(v string) float64 {
// // 	v = strings.ReplaceAll(v, ".", "")
// // 	v = strings.ReplaceAll(v, ",", ".")
// // 	f, _ := strconv.ParseFloat(v, 64)
// // 	return f
// // }

// // // ===================== LEITURA DO PDF =====================

// // func extractText(path string) (string, error) {
// // 	f, r, err := pdf.Open(path)
// // 	if err != nil {
// // 		return "", err
// // 	}
// // 	defer f.Close()

// // 	var content string
// // 	totalPages := r.NumPage()
// // 	for i := 1; i <= totalPages; i++ {
// // 		p := r.Page(i)
// // 		if p.V.IsNull() {
// // 			continue
// // 		}
// // 		txt, _ := p.GetPlainText(nil)
// // 		content += fmt.Sprintf("\n\n--- PAGINA %d ---\n%s", i, txt)
// // 	}
// // 	return content, nil
// // }

// // // ===================== EXTRAÇÃO DE METADADOS =====================

// // func extractMetadata(text string) PdfMetadata {
// // 	reBanco := regexp.MustCompile(`(?i)Bradesco\s+Celular`)
// // 	reData := regexp.MustCompile(`(?m)^Data:\s*([^\n]+)`)
// // 	reNome := regexp.MustCompile(`(?m)^Nome:\s*(.+)`)
// // 	reAgenciaConta := regexp.MustCompile(`Ag[eê]ncia:\s*(\d+)\s*\|\s*Conta:\s*([\d-]+)`)
// // 	rePeriodo := regexp.MustCompile(`Movimentação entre:\s*(\d{2}/\d{2}/\d{4})\s*e\s*(\d{2}/\d{2}/\d{4})`)
// // 	reFolha := regexp.MustCompile(`Folha:\s*\d+/(\d+)`)

// // 	meta := PdfMetadata{}
// // 	if reBanco.MatchString(text) {
// // 		meta.Banco = "Bradesco Celular"
// // 	}
// // 	if m := reData.FindStringSubmatch(text); len(m) > 1 {
// // 		meta.DataEmissao = strings.TrimSpace(m[1])
// // 	}
// // 	if m := reNome.FindStringSubmatch(text); len(m) > 1 {
// // 		meta.Titular = strings.TrimSpace(m[1])
// // 	}
// // 	if m := reAgenciaConta.FindStringSubmatch(text); len(m) > 2 {
// // 		meta.Agencia = m[1]
// // 		meta.Conta = m[2]
// // 	}
// // 	if m := rePeriodo.FindStringSubmatch(text); len(m) > 2 {
// // 		meta.PeriodoIni = m[1]
// // 		meta.PeriodoFim = m[2]
// // 	}
// // 	if m := reFolha.FindStringSubmatch(text); len(m) > 1 {
// // 		meta.TotalPaginas, _ = strconv.Atoi(m[1])
// // 	}
// // 	return meta
// // }

// // // ===================== PARSE DE TRANSACOES =====================

// // func parseTransacoes(text string) []Transacao {
// // 	lines := strings.Split(text, "\n")

// // 	reData := regexp.MustCompile(`^\d{2}/\d{2}/\d{4}$`)
// // 	reDoc := regexp.MustCompile(`^\d{5,8}$`)
// // 	reValor := regexp.MustCompile(`^\d{1,3}(\.\d{3})*,\d{2}$`)

// // 	type rawTx struct {
// // 		data      string
// // 		historico string
// // 		documento string
// // 		credito   float64
// // 		debito    float64
// // 		saldo     float64
// // 	}

// // 	var rows []rawTx
// // 	var atual rawTx
// // 	var buffer []string

// // 	for _, raw := range lines {
// // 		l := strings.TrimSpace(raw)
// // 		if l == "" {
// // 			continue
// // 		}

// // 		if reDoc.MatchString(l) {
// // 			atual.documento = l
// // 			continue
// // 		}

// // 		if reValor.MatchString(l) {
// // 			valor := parseFloatBr(l)
// // 			if atual.credito == 0 && atual.debito == 0 {
// // 				h := strings.ToUpper(strings.Join(buffer, " "))
// // 				if strings.Contains(h, "REM") || strings.Contains(h, "TED") ||
// // 					strings.Contains(h, "DEVOL") || strings.Contains(h, "REND") {
// // 					atual.credito = valor
// // 				} else {
// // 					atual.debito = valor
// // 				}
// // 			} else {
// // 				atual.saldo = valor
// // 				atual.historico = strings.Join(buffer, " ")
// // 				rows = append(rows, atual)
// // 				atual = rawTx{}
// // 				buffer = nil
// // 			}
// // 			continue
// // 		}

// // 		if reData.MatchString(l) {
// // 			atual.data = l
// // 			continue
// // 		}

// // 		up := strings.ToUpper(l)
// // 		if strings.HasPrefix(up, "BRADESCO") || strings.HasPrefix(up, "EXTRATO") ||
// // 			strings.HasPrefix(up, "DATA") || strings.HasPrefix(up, "HIST") ||
// // 			strings.HasPrefix(up, "DOCTO") || strings.HasPrefix(up, "CRÉDITO") ||
// // 			strings.HasPrefix(up, "DÉBITO") || strings.HasPrefix(up, "SALDO") ||
// // 			strings.HasPrefix(up, "TOTAL") || strings.HasPrefix(up, "--- PAGINA") {
// // 			continue
// // 		}

// // 		buffer = append(buffer, l)
// // 	}

// // 	// Aplicar data da próxima transação (regra "data futura")
// // 	var proxData string
// // 	for i := len(rows) - 1; i >= 0; i-- {
// // 		if rows[i].data != "" {
// // 			proxData = rows[i].data
// // 		} else if proxData != "" {
// // 			rows[i].data = proxData
// // 		}
// // 	}

// // 	// Limpar o primeiro histórico de cabeçalhos
// // 	if len(rows) > 0 {
// // 		h := rows[0].historico
// // 		h = regexp.MustCompile(`(?i)^.*?COD\.?\s*LANC\.?\s*0`).ReplaceAllString(h, "")
// // 		h = strings.TrimSpace(h)
// // 		rows[0].historico = h
// // 	}

// // 	var transacoes []Transacao
// // 	for _, r := range rows {
// // 		transacoes = append(transacoes, Transacao{
// // 			Data:      r.data,
// // 			Historico: r.historico,
// // 			Documento: r.documento,
// // 			Credito:   r.credito,
// // 			Debito:    r.debito,
// // 			Saldo:     r.saldo,
// // 		})
// // 	}

// // 	return transacoes
// // }

// // // ===================== HANDLER =====================

// // func uploadHandler(w http.ResponseWriter, r *http.Request) {
// // 	if r.Method != http.MethodPost {
// // 		http.Error(w, "Use POST", http.StatusMethodNotAllowed)
// // 		return
// // 	}

// // 	file, header, err := r.FormFile("file")
// // 	if err != nil {
// // 		http.Error(w, "erro lendo arquivo: "+err.Error(), http.StatusBadRequest)
// // 		return
// // 	}
// // 	defer file.Close()

// // 	tmpPath := "./" + header.Filename
// // 	out, err := os.Create(tmpPath)
// // 	if err != nil {
// // 		http.Error(w, "erro salvando arquivo temporário", http.StatusInternalServerError)
// // 		return
// // 	}
// // 	defer out.Close()
// // 	_, _ = out.ReadFrom(file)

// // 	text, err := extractText(tmpPath)
// // 	os.Remove(tmpPath)
// // 	if err != nil {
// // 		http.Error(w, "erro extraindo texto: "+err.Error(), http.StatusInternalServerError)
// // 		return
// // 	}

// // 	meta := extractMetadata(text)
// // 	transacoes := parseTransacoes(text)

// // 	resp := PdfResponse{
// // 		Metadata:   meta,
// // 		Transacoes: transacoes,
// // 		TextoBruto: text,
// // 	}

// // 	w.Header().Set("Content-Type", "application/json")
// // 	json.NewEncoder(w).Encode(resp)
// // }

// // // ===================== MAIN =====================

// // func main() {
// // 	http.HandleFunc("/upload", uploadHandler)
// // 	fmt.Println("🚀 Servidor rodando em http://localhost:8080/upload")
// // 	log.Fatal(http.ListenAndServe(":8080", nil))
// // }

// package main

// import (
// 	"bytes"
// 	"encoding/json"
// 	"fmt"
// 	"log"
// 	"net/http"
// 	"os"
// 	"regexp"
// 	"strconv"
// 	"strings"
// 	"time"

// 	"github.com/ledongthuc/pdf"
// )

// // ===================== MODELOS =====================

// type Transacao struct {
// 	Data      string  `json:"data"`
// 	Historico string  `json:"historico"`
// 	Documento string  `json:"documento"`
// 	Credito   float64 `json:"credito"`
// 	Debito    float64 `json:"debito"`
// 	Saldo     float64 `json:"saldo"`
// }

// type PdfMetadata struct {
// 	Banco        string `json:"banco"`
// 	DataEmissao  string `json:"data_emissao"`
// 	Titular      string `json:"titular"`
// 	Agencia      string `json:"agencia"`
// 	Conta        string `json:"conta"`
// 	PeriodoIni   string `json:"periodo_inicio"`
// 	PeriodoFim   string `json:"periodo_fim"`
// 	TotalPaginas int    `json:"total_paginas"`
// }

// type PdfResponse struct {
// 	Metadata   PdfMetadata `json:"metadata"`
// 	Transacoes []Transacao `json:"transacoes"`
// 	TextoBruto string      `json:"texto_bruto"`
// }

// // ===================== MODELOS DE ENVIO =====================

// type Expense struct {
// 	UserId      string    `json:"user_id"`
// 	CategoryId  string    `json:"category_id"`
// 	Amount      string    `json:"amount"`
// 	Description string    `json:"description"`
// 	Date        time.Time `json:"date"`
// 	Notes       string    `json:"notes"`
// }

// type Income struct {
// 	UserId      string    `json:"user_id"`
// 	CategoryId  string    `json:"category_id"`
// 	Amount      string    `json:"amount"`
// 	Description string    `json:"description"`
// 	Date        time.Time `json:"date"`
// 	Notes       string    `json:"notes"`
// }

// // ===================== CONSTANTES =====================

// const (
// 	authToken     = "Bearer MTc1NDg0OTAzODY1MTc5MDg4MDUyODU6MTc2MDU5ODQyMC4xZWUyMzA0ZWRhOTg5ODJjY2I4ZjE3Y2IyOWFkODVjNmM0OGRiNDY3YmUzMGFiOWFkNzE0MmY1NWE5YTI1MDVj"
// 	expenseAPIURL = "http://localhost:3003/expenses/create"
// 	incomeAPIURL  = "http://localhost:3002/incomes/create"
// )

// // ===================== FUNÇÕES AUXILIARES =====================

// func parseFloatBr(v string) float64 {
// 	v = strings.ReplaceAll(v, ".", "")
// 	v = strings.ReplaceAll(v, ",", ".")
// 	f, _ := strconv.ParseFloat(v, 64)
// 	return f
// }

// // ===================== LEITURA DO PDF =====================

// func extractText(path string) (string, error) {
// 	f, r, err := pdf.Open(path)
// 	if err != nil {
// 		return "", err
// 	}
// 	defer f.Close()

// 	var content string
// 	totalPages := r.NumPage()
// 	for i := 1; i <= totalPages; i++ {
// 		p := r.Page(i)
// 		if p.V.IsNull() {
// 			continue
// 		}
// 		txt, _ := p.GetPlainText(nil)
// 		content += fmt.Sprintf("\n\n--- PAGINA %d ---\n%s", i, txt)
// 	}
// 	return content, nil
// }

// // ===================== EXTRAÇÃO DE METADADOS =====================

// func extractMetadata(text string) PdfMetadata {
// 	reBanco := regexp.MustCompile(`(?i)Bradesco\s+Celular`)
// 	reData := regexp.MustCompile(`(?m)^Data:\s*([^\n]+)`)
// 	reNome := regexp.MustCompile(`(?m)^Nome:\s*(.+)`)
// 	reAgenciaConta := regexp.MustCompile(`Ag[eê]ncia:\s*(\d+)\s*\|\s*Conta:\s*([\d-]+)`)
// 	rePeriodo := regexp.MustCompile(`Movimentação entre:\s*(\d{2}/\d{2}/\d{4})\s*e\s*(\d{2}/\d{2}/\d{4})`)
// 	reFolha := regexp.MustCompile(`Folha:\s*\d+/(\d+)`)

// 	meta := PdfMetadata{}
// 	if reBanco.MatchString(text) {
// 		meta.Banco = "Bradesco Celular"
// 	}
// 	if m := reData.FindStringSubmatch(text); len(m) > 1 {
// 		meta.DataEmissao = strings.TrimSpace(m[1])
// 	}
// 	if m := reNome.FindStringSubmatch(text); len(m) > 1 {
// 		meta.Titular = strings.TrimSpace(m[1])
// 	}
// 	if m := reAgenciaConta.FindStringSubmatch(text); len(m) > 2 {
// 		meta.Agencia = m[1]
// 		meta.Conta = m[2]
// 	}
// 	if m := rePeriodo.FindStringSubmatch(text); len(m) > 2 {
// 		meta.PeriodoIni = m[1]
// 		meta.PeriodoFim = m[2]
// 	}
// 	if m := reFolha.FindStringSubmatch(text); len(m) > 1 {
// 		meta.TotalPaginas, _ = strconv.Atoi(m[1])
// 	}
// 	return meta
// }

// // ===================== PARSE DE TRANSACOES =====================

// func parseTransacoes(text string) []Transacao {
// 	lines := strings.Split(text, "\n")

// 	reData := regexp.MustCompile(`^\d{2}/\d{2}/\d{4}$`)
// 	reDoc := regexp.MustCompile(`^\d{5,8}$`)
// 	reValor := regexp.MustCompile(`^\d{1,3}(\.\d{3})*,\d{2}$`)

// 	type rawTx struct {
// 		data      string
// 		historico string
// 		documento string
// 		credito   float64
// 		debito    float64
// 		saldo     float64
// 	}

// 	var rows []rawTx
// 	var atual rawTx
// 	var buffer []string

// 	for _, raw := range lines {
// 		l := strings.TrimSpace(raw)
// 		if l == "" {
// 			continue
// 		}

// 		if reDoc.MatchString(l) {
// 			atual.documento = l
// 			continue
// 		}

// 		if reValor.MatchString(l) {
// 			valor := parseFloatBr(l)
// 			if atual.credito == 0 && atual.debito == 0 {
// 				h := strings.ToUpper(strings.Join(buffer, " "))
// 				if strings.Contains(h, "REM") || strings.Contains(h, "TED") ||
// 					strings.Contains(h, "DEVOL") || strings.Contains(h, "REND") {
// 					atual.credito = valor
// 				} else {
// 					atual.debito = valor
// 				}
// 			} else {
// 				atual.saldo = valor
// 				atual.historico = strings.Join(buffer, " ")
// 				rows = append(rows, atual)
// 				atual = rawTx{}
// 				buffer = nil
// 			}
// 			continue
// 		}

// 		if reData.MatchString(l) {
// 			atual.data = l
// 			continue
// 		}

// 		up := strings.ToUpper(l)
// 		if strings.HasPrefix(up, "BRADESCO") || strings.HasPrefix(up, "EXTRATO") ||
// 			strings.HasPrefix(up, "DATA") || strings.HasPrefix(up, "HIST") ||
// 			strings.HasPrefix(up, "DOCTO") || strings.HasPrefix(up, "CRÉDITO") ||
// 			strings.HasPrefix(up, "DÉBITO") || strings.HasPrefix(up, "SALDO") ||
// 			strings.HasPrefix(up, "TOTAL") || strings.HasPrefix(up, "--- PAGINA") {
// 			continue
// 		}

// 		buffer = append(buffer, l)
// 	}

// 	var proxData string
// 	for i := len(rows) - 1; i >= 0; i-- {
// 		if rows[i].data != "" {
// 			proxData = rows[i].data
// 		} else if proxData != "" {
// 			rows[i].data = proxData
// 		}
// 	}

// 	if len(rows) > 0 {
// 		h := rows[0].historico
// 		h = regexp.MustCompile(`(?i)^.*?COD\.?\s*LANC\.?\s*0`).ReplaceAllString(h, "")
// 		h = strings.TrimSpace(h)
// 		rows[0].historico = h
// 	}

// 	var transacoes []Transacao
// 	for _, r := range rows {
// 		transacoes = append(transacoes, Transacao{
// 			Data:      r.data,
// 			Historico: r.historico,
// 			Documento: r.documento,
// 			Credito:   r.credito,
// 			Debito:    r.debito,
// 			Saldo:     r.saldo,
// 		})
// 	}

// 	return transacoes
// }

// // ===================== ENVIO À API =====================

// func sendTransaction(t Transacao) {
// 	date, _ := time.Parse("02/01/2006", t.Data)
// 	amount := fmt.Sprintf("%.2f", t.Credito)
// 	desc := t.Historico

// 	client := &http.Client{}

// 	if t.Credito > 0 {
// 		income := Income{
// 			UserId:      "17548490386517908805285",
// 			CategoryId:  "17562509453636961176898",
// 			Amount:      amount,
// 			Description: desc,
// 			Date:        date,
// 			Notes:       "Importado do extrato BRADESCO",
// 		}
// 		body, _ := json.Marshal(income)
// 		req, _ := http.NewRequest("POST", incomeAPIURL, bytes.NewBuffer(body))
// 		req.Header.Set("Authorization", authToken)
// 		req.Header.Set("Content-Type", "application/json")

// 		resp, err := client.Do(req)
// 		if err != nil {
// 			log.Printf("Erro enviando income: %v\n", err)
// 			return
// 		}
// 		defer resp.Body.Close()
// 		log.Printf("[CREDITO] %s - %s (%s) → %s\n", t.Data, desc, amount, resp.Status)

// 	} else if t.Debito > 0 {
// 		expense := Expense{
// 			UserId:      "17548490386517908805285",
// 			CategoryId:  "17562509453636961176898",
// 			Amount:      fmt.Sprintf("%.2f", t.Debito),
// 			Description: desc,
// 			Date:        date,
// 			Notes:       "Importado do extrato BRADESCO",
// 		}
// 		body, _ := json.Marshal(expense)
// 		req, _ := http.NewRequest("POST", expenseAPIURL, bytes.NewBuffer(body))
// 		req.Header.Set("Authorization", authToken)
// 		req.Header.Set("Content-Type", "application/json")

// 		resp, err := client.Do(req)
// 		if err != nil {
// 			log.Printf("Erro enviando expense: %v\n", err)
// 			return
// 		}
// 		defer resp.Body.Close()
// 		log.Printf("[DEBITO] %s - %s (%s) → %s\n", t.Data, desc, expense.Amount, resp.Status)
// 	}
// }

// // ===================== HANDLER =====================

// func uploadHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodPost {
// 		http.Error(w, "Use POST", http.StatusMethodNotAllowed)
// 		return
// 	}

// 	file, header, err := r.FormFile("file")
// 	if err != nil {
// 		http.Error(w, "erro lendo arquivo: "+err.Error(), http.StatusBadRequest)
// 		return
// 	}
// 	defer file.Close()

// 	tmpPath := "./" + header.Filename
// 	out, err := os.Create(tmpPath)
// 	if err != nil {
// 		http.Error(w, "erro salvando arquivo temporário", http.StatusInternalServerError)
// 		return
// 	}
// 	defer out.Close()
// 	_, _ = out.ReadFrom(file)

// 	text, err := extractText(tmpPath)
// 	os.Remove(tmpPath)
// 	if err != nil {
// 		http.Error(w, "erro extraindo texto: "+err.Error(), http.StatusInternalServerError)
// 		return
// 	}

// 	meta := extractMetadata(text)
// 	transacoes := parseTransacoes(text)

// 	for _, t := range transacoes {
// 		sendTransaction(t)
// 	}

// 	resp := PdfResponse{
// 		Metadata:   meta,
// 		Transacoes: transacoes,
// 		TextoBruto: text,
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	json.NewEncoder(w).Encode(resp)
// }

// // ===================== MAIN =====================

// func main_() {
// 	http.HandleFunc("/upload", uploadHandler)
// 	fmt.Println("🚀 Servidor rodando em http://localhost:8080/upload")
// 	log.Fatal(http.ListenAndServe(":8080", nil))
// }
