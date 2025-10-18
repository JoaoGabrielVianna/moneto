package domain

import (
	"context"

	"github.com/joaogabriel/moneto/service/expense/internal/domain/model"
)

type ExpenseRepository interface {
	Create(ctx context.Context, expense *model.Expense) (*model.Expense, error)
	FindById(ctx context.Context, id string) (*model.ExpenseReponse, error)
	Update(ctx context.Context, id string, expense model.ExpenseUpdate) (*model.ExpenseReponse, error)
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, userId string) (*[]model.ExpenseReponse, error)
}
