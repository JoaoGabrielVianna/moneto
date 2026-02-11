// ========================================
// CORE CONFIG - Application Configuration
// ----------------------------------------
// Este módulo define a configuração central da aplicação
// (ambiente, URLs, JWT, Database, etc.) e inicializa
// a conexão global com o banco de dados PostgreSQL.
//
// Ele é reutilizado por todos os microserviços (user, auth, medication).
//
// Autor: João Gabriel | Projeto ASVA
// ========================================
package config

import (
	"database/sql"
	"os"
	"strconv"

	"github.com/joaogabriel/moneto/pkg/logger"
	"github.com/joaogabriel/moneto/pkg/utils"
)

var (
	cfg *Config // Estrutura de configuração global
	DB  *sql.DB // Conexão global com PostgreSQL
	log = logger.Get("Config")
)

// ========================================
// Estrutura principal de configuração
// ----------------------------------------
type Config struct {
	EnvMode     string
	DebugMode   bool
	Port        string
	ServiceName string

	JWTSecret      string
	InternalAPIKey string
	DatabaseURL    string

	GatewayBaseURL    string
	UserBaseURL       string
	AuthBaseURL       string
	MedicationBaseURL string

	AllowedOrigins string
}

// ========================================
// Init
// ----------------------------------------
// Inicializa o sistema de configuração global.
//
// Etapas executadas:
//  1. Carrega o arquivo .env e define variáveis globais
//  2. Monta a struct `Config` com base nas variáveis
//  3. Chama ConnectDatabase() e armazena a conexão global
//  4. Renderiza o banner e imprime logs padronizados
//
// Parâmetros:
//   - service: nome do serviço (ex: "USER")
//   - portEnv: nome da variável de porta (ex: "USER_SERVICE_PORT")
//
// Retorno:
//   - *Config: instância configurada globalmente
//
// ========================================
func Init(service string, portEnv string) *Config {
	LoadEnv("../../.env")

	debug, _ := strconv.ParseBool(os.Getenv("DEBUG_MODE"))

	cfg = &Config{
		EnvMode:        os.Getenv("ENV_MODE"),
		DebugMode:      debug,
		Port:           os.Getenv(portEnv),
		ServiceName:    service,
		JWTSecret:      os.Getenv("JWT_SECRET"),
		InternalAPIKey: os.Getenv("INTERNAL_API_KEY"),
		DatabaseURL:    os.Getenv("DATABASE_URL"),

		GatewayBaseURL:    resolveBaseURL("GATEWAY"),
		UserBaseURL:       resolveBaseURL("USER"),
		AuthBaseURL:       resolveBaseURL("AUTH"),
		MedicationBaseURL: resolveBaseURL("MEDICATION"),
		AllowedOrigins:    resolveBaseURL("ALLOWED_ORIGINS"),
	}

	// --------------------
	// Conecta ao banco via helper centralizado
	// --------------------
	var err error
	DB, err = ConnectDatabase()
	if err != nil {
		log.Error("Falha ao conectar ao banco: %v", err)
	}

	utils.Render(service)
	utils.PrintStartupLogs(cfg.EnvMode, cfg.Port, true, err)

	return cfg
}

// ========================================
// GetConfig
// ----------------------------------------
// Retorna a instância global de configuração atual.
// ========================================
func GetConfig() *Config {
	return cfg
}
