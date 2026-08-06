package handlers

import (
	"backend/room"
	"backend/session"
	"encoding/json"
	"net/http"
	"strings"
)

// We need to create a handler function to create the room for that we are going to do:
// POST /api/room/create
// Body: {"fileId":"asdfas....", "hostId": "asdfasdfasdfa",}
// Returns: {"roomId": "a78sd7f"}

func HandleCreateRoom(w http.ResponseWriter, r *http.Request){

	// AUTH check to get the hostId
 	cookie, err := r.Cookie("session_id")
  	if err != nil {
   		http.Error(w, "Not Authenticated", http.StatusUnauthorized)
    	return
    }

    sess, ok := session.Get(cookie.Value)
    if !ok {
    	http.Error(w, "Session Not Found", http.StatusUnauthorized)
     	return
    }

    // Parsing fileId to form the Body of the Payload
    var body struct {
    	FileID string `json:"fileId"`
    }
    err = json.NewDecoder(r.Body).Decode(&body)
    if err != nil || body.FileID == "" {
    	http.Error(w, "Missing fileId", http.StatusInternalServerError)
     	return
    }

    // Creating the room in Memory map and getting the roomId
    roomID, err := room.Create(body.FileID, sess.UserID)
    if err != nil {
    	http.Error(w, "Failed to create room", http.StatusInternalServerError)
    	return
    }

    // We need to return the room ID
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{
    	"roomId": strings.ToUpper(roomID),
    })
    // We didn't write a proper return statement because NewEncoder writes the json directly on the http network
}

// This Handler is to Get the room for the member to join
// GET /api/room/:id
// Returns: Room state (fileID, playing, time)

func HandleGetRoom(w http.ResponseWriter, r *http.Request) {
	roomID := strings.TrimPrefix(r.URL.Path, "/api/room")	// trims the url to get the room id
	if roomID == "" {
		http.Error(w, "Missing Room ID", http.StatusInternalServerError)
		return
	}

	state, ok := room.Get(roomID)
	if !ok {
		http.Error(w, "Room not found", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(state)
}