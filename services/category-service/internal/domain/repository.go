package domain

import (
	"context"

	"github.com/joaogabriel/moneto/service/category/internal/domain/model"
)

type CategoryRepository interface {
	Create(ctx context.Context, category *model.Category) (*model.Category, error)
	Delete(ctx context.Context, id string) error
	Update(ctx context.Context, id string, update model.CategoryUpdate) (*model.Category, error)
	FindById(ctx context.Context, id string) (*model.Category, error)
	List(ctx context.Context) (*[]model.CategoryResponse, error)
}
