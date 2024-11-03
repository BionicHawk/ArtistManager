package models

import (
	"database/sql"
	"time"
)

type Project struct {
	ID            uint           `json:"id"`
	Name          string         `gorm:"unique;check:name_length,LENGTH(name) > 3" json:"name"`
	Description   sql.NullString `gorm:"check:desc_length, LENGTH(description) > 0 and LENGTH(description) < 501" json:"description"`
	Tasks         []Task         `json:"tasks"`
	NumberOfTasks uint           `json:"numberOfTasks" gorm:"default: 0"`
	Advancement   float64        `json:"advancement" gorm:"default: 0.0"`
	CreatedAt     time.Time      `json:"createdAt"`
	EndedAt       sql.NullTime   `json:"endedAt"`
	UserID        uint           `json:"userId"`
	DeletedAt     sql.NullTime   `json:"deletedAt"`
}
