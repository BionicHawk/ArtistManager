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
	dbContext := models.Init()
	// Services
	userService := services.UserService{DBContext: dbContext}
	projectService := services.ProjectService{DBContext: dbContext}

	// Controllers
	userController := controllers.UserController{UserService: &userService}
	projectController := controllers.ProjectController{
		ProjectService: &projectService,
		UserService:    &userService,
	}

	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "ArtistManager",
		Width:  1024,
		Height: 768,
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
			BackdropType:         windows.Acrylic,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}

func ScopeServices(database *gorm.DB) {

}
