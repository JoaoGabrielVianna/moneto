package postgres

import (
	"context"

	"github.com/joaogabriel/moneto/service/category/internal/domain/model"
)

func (r *PostgresCategoryRepository) FindById(ctx context.Context, id string) (*model.Category, error) {
	var category model.Category
	query := `SELECT id, name, type, description,color , created_at, updated_at  FROM categories WHERE id=$1`

	err := r.DB.QueryRowContext(ctx, query, id).Scan(
		&category.Id, &category.Name, &category.Type, &category.Description, &category.Color, &category.CreatedAt, &category.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}
	return &category, nil
}
