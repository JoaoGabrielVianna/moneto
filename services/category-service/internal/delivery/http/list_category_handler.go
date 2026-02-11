package category_http

import (
	"net/http"

	"github.com/joaogabriel/moneto/pkg/utils/response"
)

func (h *CategoryHandler) List(w http.ResponseWriter, r *http.Request) {
	// Mantém auth (requer user_id no contexto), mas não usamos na query
	if _, ok := r.Context().Value("user_id").(string); !ok {
		log.Error("user_id não encontrado no contexto")
		response.Error(w, http.StatusUnauthorized, "usuário não autorizado")
		return
	}

	cats, err := h.usecase.List(r.Context())
	if err != nil {
		log.Error("Erro ao listar categorias: %s", err)
		response.Error(w, http.StatusInternalServerError, "erro ao listar categorias")
		return
	}

	log.Success("Categorias listadas com sucesso (escopo global)")
	response.Success(w, cats, "Categorias listadas com sucesso (escopo global)")
}
