package dashboard

import (
	"github.com/joaogabriel/moneto/pkg/logger"
	usecase "github.com/joaogabriel/moneto/service/dashboard/internal/usecase/dashboard"
)

var log = logger.Get("Delivery")

type DashboardHandler struct {
	Usecase *usecase.DashboardUseCase
}

func NewDashboardHandler(uc *usecase.DashboardUseCase) *DashboardHandler {
	return &DashboardHandler{Usecase: uc}
}
