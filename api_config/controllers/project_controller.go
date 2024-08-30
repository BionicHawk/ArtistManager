package controllers

import (
	"ArtistManager/api_config/models/dto"
	"ArtistManager/api_config/services"
)

type ProjectController struct {
	ProjectService *services.ProjectService
	UserService    *services.UserService
}

func (controller *ProjectController) CreateProject(projectCreate dto.ProjectCreate) {

}
