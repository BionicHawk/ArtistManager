package services

import (
	"ArtistManager/api_config/models"
	"ArtistManager/api_config/models/dto"
	"database/sql"
	"fmt"
	"time"

	"github.com/mattn/go-sqlite3"
	"gorm.io/gorm"
)

type ProjectService struct {
	DBContext *gorm.DB
}

func (service *ProjectService) GetById(projectId uint) (project *models.Project) {
	err := service.DBContext.First(&project, "id = ?", projectId).Error

	if err != nil {
		return nil
	}

	return project
}

func (service *ProjectService) SearchProjectsByName(name string) (projects []models.Project) {
	service.DBContext.Raw(
		`SELECT
			ID,
			NAME,
			DESCRIPTION,
			NUMBER_OF_TASKS,
			ADVANCEMENT,
			CREATED_AT,
			ENDED_AT,
			USER_ID
		FROM PROJECTS
		WHERE NAME LIKE ?`, fmt.Sprintf("%%%s%%", name)).Scan(&projects)
	return projects
}

func (service *ProjectService) GetFromUser(userId uint) []models.Project {
	projects := []models.Project{}
	service.DBContext.Where("user_id = ?", userId).Find(&projects)

	return projects
}

func (service *ProjectService) GetUserProject(projectId uint) *dto.UserProjectDtoOut {
	var project *models.Project
	var user *models.User

	service.DBContext.First(&project, "id = ?", projectId)

	if project == nil {
		return nil
	}

	service.DBContext.First(&user, "id = ?", project.UserID)

	if user == nil {
		return nil
	}

	return &dto.UserProjectDtoOut{
		ID:            project.ID,
		Name:          project.Name,
		Description:   &project.Description.String,
		NumberOfTasks: project.NumberOfTasks,
		Advancement:   project.Advancement,
		CreatedAt:     project.CreatedAt,
		EndedAt:       &project.EndedAt.Time,
		UserId:        project.UserID,
		User:          user.Name,
	}
}

func (service *ProjectService) CreateProject(user *models.User, projectCreate *dto.ProjectCreate) (string, uint) {

	var err error

	if len(projectCreate.Name) == 0 {
		return "EMPTY_NAME", 0
	}

	project := models.Project{
		Name:        projectCreate.Name,
		Description: sql.NullString{},
		UserID:      user.ID,
	}

	if projectCreate.Description != nil {
		project.Description.String = *projectCreate.Description
		project.Description.Valid = true
	}

	err = service.DBContext.Create(&project).Error

	if err != nil {
		fmt.Println(err)
		sqlError := err.(sqlite3.Error)
		if sqlError.ExtendedCode == 275 {
			return "INVALID_DESCRIPTION_LENGTH", 0
		}

		return "NOT_CREATED_DUPLICATE", 0
	}

	return "OK", project.ID
}

// func (service *ProjectService) UpdateData(project *models.Project, name *string, description *string) bool {
// 	if name != nil || description != nil {
// 		if name != nil {
// 			project.Name = *name
// 			service.DBContext.Update("name", project)
// 		}

// 		if description != nil {
// 			project.Description = sql.NullString{String: *description}
// 			service.DBContext.Update("description", project)
// 		}

// 		return true
// 	}

// 	return false
// }

// Función updateProject, se pasa proyecto, usuario asignado, nombre y descripción
// Se actualiza el proyecto con los datos pasados
func (service *ProjectService) UpdateProject(assignedUser *models.User, project *models.Project, name *string, description *string) bool {
	if name != nil {
		project.Name = *name
	}

	if description != nil {
		project.Description = sql.NullString{String: *description, Valid: true}
	}

	if assignedUser != nil {
		project.UserID = assignedUser.ID
	}

	if err := service.DBContext.Save(&project).Error; err != nil {
		fmt.Println("Error updating project:", err)
		return false
	}

	return true
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
	project := models.Project{}
	service.DBContext.First(&project, "id = ?", projectId)

	if project.ID == 0 {
		return false
	}

	service.DBContext.Model(&project).Update("deleted_at", time.Now())

	return true
}

func (service *ProjectService) GetAllProjects() []models.Project {
	projects := []models.Project{}
	service.DBContext.Where("deleted_at IS NULL").Find(&projects)

	return projects
}

func (service *ProjectService) GetProjectTasks(projectId uint) []models.Task {
	tasks := []models.Task{}
	service.DBContext.Where("project_id = ?", projectId).Find(&tasks)

	return tasks
}

func (service *ProjectService) UpdateTask(taskId uint, activityName string) bool {
	task := models.Task{}
	service.DBContext.First(&task, "id = ?", taskId)

	if task.ID == 0 {
		return false
	}

	service.DBContext.Model(&task).Update("activity_name", activityName)

	return true
}

func (service *ProjectService) DeleteTask(project *models.Project, taskId uint) bool {
	task := models.Task{}
	service.DBContext.First(&task, "id = ?", taskId)

	if task.ID == 0 {
		return false
	}

	service.DBContext.Model(&project).Association("Tasks").Delete(&task)

	return true
}

func (service *ProjectService) CompleteTask(taskId uint) *models.Project {
	task := models.Task{}
	service.DBContext.First(&task, "id = ?", taskId)

	if task.ID == 0 {
		return nil
	}

	service.DBContext.Model(&task).Update("completed_at", time.Now())

	project := models.Project{}
	service.DBContext.First(&project, "id = ?", task.ProjectID)

	return &project
}
