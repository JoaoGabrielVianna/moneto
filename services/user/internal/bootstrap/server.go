// ========================================
// USER SERVICE - HTTP Server Bootstrap
// ----------------------------------------
// Responsável por iniciar o servidor HTTP
// do serviço de usuários, configurando rotas e logs.
//
// Autor: João Gabriel | Projeto Moneto
// ========================================
package bootstrap

import (
	"net/http"

	"github.com/joaogabriel/moneto/pkg/logger"
	"github.com/joaogabriel/moneto/pkg/middlewares"
	"github.com/joaogabriel/moneto/service/user/config"
	httpInternal "github.com/joaogabriel/moneto/service/user/internal/delivery/http"

	"github.com/joaogabriel/moneto/service/user/internal/usecase"
)

var log = logger.Get("Server")

// ========================================
// StartServer
// ----------------------------------------
// Inicializa o servidor HTTP do serviço de usuários.
// Faz o bind das rotas, aplica middlewares e inicia o listener.
//
// ========================================
func StartServer(uc *usecase.UserUsecase) {
	cfg := config.GetConfig()
	mux := http.NewServeMux()

	httpInternal.SetupRoutes(mux, uc)

	handler := middlewares.CORS(mux)

	addr := ":" + cfg.Port

	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Error("Erro ao iniciar o servidor: %s", err)
	}

}
