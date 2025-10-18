package http

import (
	"net/http"

	"github.com/joaogabriel/moneto/pkg/response"
)

func (h *UserHandler) Me(w http.ResponseWriter, r *http.Request) {
	userId, ok := r.Context().Value("user_id").(string)
	if !ok || userId == "" {
		response.ERROR(w, http.StatusUnauthorized, "usuário não autorizado")
		return
	}

	user, err := h.Usecase.FindById(r.Context(), userId)
	if err != nil {
		response.ERROR(w, http.StatusNotFound, "usuário não encontrado")
		return
	}

	response.OK(w, user) // UserResponse
}
