package http

import (
	"github.com/joaogabriel/moneto/pkg/logger"
	"github.com/joaogabriel/moneto/service/expense/internal/usecase"
)

var (
	log = logger.Get("Handler")
)

type ExpenseHandler struct {
	Usecase *usecase.ExpenseUsecase
}

func NewExpenseHandler(uc *usecase.ExpenseUsecase) *ExpenseHandler {
	return &ExpenseHandler{Usecase: uc}
}
