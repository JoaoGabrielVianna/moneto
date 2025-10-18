package migrations

import "database/sql"

func Up_19_08_2025_add_description_and_notes_to_income_table(db *sql.DB) error {
	_, err := db.Exec(`
		ALTER TABLE INCOMES
		ADD COLUMN date DATE
		ADD COLUMN description TEXT, 
		ADD COLUMN notes TEXT
	`)
	return err
}
