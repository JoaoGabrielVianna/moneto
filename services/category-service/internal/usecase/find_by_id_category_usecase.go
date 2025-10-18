package usecase

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/joaogabriel/moneto/service/category/internal/domain/model"
)

func (uc CategoryUsecase) FindById(ctx context.Context, id string) (*model.Category, error) {
	u, err := uc.Repo.FindById(ctx, id)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, fmt.Errorf("category not found")
	}
	return u, err
}
