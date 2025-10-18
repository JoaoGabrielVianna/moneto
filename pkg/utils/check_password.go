package utils

func CheckPassword(password, hash string) bool {
	return HashPassword(password) == hash
}
