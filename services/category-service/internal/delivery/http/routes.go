package category_http

import (
	"net/http"

	"github.com/joaogabriel/moneto/service/category/internal/middlewares"
	"github.com/joaogabriel/moneto/service/category/internal/usecase"
	httpSwagger "github.com/swaggo/http-swagger"
)

func SetupRoutes(mux *http.ServeMux, uc *usecase.CategoryUsecase, secretKey string) {
	handler := NewCategoryHandler(uc)

	authMw := middlewares.AuthMiddleware(secretKey) // autenticação via secret
	corsMw := middlewares.CORSMiddleware            // CORS

	// Submux específico de categorias
	categoryMux := http.NewServeMux()
	categoryMux.Handle("/create", http.HandlerFunc(handler.CreateCategory))
	categoryMux.Handle("/delete/", http.HandlerFunc(handler.DeleteCategory))
	categoryMux.Handle("/update/", http.HandlerFunc(handler.UpdateCategory))
	categoryMux.Handle("/list", http.HandlerFunc(handler.List))
	categoryMux.Handle("/", http.HandlerFunc(handler.FindByIdCategory))

	// Aplica primeiro Auth, depois CORS (mesmo padrão do incomes)
	protectedMux := authMw(categoryMux)
	protectedMuxWithCORS := corsMw(protectedMux)

	mux.Handle("/category/", http.StripPrefix("/category", protectedMuxWithCORS))
	mux.Handle("/swagger/", httpSwagger.WrapHandler)
}
