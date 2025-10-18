package usecase

import (
	"context"

	"github.com/joaogabriel/moneto/service/user/internal/domain/model"
)

func (uc *UserUsecase) List(ctx context.Context, filter model.UserFilter) ([]model.User, error) {
	return uc.Repo.List(ctx, filter)
}
