package postgres

import (
	"database/sql"

	"github.com/joaogabriel/moneto/service/income/internal/domain"
)

type PostgresIncomeRepository struct {
	DB *sql.DB
}

func NewPostgresIncomeRepository(db *sql.DB) domain.IncomeRepository {
	return &PostgresIncomeRepository{DB: db}
}
