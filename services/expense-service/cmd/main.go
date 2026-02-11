package main

import (
	"github.com/joaogabriel/moneto/service/expense/config"
	"github.com/joaogabriel/moneto/service/expense/internal/bootstrap"

	_ "github.com/joaogabriel/moneto/service/expense/internal/docs"
	_ "github.com/lib/pq"
)

func main() {
	config.Init()

	usecase := bootstrap.BuildUseCase(config.GetDB())
	bootstrap.StartServer(usecase)
}
