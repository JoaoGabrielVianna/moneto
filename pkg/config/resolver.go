package config

import "os"

func resolveBaseURL(prefix string) string {
	mode := os.Getenv("ENV_MODE")
	local := os.Getenv(prefix + "_BASE_URL_LOCAL")
	docker := os.Getenv(prefix + "_BASE_URL_DOCKER")
	prod := os.Getenv(prefix + "_BASE_URL_PROD")

	switch mode {
	case "docker":
		return docker
	case "production":
		return prod
	default:
		return local
	}
}
