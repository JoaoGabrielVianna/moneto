package usecase

import (
	"context"

	"github.com/joaogabriel/moneto/service/income/internal/domain/model"
)

func (uc *IncomeUsecase) Update(ctx context.Context, id string, update model.IncomeUpdate) (*model.IncomeResponse, error) {
	return uc.Repo.Update(ctx, id, update)
}
