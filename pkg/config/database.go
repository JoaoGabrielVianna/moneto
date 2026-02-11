// ========================================
// CORE CONFIG - Database Helper
// ----------------------------------------
// Este módulo provê funções auxiliares para conexão
// com o banco de dados PostgreSQL.
//
// Responsabilidades:
//   - Estabelecer conexões com o banco (ConnectDatabase)
//   - Retornar a conexão global ativa (GetDB)
//
// Autor: João Gabriel | Projeto ASVA
// ========================================
package config

import (
	"database/sql"

	_ "github.com/lib/pq"
)

// ========================================
// ConnectDatabase
// ----------------------------------------
// Estabelece uma nova conexão PostgreSQL, utilizando
// a URL definida na configuração global (cfg.DatabaseURL).
//
// Retorno:
//   - *sql.DB: conexão ativa
//   - error: erro de abertura ou ping
//
// ========================================
func ConnectDatabase() (*sql.DB, error) {
	cfg := GetConfig()

	db, err := sql.Open("postgres", cfg.DatabaseURL)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	return db, nil
}

// ========================================
// GetDB
// ----------------------------------------
// Retorna a instância global de conexão com o banco.
// ========================================
func GetDB() *sql.DB {
	return DB
}
