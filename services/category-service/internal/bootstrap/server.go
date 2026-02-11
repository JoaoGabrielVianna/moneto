package bootstrap

import (
	"net/http"

	"github.com/joaogabriel/moneto/pkg/logger"
	"github.com/joaogabriel/moneto/pkg/middlewares"
	category_http "github.com/joaogabriel/moneto/service/category/internal/delivery/http"
	"github.com/joaogabriel/moneto/service/category/internal/usecase"
)

var (
	log = logger.Get("Server")
)

func StartServer(uc *usecase.CategoryUsecase) {
	mux := http.NewServeMux()

	category_http.SetupRoutes(mux, uc)

	handler := middlewares.CORS(mux)
	if err := http.ListenAndServe(":3004", handler); err != nil {
		log.Error("Erro ao iniciar o servidor: %s", err)
	}
}
