package http

import (
	"encoding/json"
	"net/http"

	"github.com/joaogabriel/moneto/pkg/utils/response"
	"github.com/joaogabriel/moneto/service/income/internal/domain/model"
)

// @Summary      Criar renda
// @Description  Cria uma nova renda para um usuário
// @Tags         Income
// @Accept       json
// @Produce      json
// @Param        income  body      model.IncomeResponse  true  "Dados da renda"
// @Success      200     {object}  model.IncomeResponse
// @Failure      400     {object}  model.IncomeResponse "corpo da requisição inválido"
// @Failure      500     {object}  model.IncomeResponse "erro interno do servidor"
// @Router       /incomes/create [post]
func (h *IncomeHandler) CreateIncome(w http.ResponseWriter, r *http.Request) {
	var income model.Income
	if err := json.NewDecoder(r.Body).Decode(&income); err != nil {
		log.Error("Erro ao decodificar JSON: %s", err)
		response.Error(w, http.StatusBadRequest, "corpo da requisição inválido")
		return
	}

	userId := r.Context().Value("user_id").(string)
	income.UserId = userId
	newIncome, err := h.Usecase.CreateIncome(r.Context(), &income)
	if err != nil {
		log.Error("Erro ao criar renda: %s", err)
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	log.Success("Renda criada com sucesso!")
	response.Success(w, newIncome, "Renda criada com sucesso!")
}
