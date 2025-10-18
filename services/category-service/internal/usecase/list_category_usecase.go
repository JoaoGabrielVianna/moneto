package usecase

import (
	"context"

	"github.com/joaogabriel/moneto/service/category/internal/domain/model"
)

func (uc *CategoryUsecase) List(ctx context.Context) (*[]model.CategoryResponse, error) {
	return uc.Repo.List(ctx)
}
