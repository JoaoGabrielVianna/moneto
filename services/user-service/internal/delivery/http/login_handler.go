package http

import (
	"encoding/json"
	"net/http"

	"github.com/joaogabriel/moneto/pkg/response"
)

func (h *UserHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Error("Corpo inválido: %s", err)
		response.ERROR(w, http.StatusBadRequest, "corpo inválido")
		return
	}

	token, err := h.Usecase.Login(r.Context(), req.Email, req.Password)
	if err != nil {
		log.Error("Credenciais inválidas: %s", err)
		response.ERROR(w, http.StatusBadRequest, "credenciais inválidas")
		return
	}

	log.Success("Usuário logado com sucesso!")
	response.OK(w, token)
}
