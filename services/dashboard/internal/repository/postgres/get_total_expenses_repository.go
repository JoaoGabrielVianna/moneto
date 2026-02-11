package postgres

import (
	"context"
	"database/sql"
)

func (p *PostgresDashboardRepository) GetTotalExpense(ctx context.Context) (float64, error) {
	query := `
		SELECT COALESCE(SUM(amount), 0) FROM expenses
	`
	var total float64
	err := p.DB.QueryRowContext(ctx, query).Scan(&total)

	if err != nil {
		if err == sql.ErrNoRows {
			return 0, sql.ErrNoRows
		}
		return 0, err
	}
	return total, err
}
