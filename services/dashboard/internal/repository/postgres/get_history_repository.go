package postgres

import (
	"context"
	"time"

	"github.com/joaogabriel/moneto/service/dashboard/internal/domain/model"
)

func (r *PostgresDashboardRepository) GetHistory(ctx context.Context, start, end time.Time, groupBy string) (model.History, error) {
	var history model.History

	// Definindo formato padrão de data completa
	format := "YYYY-MM-DD"

	// 🔹 Consulta de receitas
	incomeRows, err := r.DB.QueryContext(ctx, `
		SELECT 
			TO_CHAR(date::date, $3) AS label,
			COALESCE(SUM(amount), 0)
		FROM incomes
		WHERE date BETWEEN $1 AND $2
		GROUP BY label
		ORDER BY label
	`, start, end, format)
	if err != nil {
		return history, err
	}
	defer incomeRows.Close()

	// 🔹 Consulta de despesas
	expenseRows, err := r.DB.QueryContext(ctx, `
		SELECT 
			TO_CHAR(date::date, $3) AS label,
			COALESCE(SUM(amount), 0)
		FROM expenses
		WHERE date BETWEEN $1 AND $2
		GROUP BY label
		ORDER BY label
	`, start, end, format)
	if err != nil {
		return history, err
	}
	defer expenseRows.Close()

	incomeMap := make(map[string]float64)
	expenseMap := make(map[string]float64)

	// Carrega receitas
	for incomeRows.Next() {
		var label string
		var total float64
		if err := incomeRows.Scan(&label, &total); err == nil {
			incomeMap[label] = total
		}
	}

	// Carrega despesas
	for expenseRows.Next() {
		var label string
		var total float64
		if err := expenseRows.Scan(&label, &total); err == nil {
			expenseMap[label] = total
		}
	}

	// 🔹 Junta os dados em ordem cronológica
	for d := start; d.Before(end) || d.Equal(end); d = d.AddDate(0, 0, 1) {
		label := d.Format("2006-01-02")
		income := incomeMap[label]
		expense := expenseMap[label]

		// Se não há movimentação, ignora
		if income == 0 && expense == 0 {
			continue
		}

		history.Labels = append(history.Labels, label)
		history.Income = append(history.Income, income)
		history.Expense = append(history.Expense, expense)
		history.Balance = append(history.Balance, income-expense)
	}

	return history, nil
}
