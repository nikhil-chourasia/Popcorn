package handlers

import (
	"fmt"
	"net/http"
	"encoding/json"
	"backend/session"
)

func HandleDriveFilesList(w http.ResponseWriter, r *http.Request) {
	sessionID := r.URL.Query().Get("session_id")
	if sessionID == "" {
		http.Error(w, "Session ID Not Found", http.StatusInternalServerError)
		return
	}
	session, ok := session.Get(sessionID)
	if !ok {
		http.Error(w, "Session not found", http.StatusInternalServerError)
		return
	}

	accessToken = session.AccessToken

	
	
}