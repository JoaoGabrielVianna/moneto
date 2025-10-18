package postgres

import (
	"database/sql"

	"github.com/joaogabriel/moneto/service/user/internal/domain"
)

type PostgresUserRepository struct {
	DB *sql.DB
}

func NewPostgresUserRepository(db *sql.DB) domain.UserRepository {
	return &PostgresUserRepository{DB: db}
}
