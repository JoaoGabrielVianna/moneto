package dashboard

import (
	"net/http"
	"time"

	"github.com/joaogabriel/moneto/pkg/utils/response"
)

func (h *DashboardHandler) GetHistory(w http.ResponseWriter, r *http.Request) {
	period := r.URL.Query().Get("period") // ex: "1m", "6m", "1y"
	groupBy := r.URL.Query().Get("group_by")
	startDate := r.URL.Query().Get("start_date")
	endDate := r.URL.Query().Get("end_date")

	now := time.Now()
	var start, end time.Time

	if startDate != "" && endDate != "" {
		// personalizado
		s, err1 := time.Parse("2006-01-02", startDate)
		e, err2 := time.Parse("2006-01-02", endDate)
		if err1 != nil || err2 != nil {
			response.Error(w, http.StatusBadRequest, "Formato de data inválido. Use YYYY-MM-DD.")
			return
		}
		start, end = s, e
	} else {
		// períodos automáticos
		switch period {
		case "1m":
			start = now.AddDate(0, -1, 0)
			groupBy = "day"
		case "6m":
			start = now.AddDate(0, -6, 0)
			groupBy = "month"
		case "1y":
			start = now.AddDate(-1, 0, 0)
			groupBy = "month"
		default:
			start = now.AddDate(0, -3, 0) // padrão: últimos 3 meses
			groupBy = "month"
		}
		end = now
	}

	if groupBy == "" {
		groupBy = "month"
	}

	history, err := h.Usecase.GetHistory(r.Context(), start, end, groupBy)
	if err != nil {
		log.Error("Erro ao obter histórico financeiro: %v", err)
		response.Error(w, http.StatusInternalServerError, "Não foi possível carregar o histórico financeiro.")
		return
	}

	log.Success("Histórico financeiro obtido com sucesso.")
	response.Success(w, history, "Histórico financeiro carregado com sucesso.")
}
