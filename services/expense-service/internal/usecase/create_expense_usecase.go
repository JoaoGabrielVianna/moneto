package usecase

import (
	"context"
	"errors"

	"github.com/joaogabriel/moneto/pkg/utils"
	"github.com/joaogabriel/moneto/service/expense/internal/domain/model"
)

func (uc *ExpenseUsecase) CreateExpense(ctx context.Context, expense *model.Expense) (*model.Expense, error) {
	if expense.Id == "" {
		expense.Id = utils.GenerateID()
	}
	if expense.Date.IsZero() {
		return nil, errors.New("o campo 'date' é obrigatório")
	}
	user, err := uc.Repo.Create(ctx, expense)
	if err != nil {
		return nil, err
	}

	return user, nil
}
