package http

import (
	"github.com/joaogabriel/moneto/pkg/logger"
	"github.com/joaogabriel/moneto/service/income/internal/usecase"
)

var (
	log = logger.Get("Handler")
)

type IncomeHandler struct {
	Usecase *usecase.IncomeUsecase
}

func NewIncomeHandler(uc *usecase.IncomeUsecase) *IncomeHandler {
	return &IncomeHandler{Usecase: uc}
}
