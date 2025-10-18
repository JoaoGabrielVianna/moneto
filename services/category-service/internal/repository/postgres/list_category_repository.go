package postgres

import (
	"context"

	"github.com/joaogabriel/moneto/service/category/internal/domain/model"
)

// repository/postgres/list_category_repository.go
func (r *PostgresCategoryRepository) List(ctx context.Context) (*[]model.CategoryResponse, error) {
	query := `
		SELECT id, name, type, description, color, created_at, updated_at
		FROM categories
		ORDER BY name ASC
	`

	rows, err := r.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := []model.CategoryResponse{}
	for rows.Next() {
		var c model.CategoryResponse
		if err := rows.Scan(
			&c.Id,
			&c.Name,
			&c.Type,
			&c.Description,
			&c.Color,
			&c.CreatedAt,
			&c.UpdatedAt,
		); err != nil {
			return nil, err
		}
		out = append(out, c)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return &out, nil
}
