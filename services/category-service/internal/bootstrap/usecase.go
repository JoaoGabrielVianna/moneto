package bootstrap

import (
	"database/sql"

	"github.com/joaogabriel/moneto/service/category/internal/repository/postgres"
	"github.com/joaogabriel/moneto/service/category/internal/usecase"
)

func BuildUseCase(db *sql.DB) *usecase.CategoryUsecase {
	repo := postgres.NewPostgresCategoryRepository(db)
	uc := usecase.NewCategoryUsecase(repo)

	return uc
}
