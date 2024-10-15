package models

import (
	"time"
)

type User struct {
	ID         uint `gorm:"primaryKey"`
	Name       string
	ProfilePic *[]byte
	Email      string `gorm:"unique"`
	Pwd        string
	Projects   []Project
	Role       string `gorm:"check:role_checker, role = 'ADMIN' or role = 'ARTIST'"`
	CreatedAt  time.Time
	Active     bool `gorm:"default:true"`
}
