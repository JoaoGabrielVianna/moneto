package main

import (
	"bytes"
	"context"
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/ledongthuc/pdf"
)

//
// =========================================================
// 🧩 SEÇÃO 1 — MODELOS
// =========================================================
//

type PdfPage struct {
	Numero      int         `json:"numero"`
	Transacoes  []Transacao `json:"transacoes"`
	ConteudoRaw string      `json:"conteudo_raw,omitempty"`
}

type PdfMetadata struct {
	Banco        string `json:"banco"`
	DataEmissao  string `json:"data_emissao"`
	Titular      string `json:"titular"`
	Agencia      string `json:"agencia"`
	Conta        string `json:"conta"`
	PeriodoIni   string `json:"periodo_inicio"`
	PeriodoFim   string `json:"periodo_fim"`
	TotalPaginas int    `json:"total_paginas"`
}

type Transacao struct {
	Data      string  `json:"data"`
	Historico string  `json:"historico"`
	Documento string  `json:"documento,omitempty"`
	Credito   float64 `json:"credito,omitempty"`
	Debito    float64 `json:"debito,omitempty"`
	Saldo     float64 `json:"saldo"`
}

//
// =========================================================
// 🧠 SEÇÃO 2 — UTILITÁRIOS
// =========================================================
//

// Converte "1.234,56" → 1234.56
func parseFloatBr(v string) float64 {
	v = strings.ReplaceAll(v, ".", "")
	v = strings.ReplaceAll(v, ",", ".")
	f, _ := strconv.ParseFloat(v, 64)
	return f
}

// Gera ID determinístico com base nos dados da transação
func gerarIDTransacao(t Transacao) string {
	var tipo string
	var valor float64
	if t.Credito > 0 {
		tipo = "credito"
		valor = t.Credito
	} else {
		tipo = "debito"
		valor = t.Debito
	}
	base := fmt.Sprintf("%s|%s|%s|%.2f|%s", t.Data, t.Historico, t.Documento, valor, tipo)
	hash := sha1.Sum([]byte(base))
	return hex.EncodeToString(hash[:])[:20]
}

//
// =========================================================
// 📄 SEÇÃO 3 — EXTRAÇÃO PDF
// =========================================================
//

func extractText(path string) ([]PdfPage, error) {
	f, r, err := pdf.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	var pages []PdfPage
	for i := 1; i <= r.NumPage(); i++ {
		p := r.Page(i)
		if p.V.IsNull() {
			continue
		}
		txt, _ := p.GetPlainText(nil)
		txt = strings.Join(strings.Fields(strings.ReplaceAll(txt, "\n", " ")), " ")
		pages = append(pages, PdfPage{Numero: i, ConteudoRaw: txt})
	}
	return pages, nil
}

//
// =========================================================
// 🏦 SEÇÃO 4 — METADADOS
// =========================================================
//

func extractMetadata(page string, total int) (PdfMetadata, string) {
	meta := PdfMetadata{TotalPaginas: total}

	reBanco := regexp.MustCompile(`(?i)Bradesco\s+Celular`)
	reData := regexp.MustCompile(`Data:\s*([0-9/:\-\s]+)`)
	reNome := regexp.MustCompile(`Nome:\s*([A-Z\s]+)`)
	reAgenciaConta := regexp.MustCompile(`Ag[eê]ncia:\s*(\d+)\s*\|\s*Conta:\s*([\d-]+)`)
	rePeriodo := regexp.MustCompile(`Movimentação entre:\s*(\d{2}/\d{2}/\d{4})\s*e\s*(\d{2}/\d{2}/\d{4})`)

	if reBanco.MatchString(page) {
		meta.Banco = "Bradesco Celular"
		page = reBanco.ReplaceAllString(page, "")
	}
	if m := reData.FindStringSubmatch(page); len(m) > 1 {
		meta.DataEmissao = strings.TrimSpace(m[1])
		page = strings.Replace(page, m[0], "", 1)
	}
	if m := reNome.FindStringSubmatch(page); len(m) > 1 {
		meta.Titular = strings.TrimSpace(m[1])
		page = strings.Replace(page, m[0], "", 1)
	}
	if m := reAgenciaConta.FindStringSubmatch(page); len(m) > 2 {
		meta.Agencia = m[1]
		meta.Conta = m[2]
		page = strings.Replace(page, m[0], "", 1)
	}
	if m := rePeriodo.FindStringSubmatch(page); len(m) > 2 {
		meta.PeriodoIni = m[1]
		meta.PeriodoFim = m[2]
		page = strings.Replace(page, m[0], "", 1)
	}

	return meta, strings.TrimSpace(page)
}

//
// =========================================================
// 💰 SEÇÃO 5 — PARSE DAS TRANSAÇÕES
// =========================================================
//

func parseTransacoes(conteudo string) []Transacao {
	if idx := strings.Index(strings.ToLower(conteudo), "saldo (r$)"); idx != -1 {
		conteudo = conteudo[idx+len("saldo (r$)"):]
	}

	tokens := strings.Fields(strings.TrimSpace(conteudo))
	reData := regexp.MustCompile(`^\d{2}/\d{2}/\d{4}$`)
	reDoc := regexp.MustCompile(`^\d{5,8}$`)
	reValor := regexp.MustCompile(`^\d{1,3}(\.\d{3})*,\d{2}$`)

	var transacoes []Transacao
	var atual Transacao
	var buffer []string
	var lastDate string

	for _, t := range tokens {
		switch {
		case reData.MatchString(t):
			if atual.Data != "" && (atual.Credito > 0 || atual.Debito > 0) {
				transacoes = append(transacoes, atual)
				atual = Transacao{}
				buffer = nil
			}
			atual.Data = t
			lastDate = t

		case reDoc.MatchString(t):
			atual.Documento = t

		case reValor.MatchString(t):
			valor := parseFloatBr(t)
			if atual.Credito == 0 && atual.Debito == 0 {
				h := strings.ToUpper(strings.Join(buffer, " "))
				if strings.Contains(h, "REM") || strings.Contains(h, "TED") ||
					strings.Contains(h, "DEP") || strings.Contains(h, "REND") {
					atual.Credito = valor
				} else {
					atual.Debito = valor
				}
			} else {
				atual.Saldo = valor
				atual.Historico = strings.TrimSpace(strings.Join(buffer, " "))
				if atual.Data == "" {
					atual.Data = lastDate
				}
				transacoes = append(transacoes, atual)
				atual = Transacao{}
				buffer = nil
			}
		default:
			buffer = append(buffer, t)
		}
	}

	if atual.Data == "" && lastDate != "" {
		atual.Data = lastDate
	}
	if atual.Data != "" && (atual.Credito > 0 || atual.Debito > 0) {
		if atual.Historico == "" {
			atual.Historico = strings.TrimSpace(strings.Join(buffer, " "))
		}
		transacoes = append(transacoes, atual)
	}

	return transacoes
}

//
// =========================================================
// 🌐 SEÇÃO 6 — ENVIO AOS MICROSSERVIÇOS
// =========================================================
//

func enviarTransacoes(transacoes []Transacao) error {
	client := &http.Client{Timeout: 10 * time.Second}

	token := "MTc1NDg0OTAzODY1MTc5MDg4MDUyODU6MTc2MDg1MDEzNy4yNzFmMDc3ZWNkYzYwYjQzYTBlMzA4Y2E5OTVkZTBhNTk3Mzg1YmI0NTNjMjA3NjdkODQ3MGI0ZDdjYmYxYmE3"
	userID := "17548490386517908805285"
	categoryID := "17562509453636961176898"

	for _, t := range transacoes {
		var endpoint string
		var amount float64

		if t.Credito > 0 {
			endpoint = "http://localhost:3002/incomes/create"
			amount = t.Credito
		} else if t.Debito > 0 {
			endpoint = "http://localhost:3003/expenses/create"
			amount = t.Debito
		} else {
			continue
		}

		dt, err := time.Parse("02/01/2006", t.Data)
		if err != nil {
			fmt.Printf("⚠️ Erro parseando data %s: %v\n", t.Data, err)
			continue
		}

		id := gerarIDTransacao(t)
		payload := map[string]interface{}{
			"id":          id,
			"user_id":     userID,
			"category_id": categoryID,
			"amount":      fmt.Sprintf("%.2f", amount),
			"description": t.Historico,
			"date":        dt.Format(time.RFC3339),
			"notes":       "Importado do extrato BRADESCO",
		}

		body, _ := json.Marshal(payload)
		req, _ := http.NewRequestWithContext(context.Background(), http.MethodPost, endpoint, bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+token)

		resp, err := client.Do(req)
		if err != nil {
			fmt.Printf("❌ Erro enviando para %s: %v\n", endpoint, err)
			continue
		}
		defer resp.Body.Close()

		switch {
		case resp.StatusCode == http.StatusConflict:
			fmt.Printf("⚠️ Já existente: %s | %s\n", t.Data, t.Historico)
		case resp.StatusCode >= 200 && resp.StatusCode < 300:
			fmt.Printf("✅ %s enviada para %s | R$ %.2f\n", t.Data, endpoint, amount)
		default:
			fmt.Printf("⚠️ Falha [%d] %s | %s\n", resp.StatusCode, endpoint, t.Historico)
		}
	}

	return nil
}

//
// =========================================================
// 🧭 SEÇÃO 7 — HANDLER HTTP
// =========================================================
//

func uploadHandler(w http.ResponseWriter, r *http.Request) {
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
	_, _ = out.ReadFrom(file)

	pages, err := extractText(tmpPath)
	os.Remove(tmpPath)
	if err != nil {
		http.Error(w, "Erro lendo PDF: "+err.Error(), http.StatusInternalServerError)
		return
	}

	meta, cleaned := extractMetadata(pages[0].ConteudoRaw, len(pages))
	pages[0].ConteudoRaw = cleaned

	var all []Transacao
	for i := range pages {
		pages[i].Transacoes = parseTransacoes(pages[i].ConteudoRaw)
		all = append(all, pages[i].Transacoes...)
	}

	if err := enviarTransacoes(all); err != nil {
		http.Error(w, "Erro enviando transações: "+err.Error(), http.StatusInternalServerError)
		return
	}

	resp := map[string]any{
		"metadata": meta,
		"total":    len(all),
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

//
// =========================================================
// 🚀 SEÇÃO 8 — MAIN
// =========================================================
//

func main() {
	http.HandleFunc("/upload", uploadHandler)
	fmt.Println("🚀 Servidor rodando em http://localhost:8080/upload")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
