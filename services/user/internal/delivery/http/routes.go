// ========================================
// USER SERVICE - HTTP Routes Setup
// ----------------------------------------
// Define e registra todas as rotas HTTP do serviço de usuários.
//
// Camadas envolvidas:
//   - delivery/http/user → Handlers de endpoints (controladores)
//   - usecase/user → Regras de negócio
//   - middlewares → Autenticação e autorização
//
// Autor: João Gabriel | Projeto Moneto
// ========================================
package http

import (
	"net/http"

	"github.com/joaogabriel/moneto/pkg/config"
	"github.com/joaogabriel/moneto/service/user/internal/middlewares"
	"github.com/joaogabriel/moneto/service/user/internal/usecase"
	httpSwagger "github.com/swaggo/http-swagger"
)

// ========================================
// SetupRoutes
// ----------------------------------------
// Configura todas as rotas HTTP do serviço de usuários.
//
// Etapas executadas:
//  1. Cria o handler principal (com a instância do caso de uso).
//  2. Cria um novo roteador interno (usersMux) apenas para rotas de usuários.
//  3. Define as rotas protegidas por middleware de autenticação JWT.
//  4. Registra o roteador no mux principal, com prefixo "/users".
//
// Parâmetros:
//   - mux (*http.ServeMux): roteador principal do servidor HTTP.
//   - uc (*usecase.UserUsecase): instância com regras de negócio e repositório.
//
// Observação:
//   - As rotas são registradas com prefixo "/users", mas o `http.StripPrefix`
//     remove esse prefixo antes de chamar os handlers internos, garantindo
//     compatibilidade com chamadas diretas como /users/create.
//
// ========================================
func SetupRoutes(mux *http.ServeMux, uc *usecase.UserUsecase) {
	handler := NewUserHandler(uc)

	authMw := middlewares.AuthMiddleware(config.GetConfig().JWTSecret)

	// --------------------
	// Cria um roteador dedicado apenas às rotas de usuários
	// --------------------
	usersMux := http.NewServeMux()

	// Públicos
	usersMux.Handle("/login", http.HandlerFunc(handler.Login))
	usersMux.Handle("/create", http.HandlerFunc(handler.CreateUser))

	// --------------------
	// Define cada rota do módulo de usuários
	// --------------------
	usersMux.Handle("/me", authMw(http.HandlerFunc(handler.Me)))
	usersMux.Handle("/update/", authMw(http.HandlerFunc(handler.Update)))
	usersMux.Handle("/delete/", authMw(http.HandlerFunc(handler.DeleteUser)))
	usersMux.Handle("/list", authMw(http.HandlerFunc(handler.List)))
	usersMux.Handle("/", authMw(http.HandlerFunc(handler.FinbById))) // GET /users/{id}

	// --------------------
	// Registra o roteador interno no mux principal
	// 	O StripPrefix remove "/users" antes do encaminhamento
	// --------------------
	mux.Handle("/users/", http.StripPrefix("/users", usersMux))
	mux.Handle("/swagger/", httpSwagger.WrapHandler)
}
