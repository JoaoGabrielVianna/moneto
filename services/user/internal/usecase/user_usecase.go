package usecase

import (
	"github.com/joaogabriel/moneto/service/user/config"
	"github.com/joaogabriel/moneto/service/user/internal/domain"
)

type UserUsecase struct {
	Repo      domain.UserRepository
	SecretKey string
}

func NewUserUsecase(repo domain.UserRepository) *UserUsecase {
	return &UserUsecase{
		Repo:      repo,
		SecretKey: config.GetConfig().JWTSecret,
	}
}
