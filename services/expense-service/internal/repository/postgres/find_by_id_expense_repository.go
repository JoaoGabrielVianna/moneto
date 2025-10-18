package postgres

import (
	"context"

	"github.com/joaogabriel/moneto/service/expense/internal/domain/model"
)

func (r *PostgresExpenseRepository) FindById(ctx context.Context, id string) (*model.ExpenseReponse, error) {
	var expense model.ExpenseReponse

	query := `
		SELECT id, user_id, amount, category_id, description, date, notes, created_at, updated_at
		FROM expenses
		WHERE id=$1 AND user_id =$2
	`

	err := r.DB.QueryRowContext(ctx, query, id).Scan(
		&expense.Id,
		&expense.UserId,
		&expense.CategoryId,
		&expense.Amount,
		&expense.Description,
		&expense.Date,
		&expense.Notes,
		&expense.CreatedAt,
		&expense.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}
	return &expense, err
}
