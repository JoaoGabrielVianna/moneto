package postgres

import (
	"context"

	"github.com/joaogabriel/moneto/service/expense/internal/domain/model"
)

func (r *PostgresExpenseRepository) List(ctx context.Context, userId string) (*[]model.ExpenseReponse, error) {
	query := `
		SELECT id, user_id, amount, category_id, description, date, notes, created_at, updated_at
		FROM expenses
		WHERE user_id = $1
		ORDER BY date DESC
	`

	rows, err := r.DB.QueryContext(ctx, query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	expenses := []model.ExpenseReponse{}
	for rows.Next() {
		var expense model.ExpenseReponse
		if err := rows.Scan(
			&expense.Id,
			&expense.UserId,
			&expense.Amount,
			&expense.CategoryId,
			&expense.Description,
			&expense.Date,
			&expense.Notes,
			&expense.CreatedAt,
			&expense.UpdatedAt,
		); err != nil {
			return nil, err
		}
		expenses = append(expenses, expense)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return &expenses, nil
}
