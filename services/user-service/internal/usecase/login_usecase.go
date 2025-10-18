package usecase

import (
	"context"
	"encoding/base64"
	"errors"
	"fmt"
	"time"

	"github.com/joaogabriel/moneto/pkg/utils"
)

func (uc *UserUsecase) Login(ctx context.Context, email, password string) (string, error) {
	user, err := uc.Repo.FindByEmail(ctx, email)
	if err != nil {
		return "", errors.New("usuário não encontrado")
	}

	if !utils.CheckPassword(password, user.Password) {
		return "", errors.New("senha incorreta")
	}
	// Criar token simples: base64(userID + exp + assinatura HMAC)
	exp := time.Now().Add(24 * time.Hour).Unix()
	data := fmt.Sprintf("%s:%d", user.Id, exp)
	sig := utils.ComputeHMAC(data, uc.SecretKey)
	token := base64.StdEncoding.EncodeToString([]byte(data + "." + sig))

	return token, nil
}
