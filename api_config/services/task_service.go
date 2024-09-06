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

func (service *TaskService) CreateTask(project *models.Project, taskCreate *dto.TaskCreate) bool {
	task := models.Task{
		ActivityName: taskCreate.ActivityName,
		ProjectID:    project.ID,
	}

	if taskCreate.Description != nil {
		task.Description = taskCreate.Description
	}

	err := service.DBContext.Create(&task).Error

	if err != nil {
		return false
	}

	var count int64

	service.DBContext.Model(&models.Task{}).Where("project_id = ?", project.ID).Count(&count)
	service.DBContext.Model(&project).Update("number_of_tasks", count)

	return true
}

func (service *TaskService) DeleteTask(project *models.Project, taskId uint) bool {
	var task *models.Task
	err := service.DBContext.Delete(&task, taskId).Error

    if err != nil {
            return false
    }

    service.DBContext.Model(project).Update("number_of_tasks", project.NumberOfTasks - 1)

	return true
}

func (service *TaskService) DeleteAllFromProject(projectId uint) bool {
	err := service.DBContext.Delete(&models.Task{}, "project_id = ?", projectId).Error
	return err == nil
}
