package models

import (
	"database/sql"
	"time"
)

type Task struct {
	ID           uint         `json:"id"`
	ActivityName string       `json:"activityName" gorm:"check:length_checker, LENGTH(activity_name) > 2 and LENGTH(activity_name) < 101"`
	Description  *string      `json:"description"`
	Status       string       `gorm:"check:status_checker,status = 'received' or status = 'pending' or status = 'done';default:'pending'" json:"status"`
	CreatedAt    time.Time    `json:"createdAt"`
	EndedAt      sql.NullTime `json:"endedAt"`
	ProjectID    uint         `json:"projectId"`
}
