package models

import (
	"database/sql"
	"time"
)

type Project struct {
	ID          uint           `json:"id"`
	Name        string         `gorm:"unique;check:name_length,LENGTH(name) > 3" json:"name"`
	Description sql.NullString `gorm:"check:desc_length, LENGTH(description) > 0 or LENGTH(description) <= 500" json:"description"`
	Tasks       []Task         `json:"tasks"`
	CreatedAt   time.Time      `json:"createdAt"`
	EndedAt     sql.NullTime   `json:"endedAt"`
	UserID      uint           `json:"userId"`
}
