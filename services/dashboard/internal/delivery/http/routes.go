package delivery

import (
	"net/http"

	"github.com/joaogabriel/moneto/pkg/middlewares"

	"github.com/joaogabriel/moneto/service/dashboard/config"
	"github.com/joaogabriel/moneto/service/dashboard/internal/delivery/http/dashboard"
	usecase "github.com/joaogabriel/moneto/service/dashboard/internal/usecase/dashboard"
)

func SetupRoutes(mux *http.ServeMux, uc *usecase.DashboardUseCase) {
	handler := dashboard.NewDashboardHandler(uc)
	cfg := config.GetConfig()

	dashboardMux := http.NewServeMux()

	// --------------------
	// Middleware de autenticação (JWT ou Internal API Key)
	// --------------------
	authMiddleware := middlewares.AuthMiddleware(cfg.JWTSecret, cfg.InternalAPIKey)

	// --------------------
	// Define cada rota do módulo de usuários
	// --------------------
	dashboardMux.Handle("/summary", authMiddleware(http.HandlerFunc(handler.GetSummary)))
	dashboardMux.Handle("/history", authMiddleware(http.HandlerFunc(handler.GetHistory)))

	// --------------------
	// Registra o roteador interno no mux principal
	// 	O StripPrefix remove "/users" antes do encaminhamento
	// --------------------
	mux.Handle("/dashboard/", http.StripPrefix("/dashboard", dashboardMux))
}
