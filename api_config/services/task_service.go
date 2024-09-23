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
	service.DBContext.Raw(
		`SELECT 
			ID,
			ACTIVITY_NAME,
			DESCRIPTION,
			STATUS,
			CREATED_AT,
			ENDED_AT,
			PROJECT_ID
		WHERE ID = ?
		LIMIT 1`, taskId).Scan(&task)

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
			PROJECT_ID
		)
		VALUES(?, ?, ?)`, taskCreate.ActivityName, taskCreate.Description, project.ID).Error

	if err != nil {
		return false
	}

	// service.DBContext.Exec(
	// 	`UPDATE PROJECTS
	// 	SET NUMBER_OF_TASKS = (SELECT COUNT(*)
	// 		FROM TASKS AS T WHERE T.PROJECT_ID = ?)
	// 	WHERE ID = ?`, project.ID, project.ID)
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

	// service.DBContext.Model(project).Update("number_of_tasks", project.NumberOfTasks-1)

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
