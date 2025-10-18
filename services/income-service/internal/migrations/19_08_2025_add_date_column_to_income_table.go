package migrations

import "database/sql"

func Up_19_08_2025_add_date_column_to_income_table(db *sql.DB) error {
	_, err := db.Exec(`
		ALTER TABLE INCOMES
		ADD COLUMN date DATE
	`)
	return err
}
