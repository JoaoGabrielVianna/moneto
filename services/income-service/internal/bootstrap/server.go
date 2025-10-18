package bootstrap

import (
	"net/http"

	"github.com/joaogabriel/moneto/pkg/logger"
	"github.com/joaogabriel/moneto/service/income/config"
	httpInternal "github.com/joaogabriel/moneto/service/income/internal/delivery/http"

	"github.com/joaogabriel/moneto/service/income/internal/usecase"
)

var (
	log = logger.Get("Server")
)

func StartServer(uc *usecase.IncomeUsecase) {
	cfg := config.GetConfig()
	mux := http.NewServeMux()
	httpInternal.SetupRoutes(mux, uc, cfg.SecretKey)

	if err := http.ListenAndServe(":"+cfg.Port, mux); err != nil {
		log.Error("Erro ao iniciar o servidor: %s", err)
	}
}
