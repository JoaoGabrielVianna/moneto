package model

type History struct {
	Labels  []string  `json:"labels"`
	Income  []float64 `json:"income"`
	Expense []float64 `json:"expense"`
	Balance []float64 `json:"balance"`
}
