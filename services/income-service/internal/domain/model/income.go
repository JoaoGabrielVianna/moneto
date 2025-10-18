package model

import "time"

type Income struct {
	Id          string    `json:"id"`
	UserId      string    `json:"user_id"`
	CategoryId  string    `json:"category_id"`
	Amount      string    `json:"amount"`
	Description string    `json:"description"`
	Date        time.Time `json:"date"`
	Notes       string    `json:"notes"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type IncomeUpdate struct {
	CategoryId  *string    `json:"category_id"`
	Amount      *string    `json:"amount"`
	Description *string    `json:"description"`
	Date        *time.Time `json:"date"`
	Notes       *string    `json:"notes"`
}

type IncomeResponse struct {
	Id          string    `json:"id"`
	UserId      string    `json:"user_id"`
	CategoryId  string    `json:"category_id"`
	Amount      string    `json:"amount"`
	Description string    `json:"description"`
	Date        time.Time `json:"date"`
	Notes       string    `json:"notes"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
