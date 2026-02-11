package postgres

import (
	"context"

	"github.com/joaogabriel/moneto/service/user/internal/domain/model"
)

func (r *PostgresUserRepository) Create(ctx context.Context, user *model.User) (*model.User, error) {
	query := `INSERT INTO users (id, name, email, password)
	          VALUES ($1, $2, $3, $4)
			  RETURNING created_at, updated_at`

	err := r.DB.QueryRowContext(ctx, query,
		user.Id, user.Name, user.Email, user.Password,
	).Scan(&user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		return nil, err
	}
	return user, err
}
