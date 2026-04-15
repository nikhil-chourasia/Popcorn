package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"

	"backend/session"
)

type DriveFile struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	Size          string `json:"size"`
	MimeType      string `json:"mimeType"`
	ModifiedTime  string `json:"modifiedTime"`
	ThumbnailLink string `json:"thumbnailLink"`
}

type DriveResponse struct {
	Files []DriveFile `json:"files"`
}

func HandleDriveFilesList(w http.ResponseWriter, r *http.Request) {
	// Bug 1 fix: read from cookie, not URL query param
	cookie, err := r.Cookie("session_id")
	if err != nil {
		http.Error(w, "Not authenticated", http.StatusUnauthorized)
		return
	}

	data, ok := session.Get(cookie.Value)
	if !ok {
		http.Error(w, "Session not found", http.StatusUnauthorized)
		return
	}

	accessToken := data.AccessToken

	query := "(mimeType = 'video/mp4' or mimeType = 'video/x-matroska') and trashed = false"
	fields := "files(id,name,size,mimeType,modifiedTime,thumbnailLink)"

	driveURL := fmt.Sprintf(
		"https://www.googleapis.com/drive/v3/files?q=%s&fields=%s&pageSize=100",
		url.QueryEscape(query),
		url.QueryEscape(fields),
	)

	req, err := http.NewRequest("GET", driveURL, nil)
	if err != nil {
		http.Error(w, "Failed to build request", http.StatusInternalServerError)
		return
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, "Drive request failed", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusUnauthorized {
		http.Error(w, "Access token expired", http.StatusUnauthorized)
		return
	}

	var result DriveResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		http.Error(w, "Failed to decode Drive response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result.Files)
}