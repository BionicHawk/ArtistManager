package controllers

import (
	"ArtistManager/api_config/models"
	"ArtistManager/api_config/models/dto"
	"ArtistManager/api_config/services"
)

type ProjectController struct {
	ProjectService *services.ProjectService
	UserService    *services.UserService
}

func (controller *ProjectController) CreateProject(userId uint, projectCreate dto.ProjectCreate) string {
	user := controller.UserService.GetById(userId)

	if user == nil {
		return "USER_NOT_FOUND"
	}

	return controller.ProjectService.CreateProject(user, &projectCreate)
}

func (controller *ProjectController) GetProjectsBySearchName(searchTerm string) []models.Project {
	return controller.ProjectService.SearchProjectsByName(searchTerm)
}

func (controller *ProjectController) MaskAsDone(userId uint, projectId uint) string {
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
