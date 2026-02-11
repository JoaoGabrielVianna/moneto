package middlewares

import (
	"net/http"
	"os"
	"strings"
)

// CORS Middleware global padrão Moneto
func CORS(next http.Handler) http.Handler {
	allowedOrigins := strings.Split(os.Getenv("ALLOWED_ORIGINS"), ",")

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		for _, o := range allowedOrigins {
			if strings.TrimSpace(o) == origin {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Access-Control-Allow-Credentials", "true")
				break
			}
		}

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
