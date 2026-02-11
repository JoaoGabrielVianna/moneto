package postgres

import (
	"context"
	"fmt"
	"strings"

	"github.com/joaogabriel/moneto/service/income/internal/domain/model"
	"github.com/lib/pq"
)

func (r PostgresIncomeRepository) CreateBatch(ctx context.Context, incomes []model.Income) error {
	if len(incomes) == 0 {
		return nil
	}

	values := make([]string, 0, len(incomes))
	args := make([]interface{}, 0, len(incomes)*7)

	for i, inc := range incomes {
		n := i * 7
		values = append(values, fmt.Sprintf("($%d,$%d,$%d,$%d,$%d,$%d,$%d)",
			n+1, n+2, n+3, n+4, n+5, n+6, n+7))
		args = append(args,
			inc.Id,
			inc.UserId,
			inc.CategoryId,
			inc.Amount,
			inc.Description,
			inc.Date,
			inc.Notes,
		)
	}

	query := fmt.Sprintf(`
		INSERT INTO incomes (id, user_id, category_id, amount, description, date, notes)
		VALUES %s
	`, strings.Join(values, ","))

	_, err := r.DB.ExecContext(ctx, query, args...)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "23505" { // duplicate key
			return fmt.Errorf("já existe uma ou mais transações com os mesmos dados (provável reimportação do mesmo arquivo)")
		}
		return fmt.Errorf("erro ao inserir rendas: %w", err)
	}

	return nil
}
