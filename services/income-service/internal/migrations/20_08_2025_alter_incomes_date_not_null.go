package migrations

import "database/sql"

func Up_20_08_2025_alter_incomes_date_not_null(db *sql.DB) error {
	_, err := db.Exec(`
		ALTER TABLE incomes
		ALTER COLUMN date SET NOT NULL	
	`)

	return err
}
