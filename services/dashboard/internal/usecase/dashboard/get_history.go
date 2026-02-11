package usecase

import (
	"context"
	"time"

	"github.com/joaogabriel/moneto/service/dashboard/internal/domain/model"
)

func (uc *DashboardUseCase) GetHistory(ctx context.Context, start, end time.Time, groupBy string) (model.History, error) {
	return uc.Repo.GetHistory(ctx, start, end, groupBy)
}
