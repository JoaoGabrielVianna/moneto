package usecase

import (
	"context"

	"github.com/joaogabriel/moneto/pkg/utils"
	"github.com/joaogabriel/moneto/service/income/internal/domain/model"
)

func (uc *IncomeUsecase) CreateBatchIncomes(ctx context.Context, incomes []model.Income) error {
	for i := range incomes {
		if incomes[i].Id == "" {
			incomes[i].Id = utils.GenerateID()
		}
	}
	return uc.Repo.CreateBatch(ctx, incomes)
}
