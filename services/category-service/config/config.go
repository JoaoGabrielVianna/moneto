// ========================================
// USER SERVICE - Configuração
// ----------------------------------------
// Este arquivo conecta o serviço de usuários (user-service)
// ao sistema de configuração centralizado em pkg/config.
//
// Ele define:
//   - O alias da estrutura de configuração global (Config)
//   - O acesso à instância do banco de dados global (DB)
//   - Funções de inicialização e recuperação de configuração
//
// Autor: João Gabriel | Projeto Moneto
// ========================================
package config

import (
	"database/sql"

	"github.com/joaogabriel/moneto/pkg/config"
)

// ========================================
// Tipo e variáveis globais
// ========================================
type Config = config.Config

var DB *sql.DB

// ========================================
// GetConfig
// ----------------------------------------
// Retorna o ponteiro da configuração global atual.
// Usado quando já existe uma configuração inicializada.
// ========================================
func GetConfig() *Config {
	return config.GetConfig()
}

// ========================================
// Init
// ----------------------------------------
// Inicializa o sistema de configuração para o serviço de usuários.
//
// - Lê variáveis de ambiente do arquivo `.env`
// - Define URLs base e modo de execução (local/docker/prod)
// - Conecta ao banco de dados PostgreSQL
// - Exibe logs de inicialização formatados
//
// Retorna um ponteiro para a configuração carregada.
// ========================================
func Init() *Config {
	return config.Init("CATEGORY", "CATEGORY_SERVICE_PORT")
}

func GetDB() *sql.DB {
	return config.GetDB()
}
