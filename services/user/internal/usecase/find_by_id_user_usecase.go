package usecase

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/joaogabriel/moneto/service/user/internal/domain/model"
)

func (uc UserUsecase) FindById(ctx context.Context, id string) (*model.User, error) {
	u, err := uc.Repo.FindById(ctx, id)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, fmt.Errorf("user not found")
	}
	return u, err
}
