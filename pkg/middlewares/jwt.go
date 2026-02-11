package middlewares

import (
	"context"
	"net/http"
	"strings"

	"github.com/joaogabriel/moneto/pkg/logger"
	"github.com/joaogabriel/moneto/pkg/utils"
	"github.com/joaogabriel/moneto/pkg/utils/response"
)

var log = logger.Get("AuthMiddleware")

// AuthMiddleware
// ----------------------------------------
// Valida token customizado (JWT) OU chave interna (X-Internal-API-Key).
// - Sempre injeta o "user_id" no contexto como string ("user_id")
// - Requisições internas DEVEM conter X-Internal-API-Key + Header X-User-Id
// ----------------------------------------
func AuthMiddleware(secretKey, internalAPIKey string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			// ----------------------------
			// 1️⃣ - Requisição interna
			// ----------------------------
			internalKey := r.Header.Get("X-Internal-API-Key")
			if internalKey != "" {
				if internalKey != internalAPIKey {
					log.Error("Tentativa de acesso interno com chave inválida de %s", r.RemoteAddr)
					response.Error(w, http.StatusForbidden, "chave interna inválida")
					return
				}

				// ⚠️ user_id precisa ser informado também
				userId := r.Header.Get("X-User-Id")
				if userId == "" {
					log.Error("Requisição interna sem X-User-Id")
					response.Error(w, http.StatusBadRequest, "X-User-Id é obrigatório para chamadas internas")
					return
				}

				ctx := context.WithValue(r.Context(), "user_id", userId)
				next.ServeHTTP(w, r.WithContext(ctx))
				return
			}

			// ----------------------------
			// 2️⃣ - Requisição com Bearer Token
			// ----------------------------
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				log.Error("Requisição sem Authorization header de %s", r.RemoteAddr)
				response.Error(w, http.StatusUnauthorized, "cabeçalho Authorization ausente")
				return
			}

			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
				log.Error("Formato inválido de Authorization recebido de %s: %s", r.RemoteAddr, authHeader)
				response.Error(w, http.StatusUnauthorized, "formato inválido do Authorization header")
				return
			}

			token := strings.Trim(parts[1], `"'`)
			userId, err := utils.ValidateToken(token, secretKey)
			if err != nil {
				log.Error("Token inválido recebido de %s: %v", r.RemoteAddr, err)
				response.Error(w, http.StatusUnauthorized, "token inválido: "+err.Error())
				return
			}

			ctx := context.WithValue(r.Context(), "user_id", userId)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
