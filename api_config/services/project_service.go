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
	service.DBContext.First(project, "id = ?", projectId)
	return project
}

func (service *ProjectService) SearchProjectsByName(name string) (projects []models.Project) {
	service.DBContext.Where("name Like", fmt.Sprintf("%%%s%%", name)).Find(&projects)
	return projects
}

func (service *ProjectService) CreateProject(projectCreate dto.ProjectCreate) bool {
	project := models.Project{
		Name:        projectCreate.Name,
		Description: sql.NullString{String: *projectCreate.Description},
	}

	service.DBContext.Create(&project)

	return project.ID != 0
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

	currentTime := time.Now().UTC()
	project.EndedAt.Time = currentTime

	service.DBContext.Update("ended_at", project)

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
