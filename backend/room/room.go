package room

import (
	"backend/room"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"sync"
	"time"

	"golang.org/x/tools/go/analysis/passes/defers"
)

const TTL = 12 * time.Hour

type State struct{	
	// will be used to define the room state and to hold its meta data
	ID			string		`json:"id"`
	FileID		string		`json:"fileid"`
	HostID		string		`json:"hostid"`
	Playing		bool		`json:"playing"`
	CurrentTime	float64		`json:"currentTime"`
	UpdatedAt	time.Time	`json:"updatedAt"`
}

type Room struct {
	State	State
	Members	map[string]bool	// go memory map: https://go.dev/blog/maps#concurrent-access
}

var (	// chill we are just using this to declare all of them together.. get used to new syntax jeez
	mu sync.RWMutex		// read-write mutex which can be locked to make the changes in room data correct
	rooms = make(map[string]*Room)	// map of key value pair where key is a string and values are the addresses to rooms and we generate the keys here
)

func Init() {
	// this will summon a funciton cleanUpExpiredRooms() to remove the expired rooms every hour
	go func() {	// used to create anonymous functions as goroutines
		for{
			time.Sleep(1 * time.Hour)
			cleanUpExpiredRooms()
		}
	}()
}

func cleanUpExpiredRooms() {
	mu.Lock()
	defer mu.Unlock()
	now := time.Now()

	for id, r := range rooms {
		if now.Sub(r.State.UpdatedAt) > TTL{	//checks if difference in time is greater than ttl and deletes if staisfies
			delete(rooms, id)
		}
	}
}

func NewId() (string, error) {
	// creates a 6 digit room code
	b := make([]byte, 3)	// generates 3 random bytes
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(b)[:6], nil
	// converts them in 2 charecter hexa-decimals and then slices at index 0(inclusive) to 6(exclusive) 
}

func Create(fileID, hostID string) (string, error) {
	id, err := NewId()
	if err != nil {
		return "", err
	}

	mu.Lock()
	defer mu.Unlock()

	rooms[id] = &Room{	// filling the memory map with its value on a key value pair
		State: State{
			ID: id,
			FileID: fileID,
			HostID: hostID,
			Playing: false,
			CurrentTime: 0,
			UpdatedAt: time.Now(),
		},
		Members: make(map[string]bool),	// for tracking the members inside
	}
	return id, nil
}

func Get(id string) (State, bool) {
	// Get() function will be used to fetch the rooms from the rooms map
	mu.Lock()
	defer mu.Unlock()

	r, ok := rooms[id]
	if !ok{
		return State{}, false
	}

	return r.State, true
}

func SetPlayback(id string, playing bool, currentTime float64) error {
	// To set the video playback for the stream in the room like the video is playing or not or is in which timestamp
	mu.Lock()
	defer mu.Unlock()

	r, ok := rooms[id]
	if !ok {
		return errors.New("room not found")
	}

	r.State.Playing = playing
	r.State.CurrentTime = currentTime
	r.State.UpdatedAt = time.Now()
	return nil
}

func AddMember(id, sessionID string) {
	// Adds a new member to the room and adds them to the string to boll key value pair turning true on the session id
	mu.Lock()
	defer mu.Unlock()

	r, ok := rooms[id]
	if !ok {
		return
	}

	r.Members[sessionID] = true
	r.State.UpdatedAt = time.Now()
	return
}

func RemoveMember(id, sessionID string) {
	// Deletes the key value pair of the Members memory map and removes it completely
	mu.Lock()
	defer mu.Unlock()

	r, ok := rooms[id]
	if !ok {
		return
	}
	
	delete(r.Members, sessionID)
	r.State.UpdatedAt = time.Now()
	return
}