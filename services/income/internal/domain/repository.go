package domain

import (
	"context"

	"github.com/joaogabriel/moneto/service/income/internal/domain/model"
)

type IncomeRepository interface {
	Create(ctx context.Context, income *model.Income) (*model.IncomeResponse, error)
	Delete(ctx context.Context, id string) error
	Update(ctx context.Context, id string, update model.IncomeUpdate) (*model.IncomeResponse, error)
	FindById(ctx context.Context, id string, userId string) (*model.IncomeResponse, error)
	List(ctx context.Context, userId string) (*[]model.IncomeResponse, error)
	CreateBatch(ctx context.Context, incomes []model.Income) error
}
