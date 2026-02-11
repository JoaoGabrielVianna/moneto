package http

import (
	"net/http"
	"strings"

	"github.com/joaogabriel/moneto/pkg/utils/response"
)

// DeleteExpense deleta uma despesa pelo ID
// @Summary      Deletar despesa
// @Description  Remove uma despesa existente pelo seu ID
// @Tags         Expense
// @Param        id   path      string  true  "ID da despesa"
// @Success      200  {object}  nil
// @Failure      400  {object}  nil "id da despesa é obrigatória"
// @Failure      500  {object}  nil "despesa não deletada"
// @Router       /expense/delete/{id} [delete]
func (h *ExpenseHandler) DeleteExpense(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/delete/")
	if id == "" {
		log.Error("Id da despesa é obrigatória")
		response.Error(w, http.StatusBadRequest, "id da despesa é obrigatória")
		return
	}

	err := h.Usecase.Delete(r.Context(), id)
	if err != nil {
		log.Error("Despesa não deletada: %s, id: %s", err, id)
		response.Error(w, http.StatusInternalServerError, "despesa não deletada")
		return
	}

	log.Success("Despesa deletada com sucesso!")
	response.Success(w, err, "Despesa deletada com sucesso!")
}
