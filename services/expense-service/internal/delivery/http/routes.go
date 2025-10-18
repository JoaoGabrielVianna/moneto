package http

import (
	"net/http"

	"github.com/joaogabriel/moneto/service/expense/internal/middlewares"
	"github.com/joaogabriel/moneto/service/expense/internal/usecase"
	httpSwagger "github.com/swaggo/http-swagger"
)

func SetupRoutes(mux *http.ServeMux, uc *usecase.ExpenseUsecase, secretKey string) {
	handler := NewExpenseHandler(uc)
	authMw := middlewares.AuthMiddleware(secretKey)
	corsMw := middlewares.CORSMiddleware // seu middleware de CORS

	expenseMux := http.NewServeMux()

	expenseMux.Handle("/create", http.HandlerFunc(handler.CreateExpense))
	expenseMux.Handle("/delete/", http.HandlerFunc(handler.DeleteExpense))
	expenseMux.Handle("/update/", http.HandlerFunc(handler.UpdateExpense))
	expenseMux.Handle("/", http.HandlerFunc(handler.FindByIdExpense))
	expenseMux.Handle("/list", http.HandlerFunc(handler.List))

	// Primeiro aplica o CORS, depois o Auth
	protectedMux := authMw(expenseMux)           // aplica autenticação
	protectedMuxWithCORS := corsMw(protectedMux) // aplica CORS

	mux.Handle("/expenses/", http.StripPrefix("/expenses", protectedMuxWithCORS))
	mux.Handle("/swagger/", httpSwagger.WrapHandler)
}
