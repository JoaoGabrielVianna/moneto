package bootstrap

import (
	"net/http"

	"github.com/joaogabriel/moneto/pkg/logger"
	"github.com/joaogabriel/moneto/pkg/middlewares"
	"github.com/joaogabriel/moneto/service/dashboard/config"
	delivery "github.com/joaogabriel/moneto/service/dashboard/internal/delivery/http"
	usecase "github.com/joaogabriel/moneto/service/dashboard/internal/usecase/dashboard"
)

var log = logger.Get("Server")

// ========================================
// StartServer
// ----------------------------------------
// Inicializa o servidor HTTP do serviço de usuários.
// Faz o bind das rotas, aplica middlewares e inicia o listener.
//
// ========================================
func StartServer(uc *usecase.DashboardUseCase) {
	cfg := config.GetConfig()
	mux := http.NewServeMux()

	delivery.SetupRoutes(mux, uc)
	handler := middlewares.CORS(mux)

	addr := ":" + cfg.Port

	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Error("❌ Falha ao iniciar servidor HTTP: %s", err)
		return
	}
}
