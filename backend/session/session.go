package session

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	// "os"
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
	client = redis.NewClient(&redis.Options{
		Addr:     "redis-12467.c330.asia-south1-1.gce.cloud.redislabs.com:12467",
		Username: "default",
		Password: "cb0QtQ4BCsvyKvy73uYC3fl1MWrl7PAI",
		DB:       0,
	})

	if err := client.Ping(context.Background()).Err(); err != nil {
		panic("Cannot connect to Redis: " + err.Error())
	}

	println("Redis connected successfully")
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
	return client.Set(context.Background(), "session:"+id, bytes, 7*24*time.Hour).Err()
}

func Get(id string) (SessionData, bool) {
	val, err := client.Get(context.Background(), "session:"+id).Result()
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
	client.Del(context.Background(), "session:"+id)
}