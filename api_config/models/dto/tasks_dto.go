package dto

import "time"

type TaskDtoOut struct {
	ID           uint       `json:"id"`
	ActivityName string     `json:"activityName"`
	Description  *string    `json:"description"`
	Status       string     `gorm:"check:status_checker,status = 'received' or status = 'pending' or status = 'done'" json:"status"`
	CreatedAt    time.Time  `json:"createdAt"`
	EndedAt      *time.Time `json:"endedAt"`
	Project      string     `json:"project"`
}

type TaskCreate struct {
	ActivityName string  `json:"activityName"`
	Description  *string `json:"description"`
}
