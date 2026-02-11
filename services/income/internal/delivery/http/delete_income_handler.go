package http

import (
	"net/http"
	"strings"

	"github.com/joaogabriel/moneto/pkg/utils/response"
)

// DeleteIncome deleta uma renda pelo ID
// @Summary      Deletar renda
// @Description  Remove uma renda existente pelo seu ID
// @Tags         Income
// @Param        id   path      string  true  "ID da renda"
// @Success      200  {object}  nil
// @Failure      400  {object}  map[string]string "id da renda é obrigatória"
// @Failure      500  {object}  map[string]string "renda não deletada"
// @Router       /income/delete/{id} [delete]
func (h *IncomeHandler) DeleteIncome(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/delete/")
	if id == "" {
		log.Error("Id da renda é obrigatória")
		response.Error(w, http.StatusBadRequest, "id da renda é obrigatória")
		return
	}

	err := h.Usecase.Delete(r.Context(), id)
	if err != nil {
		log.Error("Renda não deletada: %s, id: %s", err, id)
		response.Error(w, http.StatusInternalServerError, "renda não deletada")
		return
	}

	log.Success("Renda deletada com sucesso!")
	response.Success(w, err, "Renda deletada com sucesso!")
}
