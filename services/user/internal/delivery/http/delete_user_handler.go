package http

import (
	"net/http"
	"strings"

	"github.com/joaogabriel/moneto/pkg/utils/response"
)

// @Summary Deleta um usuário
// @Description Remove um usuário existente pelo ID fornecido na URL
// @Tags Users
// @Produce json
// @Param id path string true "ID do usuário"
// @Success 200 {object} model.UserResponse "Usuário deletado com sucesso"
// @Failure 400 {object} model.UserResponse "ID do usuário é obrigatório"
// @Failure 500 {object} model.UserResponse "Usuário não encontrado"
// @Failure 500 {object} model.UserResponse "Erro ao deletar usuário"
// @Router /user/delete/{id} [delete]
func (h *UserHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/user/delete/")

	if id == "" {
		log.Error("id do usuário é obrigatório")
		response.Error(w, http.StatusBadRequest, "id do usuário é obrigatório")
		return
	}

	err := h.Usecase.DeleteUser(r.Context(), id)
	if err != nil {
		if err.Error() == "user not found" {
			log.Error("usuário não encontrado: %s", err)
			response.Error(w, http.StatusInternalServerError, "usuário não encontrado")
			return
		}

		log.Error("erro ao deletar usuário: %s", err)
		response.Error(w, http.StatusInternalServerError, "erro ao deletar usuário")
		return
	}

	log.Success("usuário deletado com sucesso!")
	response.Success(w, err, "usuário deletado com sucesso")
}
