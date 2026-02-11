package postgres

import (
	"database/sql"

	"github.com/joaogabriel/moneto/service/dashboard/internal/domain"
)

type PostgresDashboardRepository struct {
	DB *sql.DB
}

func NewPostgresDashboardRepository(db *sql.DB) domain.DashboardRepository {
	return &PostgresDashboardRepository{DB: db}
}
