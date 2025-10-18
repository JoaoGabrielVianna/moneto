package usecase

import "github.com/joaogabriel/moneto/service/expense/internal/domain"

type ExpenseUsecase struct {
	Repo domain.ExpenseRepository
}

func NewExpenseUsecase(repo domain.ExpenseRepository) *ExpenseUsecase {
	return &ExpenseUsecase{Repo: repo}
}
