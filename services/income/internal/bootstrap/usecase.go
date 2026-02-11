package bootstrap

import (
	"database/sql"

	"github.com/joaogabriel/moneto/service/income/internal/repository/postgres"
	"github.com/joaogabriel/moneto/service/income/internal/usecase"
)

func BuildUseCase(db *sql.DB) *usecase.IncomeUsecase {
	repo := postgres.NewPostgresIncomeRepository(db)
	uc := usecase.NewIncomeUsecase(repo)

	return uc
}
