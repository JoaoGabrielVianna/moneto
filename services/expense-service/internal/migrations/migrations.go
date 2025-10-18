package migrations

import (
	"database/sql"
	"fmt"

	"github.com/joaogabriel/moneto/pkg/logger"
)

var (
	log = logger.Get("Migrations")
)

var MigrationNames = []string{
	"Up_09_08_create_expense_table",
	"Up_16_08_2025_add_category_id_to_expenses",
	"Up_25_08_2025_add_description_and_date_anda_notes_to_expense_table",
}

var Migrations = []func(*sql.DB) error{
	Up_11_08_create_expenses_table,
	Up_16_08_2025_add_category_id_to_expenses,
	Up_25_08_2025_add_description_and_date_anda_notes_to_expense_table,
}

func ensureMigrationTable(db *sql.DB) error {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS schema_migrations (
			name TEXT PRIMARY KEY,
			applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`)
	return err
}

// Verifica quais migrations já foram aplicadas
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

// Aplica as migrations que ainda não foram aplicadas
func Migrate(db *sql.DB) error {
	if err := ensureMigrationTable(db); err != nil {
		return fmt.Errorf("erro criando tabela schema_migrations: %w", err)
	}

	applied, err := getAppliedMigrations(db)
	if err != nil {
		return fmt.Errorf("erro lendo migrations aplicadas: %w", err)
	}

	for i, migration := range Migrations {
		name := MigrationNames[i]
		if applied[name] {
			continue
		}

		log.Info("Aplicando migration %s...", name)
		if err := migration(db); err != nil {
			return fmt.Errorf("erro aplicando migration %s: %w", name, err)
		}

		if _, err := db.Exec(`INSERT INTO schema_migrations(name) VALUES ($1)`, name); err != nil {
			return fmt.Errorf("erro salvando migration %s: %w", name, err)
		}

		log.Success("Migration %s aplicada com sucesso.", name)
	}

	return nil
}
