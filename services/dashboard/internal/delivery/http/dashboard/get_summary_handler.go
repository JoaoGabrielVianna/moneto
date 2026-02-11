package dashboard

import (
	"net/http"

	"github.com/joaogabriel/moneto/pkg/utils/response"
)

func (h *DashboardHandler) GetSummary(w http.ResponseWriter, r *http.Request) {
	summary, err := h.Usecase.GetSummary(r.Context())
	if err != nil {
		log.Error("Erro ao obter o resumo do dashboard: %s", err)
		response.Error(w, http.StatusInternalServerError, "Não foi possível carregar o resumo financeiro.")
		return
	}

	log.Success("Resumo financeiro obtido com sucesso.")
	response.Success(w, summary, "Resumo financeiro carregado com sucesso.")
}
