package handlers

import(
	"encoding/json"
	"net/http"

	"backend/session"
)

func HandleMe(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session_id")
	if err != nil {
		http.Error(w, "Not authenticated", http.StatusUnauthorized)
		return
	}

	data, ok := session.Get(cookie.Value)	// using , ok because it is a boolean output
	if !ok {
		http.Error(w, "Session not found", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"user_id": data.UserID,
		"email": data.Email,
		"name": data.Name,
		"picture": data.Picture,
	})
}