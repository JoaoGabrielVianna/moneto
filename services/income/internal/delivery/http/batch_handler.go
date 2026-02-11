package http

import (
	"encoding/json"
	"io"
	"net/http"
	"strings"

	"github.com/joaogabriel/moneto/pkg/utils/response"
	"github.com/joaogabriel/moneto/service/income/internal/domain/model"
)

func (h *IncomeHandler) CreateBatch(w http.ResponseWriter, r *http.Request) {
	// 📜 Loga corpo bruto da requisição
	bodyBytes, _ := io.ReadAll(r.Body)

	// 🔁 Recria o Body para que o Decode funcione
	r.Body = io.NopCloser(strings.NewReader(string(bodyBytes)))

	var incomes []model.Income

	if err := json.NewDecoder(r.Body).Decode(&incomes); err != nil {
		log.Error("❌ Erro ao decodificar JSON: %s", err)
		response.Error(w, http.StatusBadRequest, "corpo da requisição inválido")
		return
	}

	userId := r.Context().Value("user_id").(string)

	validIncomes := make([]model.Income, 0)
	for _, inc := range incomes {
		if inc.Description == "" || inc.Amount == "0" {
			continue // ignora linhas vazias ou inválidas
		}
		inc.UserId = userId
		validIncomes = append(validIncomes, inc)
	}

	if len(validIncomes) == 0 {
		response.Error(w, http.StatusBadRequest, "nenhuma linha válida para importar")
		return
	}

	if err := h.Usecase.CreateBatchIncomes(r.Context(), validIncomes); err != nil {
		log.Error("Erro ao importar em lote: %s", err)
		response.Error(w, http.StatusInternalServerError, "erro ao importar rendas")
		return
	}

	log.Success("✅ Importação de rendas concluída com sucesso (%d linhas)", len(validIncomes))
	response.Success(w, map[string]any{
		"inserted": len(validIncomes),
	}, "Importação concluída com sucesso")
}
