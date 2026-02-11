package http

import (
	"net/http"

	"github.com/joaogabriel/moneto/pkg/utils/response"
	"github.com/joaogabriel/moneto/service/user/internal/domain/model"
)

// @Summary Lista usuários
// @Description Retorna lista de usuários filtrada por parâmetros opcionais id, name e email
// @Tags Users
// @Produce json
// @Param id query string false "Filtro por ID do usuário"
// @Param name query string false "Filtro por nome do usuário"
// @Param email query string false "Filtro por email do usuário"
// @Success 200 {array} model.User "Lista de usuários retornada com sucesso"
// @Failure 400 {object} model.UserResponse "Erro na requisição"
// @Router /users/ [get]
func (h UserHandler) List(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	filter := model.UserFilter{
		Id:    q.Get("id"),
		Name:  q.Get("name"),
		Email: q.Get("email"),
	}

	users, err := h.Usecase.List(r.Context(), filter)
	if err != nil {
		log.Error("erro ao listar usuários: %s", err)
		response.Error(w, http.StatusBadRequest, err.Error())
		return
	}

	log.Success("usuários listados com sucesso!")
	response.Success(w, users, "Usuários listados com sucesso!")
}
