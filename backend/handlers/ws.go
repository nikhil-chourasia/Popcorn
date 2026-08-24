package handlers

import (
	"backend/room"
	"backend/session"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"

	"github.com/gorilla/websocket"
)

type WSMessage struct{	// message in websocket hub
	Type	string	`json:"type"`
	Time	float64	`json:"time,omitempty"`
	Playing	bool	`json:"playing,omitmepty"`
	FileID	string	`json:"fileId,omitempty"`
	Name	string	`json:"name,omitempty"`
	Msg		string	`json:"msg,omitempty"`
}

type Client struct {	// represents one websocket connection
	conn		*websocket.Conn
	roomID		string
	sessionID	string
	userName	string
	send		chan WSMessage	
	// chan is a channel type in go which is used to send data inside our rooms or you can say in our go routines without the need of locking or unlocking -> https://devdocs.io/go/go/types/index#Chan
}

type Hub struct {
	// manages all rooms
	mu	sync.RWMutex
	rooms	map[string]map[*Client]bool
	// this map keeps all the clients inside mapped to a room id
}

var GlobalHub = &Hub{
	rooms: make(map[string]map[*Client]bool),	// creating an instance of Hub
}

func (h *Hub) join(c *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if h.rooms[c.roomID] == nil{
		h.rooms[c.roomID] = make(map[*Client]bool)
	}

	h.rooms[c.roomID][c] = true
}

func (h *Hub) leave(c *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()

	delete(h.rooms[c.roomID], c)
	if len(h.rooms[c.roomID]) == 0 {
		delete(h.rooms, c.roomID)
	}
}

func (h *Hub) broadcast(roomID string, msg WSMessage, sender *Client){
	// boradcasts a message through channels in the Hub of type WSMessage except the sender 
	h.mu.RLock()
	defer h.mu.RUnlock()
	 for c:= range h.rooms[roomID] {
		if c == sender {
			continue	// we dont send the message to the sender
		}
		select {
			case c.send <- msg:
			// <- is operater to push the message through the channel type in the Client struct i.e. Client.send where we are pushing the WSMessage instance
			// we kept the case blank as there is nothing to execute and then we move on 
			default:
			// if the client is already buffered and full with message we cant hamper the server hence we move on when the message doesnt go through
			// there is a reason we didn't use if/else ask yourself
		}
	}
}

var upgrader = websocket.Upgrader{
	// creating an instance of the websocket.Upgrader struct which provides parameters for an http connection to upgrade to websocket
	// one of the paremeters is CheckOrigin which is in defination is a field that holds a fucntion of the same signature which is here defined to take the json from the handshake an verify the origin of it so that we can use it for CORS protection
	CheckOrigin: func(r *http.Request) bool{
		origin := r.Header.Get("Origin")
		return origin == os.Getenv("FRONTEND_URL")
	},
}

func HandleRoomWS(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session_id")
	if err != nil {
		http.Error(w, "Not authenticated", http.StatusUnauthorized)
		return
	}
	sess, ok := session.Get(cookie.Value)
	if !ok {
		http.Error(w, "Session not found", http.StatusUnauthorized)
		return
	}

	roomID := strings.ToLower(strings.TrimPrefix(r.URL.Path, "/ws/room/"))
	state, ok := room.Get(roomID)
	if !ok {
		http.Error(w, "Room not found", http.StatusInternalServerError)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WS Upgrade error", err)
		return
	}

	c := &Client{
		conn: conn,
		roomID: roomID, 
		sessionID: cookie.Value,
		userName: sess.Name,
		send: make(chan WSMessage, 16),
	}
	GlobalHub.join(c)
	room.AddMember(roomID, cookie.Value)

	// to send current room state to the new client joined
	c.send <- WSMessage{
		Type: "state",
		Playing: state.Playing,
		Time: state.CurrentTime,
		FileID: state.FileID,
	}

	// to tell eeyone the new client joined
	GlobalHub.broadcast(roomID, WSMessage{
		Type: "joined",
		Name: sess.Name,
	}, c)

	// goroutine to write outgoing messages to the websocket
	go func() {
		defer conn.Close()
		// we need to close the connection as the go routine will be continously looking for the c.send to fill up and send messages 
		// which can put our go routine in an infinite loop wating resources
		// so we will just close the connection
		for msg := range c.send {
			conn.WriteJSON(msg)
			// we already sent the message using <- inside the channel right then why do we need to do it again?
			// well actually this is <- not exactly used to send the messege but to push the message to server ram's internal queue which is ready for dispatch
			// and we are making goroutine to send those messages over the internet to all the clients by writing it in json
		}

		// now the question being 45 mins in a 2hr movie wsmessage is sent and what is connection is closed no more wsmessages right?
		// WRONG! what actually happens is that the goroutine will go to sleep or idle state until a new msg arrives in c.send
		// so when does the connection is actually lost...
		// when th ec.send channel is destroyed that means if the host turns off the room or the server deletes the room or destroys the room 
		// the connection is lost and the goroutine can finally live a free life unlike the kids in my basement
	}()
	// you might be wondering what does these parenthesis do? 
	// they are actually there for executing the function immediately 
	// this is called Immediately Invoked Function Expression
	defer func() {
		// this is a cleanup function which removes the user form the GlobalHub when they leave or they close the tab
		// we used defer because for them the handler closes when they leave hence this would run just before closing them
		GlobalHub.leave(c)
		room.RemoveMember(roomID, cookie.Value)
		close(c.send)
		GlobalHub.broadcast(roomID, WSMessage{
			Type:"left",
			Name: sess.Name,
		}, c)
	}()

	for {
		var msg WSMessage
		err = conn.ReadJSON(&msg)
		if err != nil {
			break
		}

		switch msg.Type {
			case "ping":
				c.send <- WSMessage{Type:"pong"}
			case "play", "pause", "seek":
				// only the host can control playback
				state, _ := room.Get(roomID)
			if c.sessionID != state.HostID {
				// future plan: users can request control
				continue
			} 
			room.SetPlayback(roomID, msg.Type == "play", msg.Time)
			GlobalHub.broadcast(roomID, msg, c)
		}
	}
}