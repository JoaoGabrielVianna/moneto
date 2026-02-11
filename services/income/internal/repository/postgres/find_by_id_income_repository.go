package postgres

import (
	"context"
	"database/sql"
	"errors"

	"github.com/joaogabriel/moneto/service/income/internal/domain/model"
)

func (r *PostgresIncomeRepository) FindById(ctx context.Context, id string, userId string) (*model.IncomeResponse, error) {
	query := `
		SELECT id, user_id, amount, category_id, description, date, notes, created_at, updated_at
		FROM incomes
		WHERE id=$1 AND user_id =$2
	`

	var income model.IncomeResponse

	err := r.DB.QueryRowContext(ctx, query, id, userId).Scan(
		&income.Id,
		&income.UserId,
		&income.CategoryId,
		&income.Amount,
		&income.Description,
		&income.Date,
		&income.Notes,
		&income.CreatedAt,
		&income.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return &income, nil

}
