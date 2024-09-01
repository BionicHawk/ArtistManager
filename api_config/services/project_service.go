package services

import (
	"ArtistManager/api_config/models"
	"ArtistManager/api_config/models/dto"
	"database/sql"
	"fmt"
	"time"

	"gorm.io/gorm"
)

type ProjectService struct {
	DBContext *gorm.DB
}

func (service *ProjectService) GetById(projectId uint) (project *models.Project) {
	service.DBContext.First(&project, "id = ?", projectId)

	if project.ID == 0 {
		return nil
	}

	return project
}

func (service *ProjectService) SearchProjectsByName(name string) (projects []models.Project) {
	service.DBContext.Where("name Like", fmt.Sprintf("%%%s%%", name)).Find(&projects)
	return projects
}

func (service *ProjectService) CreateProject(user *models.User, projectCreate *dto.ProjectCreate) string {

	project := models.Project{
		Name:        projectCreate.Name,
		Description: sql.NullString{},
		UserID:      user.ID,
	}

	if projectCreate.Description != nil {
		project.Description.String = *projectCreate.Description
		project.Description.Valid = true
	}

	service.DBContext.Create(&project)

	if project.ID == 0 {
		return "NOT_CREATED"
	}

	return "OK"
}

func (service *ProjectService) UpdateData(project *models.Project, name *string, description *string) bool {
	if name != nil || description != nil {
		if name != nil {
			project.Name = *name
			service.DBContext.Update("name", project)
		}

		if description != nil {
			project.Description = sql.NullString{String: *description}
			service.DBContext.Update("description", project)
		}

		return true
	}

	return false
}

func (service *ProjectService) EndProject(project *models.Project) bool {
	if project.EndedAt.Valid {
		return false
	}

	currentTime := time.Now()

	service.DBContext.Model(&project).Update("ended_at", currentTime)

	return true
}

func (service *ProjectService) DeleteProject(projectId uint) bool {
	project := service.GetById(projectId)

	if project == nil {
		return false
	}

	service.DBContext.Delete(project)
	return true
}
