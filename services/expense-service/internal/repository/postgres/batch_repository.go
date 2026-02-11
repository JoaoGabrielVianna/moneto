package postgres

import (
	"context"
	"fmt"
	"strings"

	"github.com/joaogabriel/moneto/service/expense/internal/domain/model"
	"github.com/lib/pq"
)

func (r PostgresExpenseRepository) CreateBatch(ctx context.Context, expenses []model.Expense) error {
	if len(expenses) == 0 {
		return nil
	}

	values := make([]string, 0, len(expenses))
	args := make([]interface{}, 0, len(expenses)*7)

	for i, exp := range expenses {
		n := i * 7
		values = append(values, fmt.Sprintf("($%d,$%d,$%d,$%d,$%d,$%d,$%d)",
			n+1, n+2, n+3, n+4, n+5, n+6, n+7))
		args = append(args,
			exp.Id,
			exp.UserId,
			exp.CategoryId,
			exp.Amount,
			exp.Description,
			exp.Date,
			exp.Notes,
		)
	}

	query := fmt.Sprintf(`
		INSERT INTO expenses (id, user_id, category_id, amount, description, date, notes)
		VALUES %s
	`, strings.Join(values, ","))

	_, err := r.DB.ExecContext(ctx, query, args...)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "23505" {
			return fmt.Errorf("já existe uma ou mais transações com os mesmos dados (provável reimportação do mesmo arquivo)")
		}
		return fmt.Errorf("erro ao inserir despesas: %w", err)
	}

	return nil
}
