package controllers

import (
	"ArtistManager/api_config/models"
	"ArtistManager/api_config/models/dto"
	"ArtistManager/api_config/services"
)

type ProjectController struct {
	ProjectService *services.ProjectService
	UserService    *services.UserService
	TaskService    *services.TaskService
}

func (controller *ProjectController) CreateProject(userId uint, projectCreate dto.ProjectCreate) string {
	user := controller.UserService.GetById(userId)

	if user == nil {
		return "USER_NOT_FOUND"
	}

	return controller.ProjectService.CreateProject(user, &projectCreate)
}

func (controller *ProjectController) AddTask(userId uint, projectId uint, taskCreate dto.TaskCreate) string {
	user := controller.UserService.GetById(userId)

	if user == nil {
		return "USER_NOT_FOUND"
	}

	project := controller.ProjectService.GetById(projectId)

	if project == nil {
		return "PROJECT_NOT_FOUND"
	}

	result := controller.TaskService.CreateTask(project, &taskCreate)

	if !result {
		return "INVALID_NAME"
	}

	return "OK"
}

func (controller *ProjectController) GetFromUser(userId uint) []models.Project {
	return controller.ProjectService.GetFromUser(userId)
}

func (controller *ProjectController) GetProjectsBySearchName(searchTerm string) []models.Project {
	return controller.ProjectService.SearchProjectsByName(searchTerm)
}

func (controller *ProjectController) MarkAsDone(userId uint, projectId uint) string {
	user := controller.UserService.GetById(userId)

	if user == nil {
		return "USER_NOT_FOUND"
	}

	project := controller.ProjectService.GetById(projectId)

	if project == nil {
		return "PROJECT_NOT_FOUND"
	}

	if project.UserID != userId {
		return "NOT_PROJECT_OWNER"
	}

	result := controller.ProjectService.EndProject(project)

	if !result {
		return "ALREADY_MARKED"
	}

	return "OK"
}

func (controller *ProjectController) DeleteTask(projectId uint, taskId uint) string {
        project := controller.ProjectService.GetById(projectId)

        if project == nil {
                return "PROJECT_NOT_FOUND"
        }

        result := controller.TaskService.DeleteTask(project, taskId)

        if !result {
                return "TASK_NOT_FOUND"
        }

        return "OK"
}
