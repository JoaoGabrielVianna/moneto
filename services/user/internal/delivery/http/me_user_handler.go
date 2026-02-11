package http

import (
	"net/http"

	"github.com/joaogabriel/moneto/pkg/utils/response"
)

func (h *UserHandler) Me(w http.ResponseWriter, r *http.Request) {
	userId, ok := r.Context().Value("user_id").(string)
	if !ok || userId == "" {
		response.Error(w, http.StatusUnauthorized, "usuário não autorizado")
		return
	}

	user, err := h.Usecase.FindById(r.Context(), userId)
	if err != nil {
		response.Error(w, http.StatusNotFound, "usuário não encontrado")
		return
	}

	response.Success(w, user, "") // UserResponse
}
