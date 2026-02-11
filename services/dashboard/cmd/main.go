package main

import (
	"github.com/joaogabriel/moneto/service/dashboard/config"
	"github.com/joaogabriel/moneto/service/dashboard/internal/bootstrap"
)

func main() {
	config.Init()

	usecase := bootstrap.BuildUseCase(config.GetDb())
	bootstrap.StartServer(usecase)
}
