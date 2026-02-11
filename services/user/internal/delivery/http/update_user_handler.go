package http

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/joaogabriel/moneto/pkg/utils/response"
	"github.com/joaogabriel/moneto/service/user/internal/domain/model"
)

// @Summary Atualiza usuário
// @Description Atualiza os campos informados do usuário pelo ID
// @Tags Users
// @Accept json
// @Produce json
// @Param id path string true "ID do usuário"
// @Param user body model.UserUpdate true "Campos para atualizar do usuário"
// @Success 200 {object} model.User "Usuário atualizado com sucesso"
// @Failure 400 {object} model.UserResponse "Erro na requisição"
// @Failure 404 {object} model.UserResponse "Usuário não encontrado"
// @Failure 500 {object} model.UserResponse "Erro interno do servidor"
// @Router /user/update/{id} [put]
func (h *UserHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "  /update/")

	if id == "" {
		log.Error("id do usuário é obrigatório")
		response.Error(w, http.StatusBadRequest, "id do usuário é obrigatório")
		return
	}

	var update model.UserUpdate
	if err := json.NewDecoder(r.Body).Decode(&update); err != nil {
		log.Error("erro ao decodificar JSON: %s", err)
		response.Error(w, http.StatusBadRequest, "corpo da requisição inválido")
		return
	}
	user, err := h.Usecase.Update(r.Context(), id, update)
	if err != nil {
		log.Error("erro ao atualizar usuário: %s", err)
		response.Error(w, http.StatusInternalServerError, "erro ao atualizar usuário")
		return
	}

	log.Success("usuário atualizado com sucesso!")
	response.Success(w, user, "usuário atualizado com sucesso!")
}
