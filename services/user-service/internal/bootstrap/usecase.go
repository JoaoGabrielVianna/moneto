package bootstrap

import (
	"database/sql"

	"github.com/joaogabriel/moneto/service/user/internal/repository/postgres"
	"github.com/joaogabriel/moneto/service/user/internal/usecase"
)

func BuildUseCase(db *sql.DB, secretKey string) *usecase.UserUsecase {
	repo := postgres.NewPostgresUserRepository(db)
	uc := usecase.NewUserUsecase(repo, secretKey)

	return uc
}
