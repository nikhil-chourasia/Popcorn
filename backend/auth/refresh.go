package auth

import (
	"net/http"
	"encoding/json"
	"net/url"
	"os"
	"strings"
	"time"
	"io"
)

type TokenResponse struct {
	AccessToken	string	`json:"access_token"`
	ExpiresIn	time.Time		`json:"expires_in"`
}

func RefreshAccessToken(refreshToken string) (*TokenResponse, error) {
	body := url.Values{
		"client_id": {os.Getenv("GOOGLE_CLIENT_ID")},
		"client_secret": {os.Getenv("GOOGLE_CLIENT_SECRET")},
		"refresh_token": {refreshToken},
		"grant_type": {"refresh_token"},
	}

	resp, err := http.Post(
		"https://oauth2.googleapis.com/token",
        "application/x-www-form-urlencoded",
		strings.NewReader(body.Encode()),
	)
	if err != nil {
		return &TokenResponse{
			AccessToken: "",
			ExpiresIn: time.Time{},
		}, err
	}

	defer resp.Body.Close()

	raw, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != 200 {
		return &TokenResponse{
			AccessToken: "",
			ExpiresIn: time.Time{},
		}, err
	}

	var t TokenResponse
	err = json.Unmarshal(raw, &t)
	if err != nil {
		return &TokenResponse{
			AccessToken: "",
			ExpiresIn: time.Time{},
		}, err
	}

	return &TokenResponse {
		AccessToken: t.AccessToken,
		ExpiresIn: t.ExpiresIn,
	}, nil
}