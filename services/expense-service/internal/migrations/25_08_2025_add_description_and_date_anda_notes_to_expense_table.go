package migrations

import "database/sql"

func Up_25_08_2025_add_description_and_date_anda_notes_to_expense_table(db *sql.DB) error {
	_, err := db.Exec(`
		ALTER TABLE expenses 
		ADD COLUMN description TEXT,
		ADD COLUMN date TIMESTAMP,
		ADD COLUMN notes TEXT;`)
	return err
}
