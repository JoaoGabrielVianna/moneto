package response

//
// import (
// 	"encoding/json"
// 	"net/http"
// )

// type Response struct {
// 	Status int         `json:"status"`
// 	Error  string      `json:"error,omitempty"`
// 	Data   interface{} `json:"data,omitempty"`
// }

// func JSON(w http.ResponseWriter, status int, data interface{}, errMsg string) {
// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(status)

// 	resp := Response{
// 		Status: status,
// 	}

// 	if data != nil {
// 		resp.Data = data
// 	}

// 	if errMsg != "" {
// 		resp.Error = errMsg
// 	}

// 	json.NewEncoder(w).Encode(resp)
// }

// func OK(w http.ResponseWriter, data interface{}) {
// 	JSON(w, http.StatusOK, data, "")
// }

// func ERROR(w http.ResponseWriter, status int, errMsg string) {
// 	JSON(w, status, nil, errMsg)
// }
