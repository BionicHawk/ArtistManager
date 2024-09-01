package services

import (
	"ArtistManager/api_config/models"
	"ArtistManager/api_config/models/dto"

	"gorm.io/gorm"
)

type TaskService struct {
	DBContext *gorm.DB
}

func (service *TaskService) GetById(taskId uint) *models.Task {
	var task *models.Task
	service.DBContext.First(&task, "id = ?", taskId)

	if task.ID == 0 {
		return nil
	}

	return task
}

func (service *TaskService) CreateTask(projectId uint, taskCreate *dto.TaskCreate) bool {
	task := &models.Task{
		ActivityName: taskCreate.ActivityName,
	}

	if taskCreate.Description != nil {
		task.Description = taskCreate.Description
	}

	service.DBContext.Create(&task)

	return task.ID != 0
}
