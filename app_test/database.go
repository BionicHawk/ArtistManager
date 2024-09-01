package app_test

import (
	"ArtistManager/api_config/controllers"
	"ArtistManager/api_config/models"
	"ArtistManager/api_config/services"
	"fmt"
	"os"

	"gorm.io/gorm"
)

const databaseFile = "database.db3"

func loadDatabase() *gorm.DB {
	err := os.Remove(databaseFile)

	if err != nil {
		fmt.Printf("No database named as '%s' was found, it will be rewrited", databaseFile)
	}

	return models.Init()
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

	return &controllers.ProjectController{
		ProjectService: &projectService,
		UserService:    &userService,
	}
}
