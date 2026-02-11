package main

import (
	"github.com/joaogabriel/moneto/service/category/config"
	"github.com/joaogabriel/moneto/service/category/internal/bootstrap"
	_ "github.com/joaogabriel/moneto/service/category/internal/docs"
	_ "github.com/lib/pq"
)

func main() {
	config.Init()

	usecase := bootstrap.BuildUseCase(config.GetDB())
	bootstrap.StartServer(usecase)
}
