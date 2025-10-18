package migrations

import "database/sql"

func Up_11_08_create_expenses_table(db *sql.DB) error {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS expenses (
			id VARCHAR(36) PRIMARY KEY,
			user_id VARCHAR(255) NOT NULL,
			amount NUMERIC NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
			CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
		)
	`)

	return err
}
