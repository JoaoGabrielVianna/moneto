package config

import (
	"database/sql"

	"github.com/joaogabriel/moneto/service/category/internal/migrations"
)

func ConnectDatabase() (db *sql.DB) {
	db, err := sql.Open("postgres", cfg.DatabaseURL)
	if err != nil {
		log.Error("failed to connect to db: %v", err)
		return
	}

	log.Success("Banco conectado com Sucesso!")

	err = migrations.Migrate(db)
	if err != nil {
		log.Error("erro ao rodar migrations: %s", err)
		return nil
	}
	return db
}
