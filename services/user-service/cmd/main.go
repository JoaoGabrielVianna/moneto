package main

import (
	"github.com/joaogabriel/moneto/service/user/config"

	"github.com/joaogabriel/moneto/service/user/internal/bootstrap"
	_ "github.com/joaogabriel/moneto/service/user/internal/docs"
	_ "github.com/lib/pq"
)

func main() {
	config.Init()
	cfg := config.GetConfig()
	defer config.DB.Close()

	usecase := bootstrap.BuildUseCase(config.DB, cfg.SecretKey)
	bootstrap.StartServer(usecase)
}
