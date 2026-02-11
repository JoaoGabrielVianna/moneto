package postgres

import (
	"context"

	"github.com/joaogabriel/moneto/service/income/internal/domain/model"
)

func (r PostgresIncomeRepository) Create(ctx context.Context, income *model.Income) (*model.IncomeResponse, error) {
	query := `
		INSERT INTO incomes (id, user_id, category_id, amount, description, date, notes)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, user_id, category_id, amount, description, date, notes, created_at, updated_at
	`

	var resp model.IncomeResponse
	err := r.DB.QueryRowContext(ctx, query,
		income.Id,
		income.UserId,
		income.CategoryId,
		income.Amount,
		income.Description,
		income.Date,
		income.Notes,
	).Scan(
		&resp.Id,
		&resp.UserId,
		&resp.CategoryId,
		&resp.Amount,
		&resp.Description,
		&resp.Date,
		&resp.Notes,
		&income.CreatedAt,
		&income.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &resp, err
}
