package migrations

import "database/sql"

func Up_16_08_2025_add_category_id_to_expenses(db *sql.DB) error {
	_, err := db.Exec(`ALTER TABLE expenses ADD COLUMN category_id TEXT NOT NULL REFERENCES categories(id);`)
	return err
}
