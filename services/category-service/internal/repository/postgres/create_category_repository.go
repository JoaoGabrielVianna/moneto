package postgres

import (
	"context"

	"github.com/joaogabriel/moneto/service/category/internal/domain/model"
)

func (p *PostgresCategoryRepository) Create(ctx context.Context, category *model.Category) (*model.Category, error) {
	query := `INSERT INTO categories (id, name, type, description, color) VALUES ($1, $2, $3, $4, $5) RETURNING created_at, updated_at`

	err := p.DB.QueryRowContext(ctx, query,
		category.Id, category.Name, category.Type, category.Description, category.Color,
	).Scan(&category.CreatedAt, &category.UpdatedAt)

	if err != nil {
		return nil, err
	}
	return category, nil
}
