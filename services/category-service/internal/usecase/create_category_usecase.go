package usecase

import (
	"context"

	"github.com/joaogabriel/moneto/pkg/utils"

	"github.com/joaogabriel/moneto/service/category/internal/domain/model"
)

func (uc *CategoryUsecase) CreateCategory(ctx context.Context, category *model.Category) (*model.Category, error) {
	if category.Id == "" {
		category.Id = utils.GenerateID()
	}
	return uc.Repo.Create(ctx, category)
}
