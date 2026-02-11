package http

import (
	"encoding/json"
	"net/http"

	"github.com/joaogabriel/moneto/pkg/utils/response"
	"github.com/joaogabriel/moneto/service/expense/internal/domain/model"
)

func (h *ExpenseHandler) CreateBatch(w http.ResponseWriter, r *http.Request) {
	var expenses []model.Expense

	if err := json.NewDecoder(r.Body).Decode(&expenses); err != nil {
		log.Error("Erro ao decodificar JSON: %s", err)
		response.Error(w, http.StatusBadRequest, "corpo da requisição inválido")
		return
	}

	userId := r.Context().Value("user_id").(string)

	validExpenses := make([]model.Expense, 0)
	for _, exp := range expenses {
		// Ignora linhas vazias ou inválidas
		if exp.Description == "" || exp.Amount == "0" {
			continue
		}
		exp.UserId = userId
		validExpenses = append(validExpenses, exp)
	}

	if len(validExpenses) == 0 {
		response.Error(w, http.StatusBadRequest, "nenhuma linha válida para importar")
		return
	}

	if err := h.Usecase.CreateBatchExpenses(r.Context(), validExpenses); err != nil {
		log.Error("Erro ao importar despesas em lote: %s", err)
		response.Error(w, http.StatusInternalServerError, "erro ao importar despesas")
		return
	}

	log.Success("Importação de despesas concluída com sucesso (%d linhas)", len(validExpenses))
	response.Success(w, map[string]any{
		"inserted": len(validExpenses),
	}, "Importação concluída com sucesso")
}
