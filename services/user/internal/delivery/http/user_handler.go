package http

import (
	"github.com/joaogabriel/moneto/pkg/logger"
	"github.com/joaogabriel/moneto/service/user/internal/usecase"
)

var (
	log = logger.Get("Handler")
)

type UserHandler struct {
	Usecase *usecase.UserUsecase
}

func NewUserHandler(uc *usecase.UserUsecase) *UserHandler {
	return &UserHandler{Usecase: uc}
}
