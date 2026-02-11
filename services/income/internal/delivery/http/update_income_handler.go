package http

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/joaogabriel/moneto/pkg/utils/response"
	"github.com/joaogabriel/moneto/service/income/internal/domain/model"
)

// @Summary      Atualizar renda
// @Description  Atualiza informações de uma renda pelo seu ID
// @Tags         Income
// @Accept       json
// @Produce      json
// @Param        id      path      string              true  "ID da renda"
// @Param        update  body      model.IncomeUpdate  true  "Dados para atualização"
// @Success      200     {object}  model.Income
// @Failure      400     {object}  map[string]string "corpo da requisição inválido ou ID ausente"
// @Failure      500     {object}  map[string]string "erro ao atualizar renda"
// @Router       /income/update/{id} [put]
func (h *IncomeHandler) UpdateIncome(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/update/")
	if id == "" {
		log.Error("Id da renda é obrigatória")
		response.Error(w, http.StatusBadRequest, "id da renda é obrigatória")
		return
	}

	var update model.IncomeUpdate
	if err := json.NewDecoder(r.Body).Decode(&update); err != nil {
		log.Error("Erro ao decodificar JSON: %s", err)
		response.Error(w, http.StatusBadRequest, "corpo da requisição inválido")
		return
	}

	income, err := h.Usecase.Update(r.Context(), id, update)

	if err != nil {
		log.Error("erro ao atualizar renda: %s, id: %s", err, id)

		response.Error(w, http.StatusInternalServerError, "erro ao atualizar renda")
		return
	}

	log.Success("Renda atualizada com sucesso!")
	response.Success(w, income, "Renda atualizada com sucesso!")
}
