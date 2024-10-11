package controllers

import (
	"ArtistManager/api_config/models"
	"ArtistManager/api_config/models/dto"
	"ArtistManager/api_config/services"
	"time"
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

func (controller *ProjectController) GetById(projectId uint) *dto.ProjectDtoOut {
	project := controller.ProjectService.GetById(projectId)
	var description *string
	var endedAt *time.Time

	if project == nil {
		return nil
	}

	if project.Description.Valid {
		description = &project.Description.String
	}

	if project.EndedAt.Valid {
		endedAt = &project.EndedAt.Time
	}

	return &dto.ProjectDtoOut{
		ID:          project.ID,
		Name:        project.Name,
		Description: description,
		Tasks:       []dto.TaskDtoOut{},
		CreatedAt:   project.CreatedAt,
		EndedAt:     endedAt,
	}
}

func (controller *ProjectController) GetWithUserById(projectId uint) *dto.UserProjectDtoOut {
	return controller.ProjectService.GetUserProject(projectId)
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

func (controller *ProjectController) DeleteProject(userId uint, projectId uint) string {
	user := controller.UserService.GetById(userId)

	if user == nil {
		return "USER_NOT_FOUND"
	}

	deletionTaskResutl := controller.TaskService.DeleteAllFromProject(projectId)

	if !deletionTaskResutl {
		return "PROJECT_NOT_FOUND"
	}

	result := controller.ProjectService.DeleteProject(projectId)

	if !result {
		return "COULD_NOT_DELETE_PROJECT"
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
