package http

import (
	"net/http"

	"github.com/joaogabriel/moneto/pkg/config"
	"github.com/joaogabriel/moneto/pkg/middlewares"

	"github.com/joaogabriel/moneto/service/expense/internal/usecase"
	httpSwagger "github.com/swaggo/http-swagger"
)

func SetupRoutes(mux *http.ServeMux, uc *usecase.ExpenseUsecase) {
	handler := NewExpenseHandler(uc)
	authMw := middlewares.AuthMiddleware(config.GetConfig().JWTSecret, config.GetConfig().InternalAPIKey)

	expenseMux := http.NewServeMux()

	expenseMux.Handle("/create", http.HandlerFunc(handler.CreateExpense))
	expenseMux.Handle("/delete/", http.HandlerFunc(handler.DeleteExpense))
	expenseMux.Handle("/update/", http.HandlerFunc(handler.UpdateExpense))
	expenseMux.Handle("/", http.HandlerFunc(handler.FindByIdExpense))
	expenseMux.Handle("/list", http.HandlerFunc(handler.List))
	expenseMux.Handle("/batch", http.HandlerFunc(handler.CreateBatch))

	// Primeiro aplica o CORS, depois o Auth
	protectedMux := authMw(expenseMux) // aplica autenticação

	mux.Handle("/expenses/", http.StripPrefix("/expenses", protectedMux))
	mux.Handle("/swagger/", httpSwagger.WrapHandler)
}
