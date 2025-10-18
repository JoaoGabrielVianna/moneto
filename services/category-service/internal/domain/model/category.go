package model

import "time"

type Category struct {
	Id          string    `json:"id"`
	Name        string    `json:"name"`
	Type        string    `json:"type"`
	Description string    `json:"description"`
	Color       string    `json:"color"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type CategoryUpdate struct {
	Name        *string `json:"name"`
	Type        *string `json:"type"`
	Description *string `json:"description"`
	Color       *string `json:"color"`
}

type CategoryResponse struct {
	Id          string    `json:"id"`
	UserId      string    `json:"user_id"`
	Name        string    `json:"name"`
	Color       string    `json:"color"`
	Type        string    `json:"type"` // "income" | "expense" | "both"
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	UsageCount  int       `json:"usageCount"`
}
