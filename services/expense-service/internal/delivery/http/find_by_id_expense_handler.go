package http

import (
	"net/http"
	"strings"

	"github.com/joaogabriel/moneto/pkg/utils/response"
)

// FindById busca uma despesa pelo ID
// @Summary      Buscar despesa por ID
// @Description  Retorna os dados de uma despesa pelo ID
// @Tags         Expense
// @Param        id   path      string  true  "ID da despesa"
// @Success      200  {object}  model.ExpenseReponse
// @Failure      400  {object}  model.ExpenseReponse "id da despesa é obrigatória"
// @Failure      500  {object}  model.ExpenseReponse "despesa não encontrada"
// @Router       /expense/{id} [get]
func (h *ExpenseHandler) FindByIdExpense(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/")
	if id == "" {
		log.Error("Id da despesa é obrigatória")
		response.Error(w, http.StatusBadRequest, "id da despesa é obrigatória")
		return
	}

	expense, err := h.Usecase.FindById(r.Context(), id)
	if err != nil {
		log.Error("Despesa não encontrada: %s, id: %s", err, id)
		response.Error(w, http.StatusInternalServerError, "despesa não encontrada")
		return
	}

	log.Success("Despesa encontrada com sucesso!")
	response.Success(w, expense, "Despesa encontrada com sucesso!")
}
