package postgres

import "context"

func (r *PostgresExpenseRepository) Delete(ctx context.Context, id string) error {
	query := `
		DELETE FROM expenses
		WHERE id=$1
	`

	_, err := r.DB.QueryContext(ctx, query, id)
	if err != nil {
		return err
	}
	return nil
}
