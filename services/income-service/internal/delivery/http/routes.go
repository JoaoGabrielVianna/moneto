package http

import (
	"net/http"

	"github.com/joaogabriel/moneto/service/income/internal/middlewares"
	"github.com/joaogabriel/moneto/service/income/internal/usecase"
	httpSwagger "github.com/swaggo/http-swagger"
)

func SetupRoutes(mux *http.ServeMux, uc *usecase.IncomeUsecase, secretKey string) {
	handler := NewIncomeHandler(uc)
	authMw := middlewares.AuthMiddleware(secretKey)
	corsMw := middlewares.CORSMiddleware // seu middleware de CORS

	incomesMux := http.NewServeMux()

	incomesMux.Handle("/create", http.HandlerFunc(handler.CreateIncome))
	incomesMux.Handle("/delete/", http.HandlerFunc(handler.DeleteIncome))
	incomesMux.Handle("/update/", http.HandlerFunc(handler.UpdateIncome))
	incomesMux.Handle("/", http.HandlerFunc(handler.FindById))
	incomesMux.Handle("/list", http.HandlerFunc(handler.List))

	// Primeiro aplica o CORS, depois o Auth
	protectedMux := authMw(incomesMux)           // aplica autenticação
	protectedMuxWithCORS := corsMw(protectedMux) // aplica CORS

	mux.Handle("/incomes/", http.StripPrefix("/incomes", protectedMuxWithCORS))
	mux.Handle("/swagger/", httpSwagger.WrapHandler)
}
