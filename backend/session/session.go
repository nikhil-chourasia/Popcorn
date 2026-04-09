package session

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

type SessionData struct {
	UserID			string		`json:"user_id"`
	Email			string		`json:"email"`
	Name			string 		`json:"name"`
	Picture			string		`json:"picture"`
	AccessToken 	string		`json:"access_token"`
	RefreshToken 	string		`json:"refresh_token"`
	ExpiresAt		time.Time	`json:"expires_at"`
}

var client *redis.Client

func Init() {
	opt, err:= redis.ParseURL(os.Getenv("REDIS_URL"))
	if err != nil {
		panic("Invalid Redis URL: " + err.Error())
	}
	client = redis.NewClient(opt)
}

func NewID() (string, error) {
	b := make([]byte, 32)
	_, err:= rand.Read(b)
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

func Save(id string, data SessionData) error {
	bytes, err:= json.Marshal(data)	// converts the struct object in a json string
	if err != nil {
		return err
	}
	return client.Set(context.Background(), "session"+id, bytes, 7*24*time.Hour).Err()
}

func Get(id string) (SessionData, bool) {
	val, err := client.Get(context.Background(), "session"+id).Result()
	if err != nil {
		return SessionData{}, false
	}
	var data SessionData
	err = json.Unmarshal([]byte(val), &data)
	if err != nil {
		return SessionData{}, false
	}
	return data, true
}

func Delete(id string) {
	client.Del(context.Background(), "session"+id)
}