package main

import (
	"github.com/joaogabriel/moneto/service/income/config"
	"github.com/joaogabriel/moneto/service/income/internal/bootstrap"

	_ "github.com/joaogabriel/moneto/service/income/internal/docs"
	_ "github.com/lib/pq"
)

func main() {
	config.Init()

	usecase := bootstrap.BuildUseCase(config.GetDB())
	bootstrap.StartServer(usecase)
}
