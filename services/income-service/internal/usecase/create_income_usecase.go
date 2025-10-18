package usecase

import (
	"context"
	"errors"

	"github.com/joaogabriel/moneto/pkg/utils"
	models "github.com/joaogabriel/moneto/service/income/internal/domain/model"
)

func (uc *IncomeUsecase) CreateIncome(ctx context.Context, income *models.Income) (*models.IncomeResponse, error) {
	if income.Id == "" {
		income.Id = utils.GenerateID()
	}
	if income.Date.IsZero() {
		return nil, errors.New("o campo 'date' é obrigatório")
	}

	user, err := uc.Repo.Create(ctx, income)
	if err != nil {
		return nil, err
	}

	return user, nil
}
