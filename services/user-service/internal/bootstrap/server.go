package bootstrap

import (
	"net/http"

	"github.com/joaogabriel/moneto/pkg/logger"
	"github.com/joaogabriel/moneto/service/user/config"
	httpInternal "github.com/joaogabriel/moneto/service/user/internal/delivery/http"

	"github.com/joaogabriel/moneto/service/user/internal/usecase"
)

var (
	log = logger.Get("Server")
)

func StartServer(uc *usecase.UserUsecase) {
	cfg := config.GetConfig()
	mux := http.NewServeMux()

	httpInternal.SetupRoutes(mux, uc, cfg.SecretKey)

	if err := http.ListenAndServe(":"+cfg.Port, mux); err != nil {
		log.Error("Erro ao iniciar o servidor: %s", err)
	}

}
