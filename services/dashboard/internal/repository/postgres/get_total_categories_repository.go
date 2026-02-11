package postgres

import (
	"context"
	"database/sql"
)

func (p *PostgresDashboardRepository) GetTotalCategories(ctx context.Context) (int, error) {
	query := `
		SELECT COUNT(*) FROM categories
	`
	var total int
	err := p.DB.QueryRowContext(ctx, query).Scan(&total)

	if err != nil {
		if err == sql.ErrNoRows {
			return 0, sql.ErrNoRows
		}
		return 0, err
	}
	return total, err
}
