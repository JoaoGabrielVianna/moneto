package http

import (
	"net/http"
	"strings"

	"github.com/joaogabriel/moneto/pkg/response"
)

// @Summary Busca usuário por ID
// @Description Retorna os dados do usuário correspondente ao ID fornecido na URL
// @Tags Users
// @Produce json
// @Param id path string true "ID do usuário"
// @Success 200 {object} model.UserResponse "Usuário encontrado com sucesso"
// @Failure 400 {object} model.UserResponse "ID do usuário é obrigatório"
// @Failure 500 {object} model.UserResponse "Usuário não encontrado"
// @Router /user/{id} [get]
func (h UserHandler) FinbById(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/")
	if id == "" {
		log.Error("id do usuário é obrigatório")
		response.ERROR(w, http.StatusBadRequest, "id do usuário é obrigatório")
		return
	}

	user, err := h.Usecase.FindById(r.Context(), id)
	if err != nil {
		log.Error("usuário não encontrado: %s, id: %s", err, id)
		response.ERROR(w, http.StatusInternalServerError, "usuário não encontrado")
		return
	}

	log.Success("usuário encontrado com sucesso!")
	response.OK(w, user)

}
