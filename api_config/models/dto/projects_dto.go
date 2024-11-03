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

type ProjectCreate struct {
	Name        string  `json:"name"`
	Description *string `json:"description"`
}

type CreateProjectResponse struct {
	Result    string `json:"result"`
	ProjectID uint   `json:"projectId"`
}

type UpdateProject struct {
	ProjectID   uint    `json:"projectId"`
	UserId      uint    `json:"userId"`
	Name        *string `json:"name"`
	Description *string `json:"description"`
}
