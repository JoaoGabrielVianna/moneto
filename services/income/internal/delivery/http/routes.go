package http

import (
	"net/http"

	"github.com/joaogabriel/moneto/pkg/middlewares"
	"github.com/joaogabriel/moneto/service/income/config"

	"github.com/joaogabriel/moneto/service/income/internal/usecase"
	httpSwagger "github.com/swaggo/http-swagger"
)

func SetupRoutes(mux *http.ServeMux, uc *usecase.IncomeUsecase) {
	handler := NewIncomeHandler(uc)
	authMw := middlewares.AuthMiddleware(config.GetConfig().JWTSecret, config.GetConfig().InternalAPIKey)

	incomesMux := http.NewServeMux()

	incomesMux.Handle("/create", http.HandlerFunc(handler.CreateIncome))
	incomesMux.Handle("/delete/", http.HandlerFunc(handler.DeleteIncome))
	incomesMux.Handle("/update/", http.HandlerFunc(handler.UpdateIncome))
	incomesMux.Handle("/", http.HandlerFunc(handler.FindById))
	incomesMux.Handle("/list", http.HandlerFunc(handler.List))
	incomesMux.Handle("/batch", http.HandlerFunc(handler.CreateBatch))

	// Primeiro aplica o CORS, depois o Auth
	protectedMux := authMw(incomesMux) // aplica autenticação

	mux.Handle("/incomes/", http.StripPrefix("/incomes", protectedMux))
	mux.Handle("/swagger/", httpSwagger.WrapHandler)
}
