package postgres

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/joaogabriel/moneto/service/expense/internal/domain/model"
)

func (r *PostgresExpenseRepository) Update(ctx context.Context, id string, update model.ExpenseUpdate) (*model.ExpenseReponse, error) {
	setParts := []string{}
	args := []interface{}{}
	argPos := 1

	fields := []struct {
		column string
		value  interface{}
	}{
		{"amount", update.Amount},
		{"category_id", update.CategoryId},
		{"description", update.Description},
		{"date", update.Date},
		{"notes", update.Notes},
	}

	for _, f := range fields {
		switch v := f.value.(type) {
		case *string:
			if v != nil {
				setParts = append(setParts, fmt.Sprintf("%s = $%d", f.column, argPos))
				args = append(args, *v)
				argPos++
			}
		case *time.Time:
			if v != nil {
				setParts = append(setParts, fmt.Sprintf("%s = $%d", f.column, argPos))
				args = append(args, *v)
				argPos++
			}
		}
	}

	if len(setParts) == 0 {
		return nil, errors.New("nenhum campo para atualizar")
	}

	setParts = append(setParts, "updated_at = NOW()")

	query := fmt.Sprintf(`
		UPDATE expenses 
		SET %s
		WHERE id = $%d
		RETURNING id, user_id, category_id, amount, description, date, notes, created_at, updated_at
		`, strings.Join(setParts, ", "), argPos)

	args = append(args, id)

	var resp model.ExpenseReponse
	err := r.DB.QueryRowContext(ctx, query, args...).Scan(
		&resp.Id,
		&resp.UserId,
		&resp.CategoryId,
		&resp.Amount,
		&resp.Description,
		&resp.Date,
		&resp.Notes,
		&resp.CreatedAt,
		&resp.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &resp, nil
}
