package main

import (
	"github.com/joaogabriel/moneto/service/category/config"
	"github.com/joaogabriel/moneto/service/category/internal/bootstrap"
	_ "github.com/joaogabriel/moneto/service/category/internal/docs"
	_ "github.com/lib/pq"
)

func main() {
	config.Init()
	defer config.DB.Close()

	usecase := bootstrap.BuildUseCase(config.DB)
	bootstrap.StartServer(usecase)
}
