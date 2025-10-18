package http

import (
	"net/http"
	"strings"

	"github.com/joaogabriel/moneto/pkg/response"
)

// FindById busca uma renda pelo ID
// @Summary      Buscar renda por ID
// @Description  Retorna os dados de uma renda pelo ID
// @Tags         Income
// @Param        id   path      string  true  "ID da renda"
// @Success      200  {object}  model.IncomeResponse
// @Failure      400  {object}  model.IncomeResponse "id da renda é obrigatória"
// @Failure      500  {object}  model.IncomeResponse "renda não encontrada"
// @Router       /income/{id} [get]
func (h *IncomeHandler) FindById(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/")
	if id == "" {
		log.Error("Id da renda é obrigatória")
		response.ERROR(w, http.StatusBadRequest, "id da renda é obrigatória")
		return
	}
	userId := r.Context().Value("user_id").(string)
	income, err := h.Usecase.FindById(r.Context(), id, userId)
	if err != nil {
		if err.Error() == "forbidden" {
			log.Error("você não tem permissão para acessar essa renda")
			response.ERROR(w, http.StatusForbidden, "você não tem permissão para acessar essa renda")
		}
		log.Error("Erro ao buscar renda: %s, id: %s", err, id)
		response.ERROR(w, http.StatusInternalServerError, "erro ao buscar renda")
		return
	}

	if income == nil {
		log.Warn("Renda não encontrada, id: %s", id)
		response.ERROR(w, http.StatusNotFound, "renda não encontrada")
		return
	}

	log.Success("Renda encontrada com sucesso!")
	response.OK(w, income)
}
