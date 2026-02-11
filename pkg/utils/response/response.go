package response

import (
	"encoding/json"
	"net/http"
)

type ApiResponse[T any] struct {
	Status  string `json:"status"`
	Message string `json:"message,omitempty"`
	Data    T      `json:"data,omitempty"`
}

func Success[T any](w http.ResponseWriter, data T, message string) {
	if message == "" {
		message = "success"
	}

	resp := ApiResponse[T]{
		Status:  "success",
		Message: message,
		Data:    data,
	}

	writeJSON(w, http.StatusOK, resp)
}

func Error(w http.ResponseWriter, statusCode int, message string) {
	resp := ApiResponse[any]{
		Status:  "error",
		Message: message,
	}

	writeJSON(w, statusCode, resp)
}

func writeJSON(w http.ResponseWriter, statusCode int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	_ = json.NewEncoder(w).Encode(payload)
}
