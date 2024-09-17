package main

import (
	"ArtistManager/api_config/controllers"
	"ArtistManager/api_config/models"
	"ArtistManager/api_config/services"
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
	"gorm.io/gorm"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	dbContext := models.Init("database.db3")
	// Services
	userService := services.UserService{DBContext: dbContext}
	projectService := services.ProjectService{DBContext: dbContext}
	taskService := services.TaskService{DBContext: dbContext}

	// Controllers
	userController := controllers.UserController{UserService: &userService}
	projectController := controllers.ProjectController{
		ProjectService: &projectService,
		UserService:    &userService,
		TaskService:    &taskService,
	}

	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:     "ArtistManager",
		Width:     854,
		Height:    480,
		MinWidth:  720,
		MinHeight: 480,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 0, G: 0, B: 0, A: 123},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
			&userController,
			&projectController,
		},
		Windows: &windows.Options{
			WebviewIsTransparent: true,
			WindowIsTranslucent:  true,
			BackdropType:         windows.Tabbed,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}

func ScopeServices(database *gorm.DB) {

}
