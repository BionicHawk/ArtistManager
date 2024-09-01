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

	error := service.DBContext.Create(&task).Error

	return error == nil
}

func (service *TaskService) DeleteTask(taskId uint) bool {
	var task *models.Task
	error := service.DBContext.Delete(&task, taskId).Error

	return error == nil
}
