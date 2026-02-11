package postgres

import (
	"context"

	"github.com/joaogabriel/moneto/service/user/internal/domain/model"
)

func (r *PostgresUserRepository) FindByEmail(ctx context.Context, email string) (*model.User, error) {
	var user model.User
	query := `SELECT id, name, email, password, created_at, updated_at FROM users WHERE email=$1`

	err := r.DB.QueryRowContext(ctx, query, email).Scan(
		&user.Id,
		&user.Name,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil

}
