package bootstrap

import (
	"net/http"

	"github.com/joaogabriel/moneto/pkg/logger"
	"github.com/joaogabriel/moneto/service/category/config"
	category_http "github.com/joaogabriel/moneto/service/category/internal/delivery/http"
	"github.com/joaogabriel/moneto/service/category/internal/usecase"
)

var (
	log = logger.Get("Server")
)

func StartServer(uc *usecase.CategoryUsecase) {
	cfg := config.GetConfig()
	mux := http.NewServeMux()

	category_http.SetupRoutes(mux, uc, cfg.SecretKey)
	if err := http.ListenAndServe(":3004", mux); err != nil {
		log.Error("Erro ao iniciar o servidor: %s", err)
	}
}
