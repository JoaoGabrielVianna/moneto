package utils

import (
	"fmt"
	"strings"

	"github.com/joaogabriel/moneto/pkg/logger"
)

// PrintStartupLogs mostra informações de inicialização do serviço
// incluindo ambiente, porta e status do banco de dados.
func PrintStartupLogs(envMode, port string, hasDB bool, dbErr error) {
	log := logger.Get("System")

	lines := []string{
		"🚀 Iniciando Serviço",
		fmt.Sprintf("Environment: %s", envMode),
		fmt.Sprintf("Port: %s", port),
		fmt.Sprintf("Servidor HTTP ouvindo em http://localhost:%s", port),
	}

	// ---------------
	// Status do banco
	// ---------------
	if !hasDB {
		lines = append(lines, "Sem banco de dados para este serviço")
	} else if dbErr != nil {
		lines = append(lines, fmt.Sprintf("❌ Banco NÃO conectado: %v", dbErr))
	} else {
		lines = append(lines, "✅ Banco conectado com sucesso")
	}

	// Descobre o maior tamanho para o separador
	maxLen := 0
	for _, line := range lines {
		if len(line) > maxLen {
			maxLen = len(line)
		}
	}
	separator := strings.Repeat("-", maxLen)

	// Imprime formatado
	fmt.Println(separator)
	log.Warn("%s", lines[0]) // 🚀 Iniciando Serviço
	for _, line := range lines[1:] {
		if strings.Contains(line, "❌") {
			log.Error("%s", line)
		} else if strings.Contains(line, "✅") {
			log.Success("%s", line)
		} else {
			log.Info("%s", line)
		}
	}
	fmt.Println(separator)
}
