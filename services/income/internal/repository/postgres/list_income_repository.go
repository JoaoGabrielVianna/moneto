package postgres

import (
	"context"

	"github.com/joaogabriel/moneto/service/income/internal/domain/model"
)

func (r *PostgresIncomeRepository) List(ctx context.Context, userId string) (*[]model.IncomeResponse, error) {
	query := `
		SELECT id, user_id, amount, category_id, description, date, notes, created_at, updated_at
		FROM incomes
		WHERE user_id = $1
		ORDER BY date DESC
	`

	rows, err := r.DB.QueryContext(ctx, query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	incomes := []model.IncomeResponse{}
	for rows.Next() {
		var income model.IncomeResponse
		if err := rows.Scan(
			&income.Id,
			&income.UserId,
			&income.Amount,
			&income.CategoryId,
			&income.Description,
			&income.Date,
			&income.Notes,
			&income.CreatedAt,
			&income.UpdatedAt,
		); err != nil {
			return nil, err
		}
		incomes = append(incomes, income)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return &incomes, nil
}
