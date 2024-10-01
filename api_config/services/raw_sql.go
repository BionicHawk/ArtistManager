package services

import (
	"database/sql"

	"gorm.io/gorm"
)

func GetSQLDB(gormDB *gorm.DB) *sql.DB {
	database, err := gormDB.DB()

	if err != nil {
		panic("Couldn't get the sql database!")
	}

	return database
}

func UpdateProjectTasksCount(projectId uint, dbContext *gorm.DB) {
	db := GetSQLDB(dbContext)

	_, err := db.Exec(`
		UPDATE PROJECTS
		SET NUMBER_OF_TASKS = (
			SELECT COUNT(*)
			FROM TASKS AS T
			WHERE T.PROJECT_ID = ?
		)
		WHERE ID = ?
	`, projectId, projectId)

	if err != nil {
		panic(err)
	}
}
