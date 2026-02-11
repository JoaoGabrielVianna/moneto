package config

import (
	"database/sql"

	"github.com/joaogabriel/moneto/pkg/config"
)

type Config = config.Config

func GetConfig() *Config {
	return config.GetConfig()
}

func Init() *Config {
	return config.Init("DASHBOARD", "DASHBOARD_SERVICE_PORT")
}

func GetDb() *sql.DB {
	return config.GetDB()
}
