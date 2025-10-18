package category_http

import (
	"github.com/joaogabriel/moneto/pkg/logger"
	"github.com/joaogabriel/moneto/service/category/internal/usecase"
)

var (
	log = logger.Get("Handler")
)

type CategoryHandler struct {
	usecase *usecase.CategoryUsecase
}

func NewCategoryHandler(uc *usecase.CategoryUsecase) *CategoryHandler {
	return &CategoryHandler{usecase: uc}
}
