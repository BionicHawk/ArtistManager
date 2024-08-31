package app_test

import (
	"ArtistManager/api_config/controllers"
	"ArtistManager/api_config/models/dto"
	"testing"
)

func TestCreateProject(t *testing.T) {
	controller := GenerateProjectController()
	createArtist(controller)

	result := controller.CreateProject(1, dto.ProjectCreate{
		Name: "ProjectExample",
	})

	if result != "OK" {
		t.Fatalf("It should have been created!")
	}
}

func TestCreateProjectDuplicate(t *testing.T) {
	controller := GenerateProjectController()
	createArtist(controller)

	_ = controller.CreateProject(1, dto.ProjectCreate{
		Name: "ProjectExample",
	})

	result := controller.CreateProject(1, dto.ProjectCreate{
		Name: "ProjectExample",
	})

	if result != "NOT_CREATED" {
		t.Fatalf("Duplicates on projects shouldn't exist. Expected output 'NOT_CREATED', received '%s'", result)
	}
}

func TestCreateWithDescription(t *testing.T) {
	controller := GenerateProjectController()
	createArtist(controller)

	description := "A description"

	result := controller.CreateProject(1, dto.ProjectCreate{
		Name:        "ProjectExample",
		Description: &description,
	})

	project := controller.ProjectService.GetById(1)

	if result != "OK" && project.Description.String == description {
		t.Fatalf("A project with description should be able to be created. Expected 'OK', received '%s'", result)
	}
}

func TestSearchProjects(t *testing.T) {
	term := "Project"
	controller := GenerateProjectController()
	createArtist(controller)

	projects := []dto.ProjectCreate{
		{
			Name: "Project1",
		},
		{
			Name: "Project2",
		},
		{
			Name: "Project3",
		},
		{
			Name: "Project4",
		},
	}

	for i := 0; i < len(projects); i++ {
		project := projects[i]
		controller.CreateProject(1, project)
	}

	results := controller.GetProjectsBySearchName(term)

	if len(results) != 4 {
		t.Fatalf("Expected %d entities, got %d entities instead", 4, len(results))
	}
}

func TestMarkProjectDone(t *testing.T) {
	controller := GenerateProjectController()
	createArtist(controller)

	project := dto.ProjectCreate{
		Name: "A project",
	}

	controller.CreateProject(1, project)

	result := controller.MaskAsDone(1, 1)
	createdProject := controller.ProjectService.GetById(1)

	if result != "OK" && createdProject.EndedAt.Valid {
		t.Fatalf("Expected 'OK', got '%s'", result)
	}
}

func TestMarkAsDoneProjectMarkedAsDone(t *testing.T) {
	controller := GenerateProjectController()
	createArtist(controller)

	controller.CreateProject(1, dto.ProjectCreate{
		Name: "A project",
	})

	controller.MaskAsDone(1, 1)
	result := controller.MaskAsDone(1, 1)

	if result != "ALREADY_MARKED" {
		t.Fatalf("Expected 'ALREADY_MARKED', got '%s'", result)
	}
}

func createArtist(controller *controllers.ProjectController) bool {
	return controller.UserService.CreateUser(&dto.UserRegister{
		Name:     "Example",
		Email:    "example@gmail.com",
		Password: "Str0ngP455!",
	}, false)
}
