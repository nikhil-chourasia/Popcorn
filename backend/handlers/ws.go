package handlers

import (
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