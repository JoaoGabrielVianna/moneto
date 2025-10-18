package model

import "time"

// User representa o usuário no sistema
type User struct {
	Id        string    `json:"id"`
	Name      string    `json:"name" example:"João Gabriel"`
	Email     string    `json:"email" example:"joao@example.com"`
	Password  string    `json:"password" example:"secret123"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// UserUpdate usado para atualizações parciais
type UserUpdate struct {
	Name     *string `json:"name,omitempty" validate:"omitempty"`
	Email    *string `json:"email,omitempty" validate:"omitempty,email"`
	Password *string `json:"password,omitempty" validate:"omitempty"`
}

// UserFilter usado para filtrar listagens
type UserFilter struct {
	Id    string `json:"id,omitempty"`
	Name  string `json:"name,omitempty"`
	Email string `json:"email,omitempty"`
}

// UserResponse usado para responder na API (não inclui senha)
type UserResponse struct {
	Id        string    `json:"id"`
	Name      string    `json:"name" example:"João Gabriel"`
	Email     string    `json:"email" example:"joao@example.com"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
