// internal/delivery/http/routes.go
package http

import (
	"net/http"

	"github.com/joaogabriel/moneto/service/user/internal/middlewares"
	"github.com/joaogabriel/moneto/service/user/internal/usecase"
	httpSwagger "github.com/swaggo/http-swagger"
)

func SetupRoutes(mux *http.ServeMux, uc *usecase.UserUsecase, secretKey string) {
	handler := NewUserHandler(uc)
	authMw := middlewares.AuthMiddleware(secretKey)
	corsMw := middlewares.CORSMiddleware

	usersMux := http.NewServeMux()

	// Públicos
	usersMux.Handle("/login", http.HandlerFunc(handler.Login))
	usersMux.Handle("/create", http.HandlerFunc(handler.CreateUser))

	// Protegidos (envolve cada rota com o AuthMiddleware)
	usersMux.Handle("/me", authMw(http.HandlerFunc(handler.Me)))
	usersMux.Handle("/update/", authMw(http.HandlerFunc(handler.Update)))
	usersMux.Handle("/delete/", authMw(http.HandlerFunc(handler.DeleteUser)))
	usersMux.Handle("/list", authMw(http.HandlerFunc(handler.List)))
	usersMux.Handle("/", authMw(http.HandlerFunc(handler.FinbById))) // GET /users/{id}

	// Aplica CORS no conjunto
	mux.Handle("/users/", http.StripPrefix("/users", corsMw(usersMux)))
	mux.Handle("/swagger/", httpSwagger.WrapHandler)
}
