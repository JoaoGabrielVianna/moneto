package postgres

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"strings"

	"github.com/joaogabriel/moneto/service/user/internal/domain/model"
)

func (r *PostgresUserRepository) Update(ctx context.Context, id string, update model.UserUpdate) (*model.User, error) {
	setParts := []string{}
	args := []interface{}{}
	argPos := 1

	if update.Name != nil {
		setParts = append(setParts, "name = $"+strconv.Itoa(argPos))
		args = append(args, *update.Name)
		argPos++
	}
	if update.Email != nil {
		setParts = append(setParts, "email = $"+strconv.Itoa(argPos))
		args = append(args, *update.Email)
		argPos++
	}

	if update.Password != nil {
		setParts = append(setParts, "password = $"+strconv.Itoa(argPos))
		args = append(args, *update.Password)
		argPos++
	}

	if len(setParts) == 0 {
		return nil, errors.New("no fields to update")
	}

	setParts = append(setParts, "updated_at = NOW()")

	query := fmt.Sprintf(`UPDATE users SET %s WHERE id = $%d RETURNING id, name, email, password, created_at, updated_at`, strings.Join(setParts, ", "), argPos)
	args = append(args, id)

	var updatedUser model.User
	err := r.DB.QueryRowContext(ctx, query, args...).Scan(&updatedUser.Id, &updatedUser.Name, &updatedUser.Email, &updatedUser.Password, &updatedUser.CreatedAt, &updatedUser.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &updatedUser, nil
}
