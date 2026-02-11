package usecase

import (
	"github.com/joaogabriel/moneto/service/income/internal/domain"
)

type IncomeUsecase struct {
	Repo domain.IncomeRepository
}

func NewIncomeUsecase(repo domain.IncomeRepository) *IncomeUsecase {
	return &IncomeUsecase{Repo: repo}
}
