package middlewares

import (
	"context"
	"net/http"
	"strings"

	"github.com/joaogabriel/moneto/pkg/logger"
	"github.com/joaogabriel/moneto/pkg/utils"
	"github.com/joaogabriel/moneto/pkg/utils/response"
)

var (
	log = logger.Get("Middlewares")
)

func AuthMiddleware(secretKey string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				log.Error("Missing Authorization header")
				response.Error(w, http.StatusUnauthorized, "missing Authorization header")
				return
			}

			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
				log.Error("Invalid Authorization header format")
				response.Error(w, http.StatusUnauthorized, "invalid Authorization header format")
				return
			}

			userId, err := utils.ValidateToken(parts[1], secretKey)
			if err != nil {
				log.Error("Invalid token: %s", err)
				response.Error(w, http.StatusUnauthorized, err.Error())
				return
			}

			ctx := context.WithValue(r.Context(), "user_id", userId)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
