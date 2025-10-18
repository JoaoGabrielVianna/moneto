package config

import (
	"database/sql"

	"github.com/joaogabriel/moneto/service/user/internal/migrations"
)

func ConnectDatabase() (db *sql.DB) {

	db, err := sql.Open("postgres", cfg.DatabaseURL)
	if err != nil {
		log.Error("failed to connect to db: %v", err)
	}

	log.Success("Banco conectado com Sucesso!")

	err = migrations.Migrate(db)
	if err != nil {
		log.Error("erro ao rodar migrations: %v", err)
		return nil
	}
	return db
}
