package usecase

import (
	"context"

	"github.com/joaogabriel/moneto/pkg/utils"
	"github.com/joaogabriel/moneto/service/user/internal/domain/model"
)

func (uc *UserUsecase) CreateUser(ctx context.Context, user *model.User) (*model.User, error) {
	if user.Id == "" {
		user.Id = utils.GenerateID()
	}

	user.Password = utils.HashPassword(user.Password)

	return uc.Repo.Create(ctx, user)
}
