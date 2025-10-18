package utils

import (
	"fmt"
	"math/rand"
	"time"
)

func GenerateID() string {
	now := time.Now().UTC()
	randPart := rand.Intn(9999)
	return fmt.Sprintf("%d%d", now.UnixNano(), randPart)
}
