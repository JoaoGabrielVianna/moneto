package usecase

import (
	"context"

	"github.com/joaogabriel/moneto/service/dashboard/internal/domain/model"
)

func (uc *DashboardUseCase) GetSummary(ctx context.Context) (*model.Summary, error) {
	income, err := uc.Repo.GetTotalIncome(ctx)
	if err != nil {
		return nil, err
	}

	expense, err := uc.Repo.GetTotalExpense(ctx)
	if err != nil {
		return nil, err
	}

	balance := income - expense

	return &model.Summary{
		TotalIncome:  income,
		TotalExpense: expense,
		Balance:      balance,
	}, nil
}
