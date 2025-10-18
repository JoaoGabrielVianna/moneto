package postgres

import "context"

func (r *PostgresCategoryRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM categories WHERE id=$1`

	_, err := r.DB.QueryContext(ctx, query, id)
	if err != nil {
		return err
	}
	return nil
}
