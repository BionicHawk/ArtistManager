package app_test

import (
	"ArtistManager/api_config/controllers"
	"ArtistManager/api_config/models"
	"ArtistManager/api_config/services"

	"gorm.io/gorm"
)

func loadDatabase() *gorm.DB {
        return models.Init(":memory:")
}

func GenerateUserController() *controllers.UserController {
	db := loadDatabase()
	userService := services.UserService{
		DBContext: db,
	}

	return &controllers.UserController{
		UserService: &userService,
	}
}

func GenerateProjectController() *controllers.ProjectController {
	db := loadDatabase()
	projectService := services.ProjectService{
		DBContext: db,
	}

	userService := services.UserService{
		DBContext: db,
	}

	taskService := services.TaskService{
		DBContext: db,
	}

	return &controllers.ProjectController{
		ProjectService: &projectService,
		UserService:    &userService,
		TaskService:    &taskService,
	}
}
