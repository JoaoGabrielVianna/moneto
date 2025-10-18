package usecase

import (
	"context"

	"github.com/joaogabriel/moneto/service/expense/internal/domain/model"
)

func (uc *ExpenseUsecase) List(ctx context.Context, userId string) (*[]model.ExpenseReponse, error) {
	return uc.Repo.List(ctx, userId)
}
