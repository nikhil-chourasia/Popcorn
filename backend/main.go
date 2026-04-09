package main

import (
	"backend/handlers"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func withCORS(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", os.Getenv("FRONTEND_URL"))

		w.Header().Set("Access-Control-Allow-Credentials", "true")

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		h(w, r)
	}
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file detected, reading from environment")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/api/auth/google", handlers.HandleGoogleLogin)
	http.HandleFunc("/api/auth/callback", handlers.HandleGoogleCallback)
	http.HandleFunc("/api/me", withCORS(handlers.HandleMe))

	fmt.Println("Popcorn backend starting... ")
	log.Fatal(http.ListenAndServe(":"+port, nil))
}