package utils

import (
	"encoding/base64"
	"errors"
	"fmt"
	"strings"
	"time"
)

func ValidateToken(token, secretKey string) (string, error) {
	decoded, err := base64.StdEncoding.DecodeString(token)
	if err != nil {
		return "", errors.New("token inválido (base64)")
	}

	parts := strings.SplitN(string(decoded), ".", 2)
	if len(parts) != 2 {
		return "", errors.New("token inválido (formato)")
	}
	data, sig := parts[0], parts[1]

	expectedSig := ComputeHMAC(data, secretKey)
	if sig != expectedSig {
		return "", errors.New("token inválido (assinatura)")
	}

	dataParts := strings.SplitN(data, ":", 2)
	if len(dataParts) != 2 {
		return "", errors.New("token inválido (dados)")
	}
	userId, expStr := dataParts[0], dataParts[1]

	var exp int64
	_, err = fmt.Sscanf(expStr, "%d", &exp)
	if err != nil {
		return "", errors.New("token inválido (exp)")
	}
	if time.Now().Unix() > exp {
		return "", errors.New("token expirado")
	}

	return userId, nil
}
