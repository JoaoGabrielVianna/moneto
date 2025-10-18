package config

import (
	"database/sql"
	"fmt"
	"path/filepath"
	"strings"

	"github.com/joaogabriel/moneto/pkg/logger"
	"github.com/joaogabriel/moneto/pkg/utils"
	"github.com/joho/godotenv"
)

var (
	log     = logger.Get("System")
	cfg     = LoadEnv()
	pathEnv = filepath.Join("..", "..", ".env")
	DB      *sql.DB
)

func Init() {
	utils.Render("EXPENSE")

	err := godotenv.Load(pathEnv)

	cfg = LoadEnv()
	printStartupLogs()

	DB = ConnectDatabase()

	if err != nil {
		log.Error("Erro ao carregar .env, continuando sem ele")
	}

}

func GetConfig() *Config {
	return cfg
}

func printStartupLogs() {
	lines := []string{
		"🚀 Iniciando Serviço",
		fmt.Sprintf("Environment: %s", cfg.EnvMode),
		fmt.Sprintf("Port: %s", cfg.Port),
		fmt.Sprintf("Database URL: %s", cfg.DatabaseURL),
		fmt.Sprintf("Servidor HTTP ouvindo em http://localhost:%s", cfg.Port),
	}

	// Descobre o maior tamanho para o separador
	maxLen := 0
	for _, line := range lines {
		if len(line) > maxLen {
			maxLen = len(line)
		}
	}

	separator := strings.Repeat("-", maxLen)

	fmt.Println(separator)
	log.Warn("%s", lines[0])
	for _, line := range lines[1:] {
		log.Info("%s", line)
	}
	fmt.Println(separator)
}
