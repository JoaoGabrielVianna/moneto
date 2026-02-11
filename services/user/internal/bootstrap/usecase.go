// ========================================
// USER SERVICE - UseCase Bootstrap
// ----------------------------------------
// Responsável por construir o caso de uso principal
// do serviço de usuários, injetando todas as dependências
// necessárias (repositórios, banco de dados, etc).
//
// Autor: João Gabriel | Projeto Moneto
// ========================================
package bootstrap

import (
	"database/sql"

	"github.com/joaogabriel/moneto/service/user/internal/repository/postgres"
	"github.com/joaogabriel/moneto/service/user/internal/usecase"
)

// ========================================
// BuildUseCase
// ----------------------------------------
// Monta e retorna uma instância do caso de uso `UserUsecase`,
// com suas dependências devidamente injetadas.
//
// Parâmetros:
//   - db (*sql.DB): conexão ativa com o banco de dados PostgreSQL.
//
// Retorna:
//   - *usecase.UserUsecase: instância principal do caso de uso.
//
// ========================================
func BuildUseCase(db *sql.DB) *usecase.UserUsecase {
	repo := postgres.NewPostgresUserRepository(db)
	uc := usecase.NewUserUsecase(repo)

	return uc
}
