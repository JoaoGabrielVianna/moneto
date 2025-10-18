package bootstrap

import (
	"database/sql"

	"github.com/joaogabriel/moneto/service/expense/internal/repository/postgres"
	"github.com/joaogabriel/moneto/service/expense/internal/usecase"
)

func BuildUseCase(db *sql.DB) *usecase.ExpenseUsecase {
	repo := postgres.NewPostgresExpenseRepository(db)
	uc := usecase.NewExpenseUsecase(repo)

	return uc
}
