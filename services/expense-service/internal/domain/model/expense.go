package model

import "time"

type Expense struct {
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

type ExpenseUpdate struct {
	Amount      *string    `json:"amount"`
	CategoryId  *string    `json:"category_id"`
	Description *string    `json:"description"`
	Date        *time.Time `json:"date"`
	Notes       *string    `json:"notes"`
}

type ExpenseReponse struct {
	Id          string    `json:"id"`
	UserId      string    `json:"user_id"`
	CategoryId  string    `json:"category_id"`
	Description *string   `json:"description"`
	Date        time.Time `json:"date"`
	Notes       string    `json:"notes"`
	Amount      string    `json:"amount"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
