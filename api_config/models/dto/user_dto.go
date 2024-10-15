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
	Active     bool            `json:"active"`
}

type UserProjectDtoOut struct {
	ID            uint       `json:"id"`
	Name          string     `json:"name"`
	Description   *string    `json:"description"`
	NumberOfTasks uint       `json:"numberOfTasks"`
	Advancement   float64    `json:"advancement"`
	CreatedAt     time.Time  `json:"createdAt"`
	EndedAt       *time.Time `json:"endedAt"`
	UserId        uint       `json:"userId"`
	User          string     `json:"user"`
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
