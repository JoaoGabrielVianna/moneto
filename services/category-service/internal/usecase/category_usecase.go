package usecase

import "github.com/joaogabriel/moneto/service/category/internal/domain"

type CategoryUsecase struct {
	Repo domain.CategoryRepository
}

func NewCategoryUsecase(repo domain.CategoryRepository) *CategoryUsecase {
	return &CategoryUsecase{Repo: repo}
}
