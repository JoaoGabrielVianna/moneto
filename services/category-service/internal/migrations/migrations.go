package migrations

import (
	"database/sql"
	"fmt"

	"github.com/joaogabriel/moneto/pkg/logger"
)

var (
	log = logger.Get("Migrations")
)

var MigrationsName = []string{
	"Up_15_08_2025_create_categories_table",
}

var Migrations = []func(*sql.DB) error{
	Up_15_08_2025_create_categories_table,
}

func ensureMigrationTable(db *sql.DB) error {
	_, err := db.Exec(`CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`)
	return err
}

func getAppliedMigrations(db *sql.DB) (map[string]bool, error) {
	rows, err := db.Query(`SELECT name FROM schema_migrations`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	applied := make(map[string]bool)
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			return nil, err
		}
		applied[name] = true
	}
	return applied, nil
}

func Migrate(db *sql.DB) error {
	if err := ensureMigrationTable(db); err != nil {
		return fmt.Errorf("erro criando tabela schemas_migrations: %s", err)
	}
	applied, err := getAppliedMigrations(db)
	if err != nil {
		return fmt.Errorf("erro lendo migrations aplicadas: %w", err)
	}

	for i, migration := range Migrations {
		name := MigrationsName[i]
		if applied[name] {
			continue
		}

		log.Info("Aplicando migrations %s...", name)
		if err := migration(db); err != nil {
			return fmt.Errorf("erro aplicando migration %s: %s", name, err)
		}
		if _, err := db.Exec(`INSERT INTO schema_migrations(name) VALUES ($1)`, name); err != nil {
			return fmt.Errorf("erro salvando migration %s: %s", name, err)
		}

		log.Success("Migration %s aplicada com sucesso.", name)
	}

	return nil
}
