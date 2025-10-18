package usecase

import (
	"context"

	"github.com/joaogabriel/moneto/service/category/internal/domain/model"
)

func (uc *CategoryUsecase) Update(ctx context.Context, id string, update model.CategoryUpdate) (*model.Category, error) {
	return uc.Repo.Update(ctx, id, update)
}
