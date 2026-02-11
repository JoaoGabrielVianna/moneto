package postgres

import (
	"context"
	"database/sql"
)

func (r *PostgresUserRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM users WHERE id=$1`
	res, err := r.DB.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	affected, _ := res.RowsAffected()
	if affected == 0 {
		return sql.ErrNoRows
	}

	return nil
}
