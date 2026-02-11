package usecase

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
)

func (uc *UserUsecase) DeleteUser(ctx context.Context, id string) error {
	err := uc.Repo.Delete(ctx, id)
	if errors.Is(err, sql.ErrNoRows) {
		return fmt.Errorf("user not found")
	}
	return err
}
