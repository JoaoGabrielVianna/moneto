package http

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/joaogabriel/moneto/pkg/response"
	"github.com/joaogabriel/moneto/service/expense/internal/domain/model"
)

// @Summary      Atualizar despesa
// @Description  Atualiza informações de uma despesa pelo seu ID
// @Tags         Expense
// @Accept       json
// @Produce      json
// @Param        id      path      string              true  "ID da despesa"
// @Param        update  body      model.ExpenseReponse  true  "Dados para atualização"
// @Success      200     {object}  model.ExpenseReponse
// @Failure      400     {object}  model.ExpenseReponse "corpo da requisição inválido ou ID ausente"
// @Failure      500     {object}  model.ExpenseReponse "erro ao atualizar despesa"
// @Router       /expense/update/{id} [put]
func (h *ExpenseHandler) UpdateExpense(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/update/")
	if id == "" {
		log.Error("Id da despesa é obrigatória")
		response.ERROR(w, http.StatusBadRequest, "id da despesa é obrigatória")
		return
	}

	var update model.ExpenseUpdate
	if err := json.NewDecoder(r.Body).Decode(&update); err != nil {
		log.Error("Erro ao decodificar JSON: %s", err)
		response.ERROR(w, http.StatusBadRequest, "corpo da requisição inválido")
		return
	}

	income, err := h.Usecase.Update(r.Context(), id, update)

	if err != nil {
		log.Error("erro ao atualizar despesa: %s", err)
		response.ERROR(w, http.StatusInternalServerError, "erro ao atualizar despesa")
		return
	}

	log.Success("Despesa atualizada com sucesso!")
	response.OK(w, income)
}
