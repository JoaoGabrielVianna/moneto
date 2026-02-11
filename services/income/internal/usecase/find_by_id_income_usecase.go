package usecase

import (
	"context"
	"fmt"

	"github.com/joaogabriel/moneto/service/income/internal/domain/model"
)

func (uc *IncomeUsecase) FindById(ctx context.Context, id string, userId string) (*model.IncomeResponse, error) {
	income, err := uc.Repo.FindById(ctx, id, userId)
	if err != nil {
		return nil, err
	}
	if income == nil {
		return nil, fmt.Errorf("income not found")
	}
	if income.UserId != userId {
		return nil, fmt.Errorf("forbidden")
	}
	return income, nil
}
