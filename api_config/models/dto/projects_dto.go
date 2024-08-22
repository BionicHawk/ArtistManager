package dto

import (
	"time"
)

type ProjectDtoOut struct {
	ID          uint         `json:"id"`
	Name        string       `gorm:"unique" json:"name"`
	Description *string      `json:"description"`
	Tasks       []TaskDtoOut `json:"tasks"`
	CreatedAt   time.Time    `json:"createdAt"`
	EndedAt     *time.Time   `json:"endedAt"`
}
