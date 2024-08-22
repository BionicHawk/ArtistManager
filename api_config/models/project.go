package models

import (
	"database/sql"
	"time"
)

type Project struct {
	ID          uint           `json:"id"`
	Name        string         `gorm:"unique" json:"name"`
	Description sql.NullString `json:"description"`
	Tasks       []Task         `json:"tasks"`
	CreatedAt   time.Time      `json:"createdAt"`
	EndedAt     sql.NullTime   `json:"endedAt"`
	UserID      uint           `json:"userId"`
}
