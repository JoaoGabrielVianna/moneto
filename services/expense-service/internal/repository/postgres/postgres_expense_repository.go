package postgres

import (
	"database/sql"

	"github.com/joaogabriel/moneto/service/expense/internal/domain"
)

type PostgresExpenseRepository struct {
	DB *sql.DB
}

func NewPostgresExpenseRepository(db *sql.DB) domain.ExpenseRepository {
	return &PostgresExpenseRepository{DB: db}
}
