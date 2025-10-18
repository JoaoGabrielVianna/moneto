package postgres

import (
	"database/sql"

	"github.com/joaogabriel/moneto/service/category/internal/domain"
)

type PostgresCategoryRepository struct {
	DB *sql.DB
}

func NewPostgresCategoryRepository(db *sql.DB) domain.CategoryRepository {
	return &PostgresCategoryRepository{DB: db}
}
