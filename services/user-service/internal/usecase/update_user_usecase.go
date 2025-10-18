package usecase

import (
	"context"

	"github.com/joaogabriel/moneto/pkg/utils"
	"github.com/joaogabriel/moneto/service/user/internal/domain/model"
)

func (uc *UserUsecase) Update(ctx context.Context, id string, update model.UserUpdate) (*model.User, error) {
	if update.Password != nil && *update.Password != "" {
		hashed := utils.HashPassword(*update.Password)
		update.Password = &hashed
	} else {
		update.Password = nil // evita atualizar senha com string vazia
	}

	return uc.Repo.Update(ctx, id, update)
}
