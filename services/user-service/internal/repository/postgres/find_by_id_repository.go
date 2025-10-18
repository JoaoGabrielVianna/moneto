package postgres

import (
	"context"

	"github.com/joaogabriel/moneto/service/user/internal/domain/model"
)

func (r *PostgresUserRepository) FindById(ctx context.Context, id string) (*model.User, error) {
	var user model.User
	query := `SELECT id, name, email, password, created_at, updated_at FROM users WHERE id=$1`

	err := r.DB.QueryRowContext(ctx, query, id).Scan(
		&user.Id, &user.Name, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}
	return &user, nil
}
