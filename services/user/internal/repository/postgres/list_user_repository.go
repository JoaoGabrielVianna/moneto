package postgres

import (
	"context"
	"fmt"

	"github.com/joaogabriel/moneto/service/user/internal/domain/model"
)

func (r *PostgresUserRepository) List(ctx context.Context, filter model.UserFilter) ([]model.User, error) {
	query := `SELECT id, name, email, password, created_at, updated_at FROM users WHERE 1=1`
	args := []interface{}{}
	argPos := 1

	if filter.Id != "" {
		query += fmt.Sprintf(" AND id = $%d", argPos)
		args = append(args, "%"+filter.Id+"%")
		argPos++
	}

	if filter.Name != "" {
		query += fmt.Sprintf(" AND name = $%d", argPos)
		args = append(args, filter.Name)
		argPos++
	}

	if filter.Email != "" {
		query += fmt.Sprintf(" AND email = $%d", argPos)
		args = append(args, filter.Email)
		argPos++
	}

	rows, err := r.DB.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	users := []model.User{}
	for rows.Next() {
		var user model.User
		err := rows.Scan(&user.Id, &user.Name, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}
