package controllers

import (
	"ArtistManager/api_config/models/dto"
	"ArtistManager/api_config/services"
	"time"
)

type TaskController struct {
	TaskService   *services.TaskService
	ProjectSerice *services.ProjectService
}

func (controller *TaskController) GetRecentsTasks(days uint) []dto.TaskDtoOut {
	tasksOuts := []dto.TaskDtoOut{}

	tasks := controller.TaskService.GetRecent(days)

	for i := 0; i < len(tasks); i++ {
		var endedAt *time.Time

		task := tasks[i]
		project := controller.ProjectSerice.GetById(task.ProjectID)

		if task.EndedAt.Valid {
			endedAt = &task.EndedAt.Time
		}

		taskOut := dto.TaskDtoOut{
			ID:           task.ID,
			ActivityName: task.ActivityName,
			Description:  task.Description,
			Status:       task.Status,
			CreatedAt:    task.CreatedAt,
			EndedAt:      endedAt,
			Project:      project.Name,
		}

		tasksOuts = append(tasksOuts, taskOut)
	}

	return tasksOuts
}
