package usecase

import (
	"context"

	"github.com/joaogabriel/moneto/pkg/utils"
	"github.com/joaogabriel/moneto/service/expense/internal/domain/model"
)

func (uc *ExpenseUsecase) CreateBatchExpenses(ctx context.Context, expenses []model.Expense) error {
	for i := range expenses {
		if expenses[i].Id == "" {
			expenses[i].Id = utils.GenerateID()
		}
	}
	return uc.Repo.CreateBatch(ctx, expenses)
}
