package migrations

import "database/sql"

func Up_07_08_2025_add_unique_constraint_to_email(db *sql.DB) error {
	_, err := db.Exec(`
		ALTER TABLE users
		ADD CONSTRAINT users_email_unique UNIQUE (email);
	`)
	return err
}
