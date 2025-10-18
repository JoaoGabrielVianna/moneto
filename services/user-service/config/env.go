package config

import (
	"os"
)

type Config struct {
	EnvMode     string
	DatabaseURL string
	Port        string
	SecretKey   string
}

func LoadEnv() *Config {
	envMode := os.Getenv("ENV_MODE")
	if envMode == "" {
		envMode = "local"
	}

	cfg := &Config{
		EnvMode:   envMode,
		Port:      os.Getenv("USER_SERVICE_PORT"),
		SecretKey: os.Getenv("SECRET_KEY"),
	}

	switch envMode {
	case "docker":
		cfg.DatabaseURL = os.Getenv("DATABASE_URL_DOCKER")
	default: // Local
		// DATABASE
		cfg.DatabaseURL = os.Getenv("DATABASE_URL_LOCAL")
		cfg.Port = os.Getenv("USER_SERVICE_PORT")
	}

	return cfg
}
