package http

import (
	"encoding/json"
	"net/http"

	"github.com/joaogabriel/moneto/pkg/utils/response"
	"github.com/joaogabriel/moneto/service/user/internal/domain/model"
)

// @Summary Cria um usuário
// @Description Cria um novo usuário no sistema
// @Tags Users
// @Accept json
// @Produce json
// @Param user body model.UserResponse true "Dados do usuário"
// @Success 200 {object} model.UserResponse "Usuário criado com sucesso"
// @Failure 400 {object} model.UserResponse "Erro na requisição"
// @Failure 500 {object} model.UserResponse "Erro interno do servidor"
// @Router /user/create [post]
func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var user model.User

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		log.Error("erro ao decodificar JOSN: %s", err)
		response.Error(w, http.StatusBadRequest, "invalid request body")
		return
	}

	newUser, err := h.Usecase.CreateUser(r.Context(), &user)
	if err != nil {
		log.Error("erro ao criar usuário: %s", err)
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	log.Success("usuário criado com sucesso!")
	response.Success(w, newUser, "Usuário criado com sucesso!")
}
