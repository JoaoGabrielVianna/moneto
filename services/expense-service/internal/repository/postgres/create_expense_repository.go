package postgres

import (
	"context"

	"github.com/joaogabriel/moneto/service/expense/internal/domain/model"
)

func (r PostgresExpenseRepository) Create(ctx context.Context, expense *model.Expense) (*model.Expense, error) {
	query := `
		INSERT INTO expenses (id, user_id, category_id, amount, description, date, notes)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, user_id, category_id, amount, description, date, notes, created_at, updated_at
	`

	var resp model.ExpenseReponse
	err := r.DB.QueryRowContext(ctx, query,
		expense.Id,
		expense.UserId,
		expense.CategoryId,
		expense.Amount,
		expense.Description,
		expense.Date,
		expense.Notes,
	).Scan(
		&resp.Id,
		&resp.UserId,
		&resp.CategoryId,
		&resp.Amount,
		&resp.Description,
		&resp.Date,
		&resp.Notes,
		&expense.CreatedAt,
		&expense.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return expense, err
}
