package handlers

import (
	"fmt"
	"io"
	"net/http"
	"strings"

	"backend/session"
)

func HandleDriveStream(w http.ResponseWriter, r *http.Request) {
	fileID := strings.TrimPrefix(r.URL.Path, "/api/drive/stream/")
	if fileID == "" {
		http.Error(w, "Missing file ID", http.StatusBadRequest)
		return
	}

	cookie, err := r.Cookie("session_id")
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	data, ok := session.Get(cookie.Value)
	if !ok {
		http.Error(w, "Session not found", http.StatusUnauthorized)
		return
	}

	driveURL := fmt.Sprintf(
		"https://www.googleapis.com/drive/v3/files/%s?alt=media",
		fileID,
	)

	req, err := http.NewRequest("GET", driveURL, nil)
	if err != nil {
		http.Error(w, "Failed to build request", http.StatusInternalServerError)
		return
	}

	req.Header.Set("Authorization", "Bearer "+data.AccessToken)

	if rangeHeader := r.Header.Get("Range"); rangeHeader != "" {
		req.Header.Set("Range", rangeHeader)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, "Drive stream failed", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusUnauthorized {
		http.Error(w, "Access token expired", http.StatusUnauthorized)
		return
	}

	for _, key := range []string{
		"Content-Type",
		"Content-Length",
		"Content-Range",
		"Accept-Ranges",        // ← was "Content-Ranges" (wrong)
	} {
		if val := resp.Header.Get(key); val != "" {
			w.Header().Set(key, val) // ← was w.Header.Set (missing parentheses)
		}
	}

	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}