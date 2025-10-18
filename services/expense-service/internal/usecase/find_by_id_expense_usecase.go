package usecase

import (
	"context"
	"fmt"

	"github.com/joaogabriel/moneto/service/expense/internal/domain/model"
)

func (uc *ExpenseUsecase) FindById(ctx context.Context, id string) (*model.ExpenseReponse, error) {
	expense, err := uc.Repo.FindById(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("expense not found")
	}
	return expense, nil
}
