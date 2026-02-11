package http

import (
	"net/http"

	"github.com/joaogabriel/moneto/pkg/utils/response"
)

func (h *ExpenseHandler) List(w http.ResponseWriter, r *http.Request) {
	// Pega o userId do contexto (passado pelo middleware)
	userId, ok := r.Context().Value("user_id").(string)
	if !ok || userId == "" {
		log.Error("user_id não encontrado no contexto")
		response.Error(w, http.StatusUnauthorized, "usuário não autorizado")
		return
	}

	// Chama o usecase para listar todas as despesas do usuário
	expenses, err := h.Usecase.List(r.Context(), userId)
	if err != nil {
		log.Error("Erro ao listar despesas: %s", err)
		response.Error(w, http.StatusInternalServerError, "erro ao listar despesas")
		return
	}

	log.Success("Despesas listadas com sucesso para user_id: %s", userId)
	log.Info("user_id no context: %s", userId)
	response.Success(w, expenses, "Despesas listadas com sucesso") // envia a lista de ExpenseR

}
