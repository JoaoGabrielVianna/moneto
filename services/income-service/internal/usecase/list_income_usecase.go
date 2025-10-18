package usecase

import (
	"context"

	"github.com/joaogabriel/moneto/service/income/internal/domain/model"
)

func (uc *IncomeUsecase) List(ctx context.Context, userId string) (*[]model.IncomeResponse, error) {
	return uc.Repo.List(ctx, userId)
}
