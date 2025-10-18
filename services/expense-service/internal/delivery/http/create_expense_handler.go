package http

import (
	"encoding/json"
	"net/http"

	"github.com/joaogabriel/moneto/pkg/response"
	"github.com/joaogabriel/moneto/service/expense/internal/domain/model"
)

// @Summary      Criar despesa
// @Description  Cria uma nova despesa para um usuário
// @Tags         Expense
// @Accept       json
// @Produce      json
// @Param        income  body      model.ExpenseReponse  true  "Dados da despesa"
// @Success      200     {object}  model.ExpenseReponse
// @Failure      400     {object}  model.ExpenseReponse "corpo da requisição inválido"
// @Failure      500     {object}  model.ExpenseReponse "erro interno do servidor"
// @Router       /expense/create [post]
func (h *ExpenseHandler) CreateExpense(w http.ResponseWriter, r *http.Request) {
	var expense model.Expense
	if err := json.NewDecoder(r.Body).Decode(&expense); err != nil {
		log.Error("Erro ao decodificar JSON: %s", err)
		response.ERROR(w, http.StatusBadRequest, "corpo da requisição inválido")
		return
	}

	userId := r.Context().Value("user_id").(string)
	expense.UserId = userId
	newExpense, err := h.Usecase.CreateExpense(r.Context(), &expense)
	if err != nil {
		log.Error("Erro ao criar despesa: %s", err)
		response.ERROR(w, http.StatusInternalServerError, err.Error())
		return
	}

	log.Success("despesa criada com sucesso!")
	response.OK(w, newExpense)
}
