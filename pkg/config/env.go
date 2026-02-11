package config

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func LoadEnv(path string) {
	file, err := os.Open(path)
	if err != nil {
		fmt.Printf("⚠️  Não foi possível abrir %s: %v\n", path, err)
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}
		os.Setenv(strings.TrimSpace(parts[0]), strings.TrimSpace(parts[1]))
	}
	if err := scanner.Err(); err != nil {
		fmt.Printf("Erro ao ler .env: %v\n", err)
	}
}
