package migrations

import "database/sql"

func Up_15_08_2025_create_categories_table(db *sql.DB) error {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS categories (
			id VARCHAR(36) PRIMARY KEY,
			name VARCHAR(36) NOT NULL,
			type VARCHAR(36) NOT NULL,
			description TEXT,
			color VARCHAR(36),
			created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()

		);
	`)
	return err
}
