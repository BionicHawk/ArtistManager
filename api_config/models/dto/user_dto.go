package dto

import (
	"ArtistManager/api_config/models"
	"time"
)

type UserDtoOut struct {
	ID         uint          `json:"id"`
	Name       string        `json:"name"`
	ProfilePic *[]byte       `json:"profilePic"`
	Email      string        `json:"email"`
	Tasks      []models.Task `json:"tasks"`
	Role       string        `json:"role"`
	CreatedAt  time.Time     `json:"createdAt"`
}

type UserLogin struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserRegister struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}
