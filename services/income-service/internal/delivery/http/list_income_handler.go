package http

import (
	"net/http"

	"github.com/joaogabriel/moneto/pkg/response"
)

func (h *IncomeHandler) List(w http.ResponseWriter, r *http.Request) {
	// Pega o userId do contexto (passado pelo middleware)
	userId, ok := r.Context().Value("user_id").(string)
	if !ok || userId == "" {
		log.Error("user_id não encontrado no contexto")
		response.ERROR(w, http.StatusUnauthorized, "usuário não autorizado")
		return
	}

	// Chama o usecase para listar todas as receitas do usuário
	incomes, err := h.Usecase.List(r.Context(), userId)
	if err != nil {
		log.Error("Erro ao listar receitas: %s", err)
		response.ERROR(w, http.StatusInternalServerError, "erro ao listar receitas")
		return
	}

	log.Success("Receitas listadas com sucesso para user_id: %s", userId)
	response.OK(w, incomes)
}
