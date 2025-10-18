package migrations

import "database/sql"

func Up_16_08_2025_add_category_id_to_incomes(db *sql.DB) error {
	_, err := db.Exec(`ALTER TABLE incomes ADD COLUMN category_id TEXT NOT NULL REFERENCES categories(id);`)
	return err
}
