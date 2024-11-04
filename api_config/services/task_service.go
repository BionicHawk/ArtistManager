package services

import (
	"ArtistManager/api_config/models"
	"ArtistManager/api_config/models/dto"
	"time"

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

	err := service.DBContext.Exec(
		`INSERT INTO TASKS
		(
			ACTIVITY_NAME,
			DESCRIPTION,
			PROJECT_ID,
			CREATED_AT
		)
		VALUES(?, ?, ?, CURRENT_TIMESTAMP)`, taskCreate.ActivityName, taskCreate.Description, project.ID).Error

	if err != nil {
		return false
	}

	UpdateProjectTasksCount(project.ID, service.DBContext)

	return true
}

func (service *TaskService) DeleteTask(project *models.Project, taskId uint) bool {
	err := service.DBContext.Exec(
		`DELETE FROM TASKS 
		WHERE ID = ? AND PROJECT_ID = ?`, taskId, project.ID).Error

	if err != nil {
		return false
	}

	service.DBContext.Exec(
		`UPDATE PROJECTS
			SET NUMBER_OF_TASKS = (SELECT COUNT(*)
				FROM TASKS AS T WHERE T.PROJECT_ID = ?)
		WHERE ID = ?`, project.ID, project.ID)

	return true
}

func (service *TaskService) DeleteAllFromProject(projectId uint) bool {
	err := service.DBContext.Exec(
		`DELETE FROM TASKS
		WHERE PROJECT_ID = ?`, projectId).Error
	// err := service.DBContext.Delete(&models.Task{}, "project_id = ?", projectId).Error
	return err == nil
}

func (service *TaskService) UpdateTaskStatus(task *models.Task, status string) string {
	statErr := service.DBContext.Exec(
		`UPDATE TASKS
		SET STATUS = ?
		WHERE ID = ?`, status, task.ID).Error

	if statErr != nil {
		return "NOT_UPDATED"
	}

	service.DBContext.Exec(
		`UPDATE PROJECTS
		SET ADVANCEMENT = IFNULL
		(
			(
				100 / NULLIF(NUMBER_OF_TASKS, 0)
				*
				(
					SELECT SUM
					(
						CASE 
							WHEN T.STATUS = 'done' THEN 1 
							WHEN T.STATUS = 'pending' THEN 0.5 
							ELSE 0 
						END
					) 
					FROM TASKS AS T WHERE T.PROJECT_ID = ?
				)
			),
			0
		)
		WHERE ID = ?`, task.ProjectID, task.ProjectID)

	return "OK"
}

func (service *TaskService) GetRecent(days uint) []models.Task {
	var tasks []models.Task
	fromTime := time.Now().AddDate(0, 0, -int(days)).UTC()
	service.DBContext.Model(&models.Task{}).Where("created_at >= ?", fromTime).Find(&tasks)

	return tasks
}
