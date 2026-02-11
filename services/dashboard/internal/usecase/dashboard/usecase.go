package usecase

import "github.com/joaogabriel/moneto/service/dashboard/internal/domain"

type DashboardUseCase struct {
	Repo domain.DashboardRepository
}

func NewDashboardUsecase(repo domain.DashboardRepository) *DashboardUseCase {
	return &DashboardUseCase{Repo: repo}
}
