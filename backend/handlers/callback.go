package handlers

import (
	"backend/auth"
	"backend/session"
	"context"
	"encoding/json"
	"net/http"
	"os"
	"time"
)

type GoogleUserInfo struct {
	ID		string	`json:"sub"`
	Email	string	`json:"email"`
	Name	string 	`json:"name"`
	Picture	string	`json:"picture"`
}

func HandleGoogleLogin( w http.ResponseWriter, r *http.Request) {
	state, err := auth.GenenrateState()
	if err != nil {
		http.Error(w, "Failed to process state", http.StatusInternalServerError)
		return
	}

	// my first cookie lets goo :)

	http.SetCookie(w, &http.Cookie{
		Name: "oauth_state",
		Value: state,
		Expires: time.Now().Add(10*time.Minute),
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Path: "/",
	})

	url := auth.Config().AuthCodeURL(state)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func HandleGoogleCallback(w http.ResponseWriter, r *http.Request) {
	stateCookie, err := r.Cookie("oauth_state")
	if err != nil {
		http.Error(w, "State cookie mismatch", http.StatusBadRequest)
		return
	}

	if r.URL.Query().Get("state") != stateCookie.Value {
		http.Error(w, "State mismatch", http.StatusBadRequest)
		return
	}

	code := r.URL.Query().Get("code")
	if code == "" {
		http.Error(w, "No code provided", http.StatusBadRequest)
		return
	}

	token, err := auth.Config().Exchange(context.Background(), code)
	if err != nil {
		http.Error(w, "Token Exchange failed: " + err.Error(), http.StatusInternalServerError)
		return
	}

	client := auth.Config().Client(context.Background(), token)
	resp, err:= client.Get("https://www.googleapis.com/oauth2/v3/userinfo")
	if err != nil {
		http.Error(w, "Failed to get user info", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	var userInfo GoogleUserInfo
	err = json.NewDecoder(resp.Body).Decode(&userInfo) 
	if err != nil {
		http.Error(w, "Failed to decode user info", http.StatusInternalServerError)
		return
	}
	
	sessionID, err := session.NewID()
	if err != nil {
		http.Error(w, "Failed to create session", http.StatusInternalServerError)
		return
	}

	session.Save(sessionID, session.SessionData{
		UserID: userInfo.ID,
		Email: userInfo.Email,
		Name: userInfo.Name,
		Picture: userInfo.Picture,
		AccessToken: token.AccessToken,
		RefreshToken: token.RefreshToken,
		ExpiresAt: token.Expiry,

	})

	http.SetCookie(w, &http.Cookie{
		Name: "session_id",
		Value: sessionID,
		Path: "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		MaxAge: 60 * 60 * 24 * 7,
	})

	frontendURL := os.Getenv("FRONTEND_URL")
	http.Redirect(w, r, frontendURL+"/", http.StatusTemporaryRedirect)	// you can add the redirect route here
}
