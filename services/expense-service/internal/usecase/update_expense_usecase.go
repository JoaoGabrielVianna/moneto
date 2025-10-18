package usecase

import (
	"context"

	"github.com/joaogabriel/moneto/service/expense/internal/domain/model"
)

func (uc *ExpenseUsecase) Update(ctx context.Context, id string, update model.ExpenseUpdate) (*model.ExpenseReponse, error) {
	return uc.Repo.Update(ctx, id, update)
}
