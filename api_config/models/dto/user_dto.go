package dto

import (
	"time"
)

type UserDtoOut struct {
	ID         uint            `json:"id"`
	Name       string          `json:"name"`
	ProfilePic *[]byte         `json:"profilePic"`
	Email      string          `json:"email"`
	Projects   []ProjectDtoOut `json:"projects"`
	Role       string          `json:"role"`
	CreatedAt  time.Time       `json:"createdAt"`
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
