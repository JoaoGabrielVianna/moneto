package domain

import (
	"context"
	"time"

	"github.com/joaogabriel/moneto/service/dashboard/internal/domain/model"
)

type DashboardRepository interface {
	GetTotalIncome(ctx context.Context) (float64, error)
	GetTotalExpense(ctx context.Context) (float64, error)
	GetTotalCategories(ctx context.Context) (int, error)
	GetHistory(ctx context.Context, start, end time.Time, groupBy string) (model.History, error)
}
