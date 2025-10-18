package postgres

import (
	"context"
	"database/sql"
	"errors"
	"strconv"
	"strings"

	"github.com/joaogabriel/moneto/service/category/internal/domain/model"
)

func (r *PostgresCategoryRepository) Update(ctx context.Context, id string, update model.CategoryUpdate) (*model.Category, error) {
	setParts := []string{}
	args := []interface{}{}

	argPos := 1

	if update.Name != nil {
		setParts = append(setParts, "name = $"+strconv.Itoa(argPos))
		args = append(args, *update.Name)
		argPos++
	}

	if update.Type != nil {
		setParts = append(setParts, "type = $"+strconv.Itoa(argPos))
		args = append(args, *update.Type)
		argPos++
	}

	if update.Description != nil {
		setParts = append(setParts, "description = $"+strconv.Itoa(argPos))
		args = append(args, *update.Description)
		argPos++
	}

	if update.Color != nil {
		setParts = append(setParts, "color = $"+strconv.Itoa(argPos))
		args = append(args, *update.Color)
		argPos++
	}

	// Se não tiver campos para atualizar, retorna erro
	if len(setParts) == 0 {
		return nil, errors.New("nenhum campo para atualizar")
	}

	// Atualiza automaticamente o updated_at
	setParts = append(setParts, "updated_at = NOW()")

	query := `	UPDATE categories 
				SET ` + strings.Join(setParts, ", ") + ` 
				WHERE id=$` + strconv.Itoa(argPos) + ` 
				RETURNING id, name, type, description, color, created_at, updated_at`
	args = append(args, id)

	row := r.DB.QueryRowContext(ctx, query, args...)
	var updateCategory model.Category
	err := row.Scan(
		&updateCategory.Id,
		&updateCategory.Name,
		&updateCategory.Type,
		&updateCategory.Description,
		&updateCategory.Color,
		&updateCategory.CreatedAt,
		&updateCategory.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("category not found")
		}
		return nil, err
	}

	return &updateCategory, nil
}
