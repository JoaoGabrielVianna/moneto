package bootstrap

import (
	"database/sql"

	"github.com/joaogabriel/moneto/service/dashboard/internal/repository/postgres"
	usecase "github.com/joaogabriel/moneto/service/dashboard/internal/usecase/dashboard"
)

func BuildUseCase(db *sql.DB) *usecase.DashboardUseCase {
	repo := postgres.NewPostgresDashboardRepository(db)
	uc := usecase.NewDashboardUsecase(repo)
	return uc
}
