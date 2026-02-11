// ========================================
// USER SERVICE - Entry Point
// ----------------------------------------
// Este arquivo é o ponto de entrada do serviço de usuários.
//
// Responsável por:
//  1. Inicializar as configurações e banco de dados
//  2. Montar as dependências da aplicação (casos de uso, repositórios, etc.)
//  3. Iniciar o servidor HTTP
//
// Autor: João Gabriel | Projeto Moneto
// ========================================
package main

import (
	"github.com/joaogabriel/moneto/service/user/config"

	"github.com/joaogabriel/moneto/service/user/internal/bootstrap"
	_ "github.com/joaogabriel/moneto/service/user/internal/docs"
	_ "github.com/lib/pq"
)

// ========================================
// main()
// ----------------------------------------
// Função principal responsável por iniciar o serviço.
//
// 1. Inicializa a configuração global (variáveis de ambiente, banco, etc)
// 2. Constrói o caso de uso principal com dependências resolvidas
// 3. Inicia o servidor HTTP e expõe as rotas definidas
// ========================================
func main() {
	config.Init()

	usecase := bootstrap.BuildUseCase(config.GetDB())
	bootstrap.StartServer(usecase)

}
