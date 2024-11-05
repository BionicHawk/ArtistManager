package app_test

import (
	"ArtistManager/api_config/controllers"
	"ArtistManager/api_config/models"
	"ArtistManager/api_config/models/dto"
	"fmt"
	"testing"
)

func TestCreateProject(t *testing.T) {
	controller := GenerateProjectController()
	createArtist(controller)

	// Create a project
	result := controller.CreateProject(1, dto.ProjectCreate{
		Name: "ProjectExample",
	})

	// Retrieve the project by ID
	project := controller.ProjectService.GetById(result.ProjectID)

	// Check if the project was created successfully
	if result.Result != "OK" || project == nil {
		t.Fatalf("It should have been created! Result: %v", result.Result)
		return
	}

	// Verify the project ID
	if result.ProjectID == 0 {
		t.Errorf("Expected projectId to be non-zero, got %v", result.ProjectID)
	}

	// Verify the project details
	if project.Name != "ProjectExample" {
		t.Errorf("Expected project name to be 'ProjectExample', got %v", project.Name)
	}

	// Print the project ID and name
	fmt.Printf("Project ID: %v\n", result.ProjectID)
	fmt.Printf("Project Name: %v\n", project.Name)

	fmt.Println("Done!")
}

func TestCreateProjectWithEmptyName(t *testing.T) {
	controller := GenerateProjectController()
	createArtist(controller)

	result := controller.CreateProject(1, dto.ProjectCreate{
		Name: "",
	})

	if result.Result != "EMPTY_NAME" {
		t.Fatalf("Expected 'EMPTY_NAME', got '%s'", result.Result)
		return
	}
	fmt.Println("Done!")
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

	if result.Result != "NOT_CREATED_DUPLICATE" {
		t.Fatalf("Duplicates on projects shouldn't exist. Expected output 'NOT_CREATED_DUPLICATE', received '%s'", result.Result)
		return
	}
	fmt.Println("Done!")
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

	if result.Result != "OK" && project.Description.String == description {
		t.Fatalf("A project with description should be able to be created. Expected 'OK', received '%s'", result.Result)
		return
	}
	fmt.Println("Done!")
}

func TestCreateProjectWithEmptyDescription(t *testing.T) {
	controller := GenerateProjectController()
	createArtist(controller)

	description := ""

	result := controller.CreateProject(1, dto.ProjectCreate{
		Name:        "A project",
		Description: &description,
	})

	if result.Result != "INVALID_DESCRIPTION_LENGTH" {
		t.Fatalf("Expected 'INVALID_DESCRIPTION_LENGTH', got '%s'", result.Result)
		return
	}
	fmt.Println("Done!")
}

func TestGetWithUser(t *testing.T) {
	controller := GenerateProjectController()
	createArtist(controller)

	project := dto.ProjectCreate{
		Name: "A project",
	}

	controller.CreateProject(1, project)
	createdProject := controller.GetWithUserById(1)

	if createdProject == nil {
		t.Fatalf("Expected a project, got nil")
		return
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
		return
	}
	fmt.Println("Done!")
}

func TestMarkProjectDone(t *testing.T) {
	controller := GenerateProjectController()
	createArtist(controller)

	project := dto.ProjectCreate{
		Name: "A project",
	}

	controller.CreateProject(1, project)

	result := controller.MarkAsDone(1, 1)
	createdProject := controller.ProjectService.GetById(1)

	if result != "OK" && createdProject.EndedAt.Valid {
		t.Fatalf("Expected 'OK', got '%s'", result)
		return
	}
	fmt.Println("Done!")
}

func TestMarkAsDoneProjectMarkedAsDone(t *testing.T) {
	controller := GenerateProjectController()
	createArtist(controller)

	controller.CreateProject(1, dto.ProjectCreate{
		Name: "A project",
	})

	controller.MarkAsDone(1, 1)
	result := controller.MarkAsDone(1, 1)

	if result != "ALREADY_MARKED" {
		t.Fatalf("Expected 'ALREADY_MARKED', got '%s'", result)
		return
	}
	fmt.Println("Done!")
}

func TestMarkedAsDoneNoExistingProject(t *testing.T) {
	controller := GenerateProjectController()
	createArtist(controller)

	result := controller.MarkAsDone(1, 1)

	if result != "PROJECT_NOT_FOUND" {
		t.Fatalf("Expected 'PROJECT_NOT_FOUND', got '%s'", result)
		return
	}
	fmt.Println("Done!")
}

func TestMarkedAsDoneWithNotExistingUser(t *testing.T) {
	controller := GenerateProjectController()
	createArtist(controller)

	controller.CreateProject(1, dto.ProjectCreate{
		Name: "A project",
	})

	result := controller.MarkAsDone(2, 1)

	if result != "USER_NOT_FOUND" {
		t.Fatalf("Expected 'USER_NOT_FOUND', got '%s'", result)
		return
	}
	fmt.Println("Done!")
}

func TestMarkedAsDoneWithNotOwner(t *testing.T) {
	controller := GenerateProjectController()
	createArtist(controller)

	newArtist := dto.UserRegister{
		Name:     "AnotherUser",
		Email:    "anotheruser@gmail.com",
		Password: "12345678",
	}

	controller.UserService.CreateUser(&newArtist, false)

	project := dto.ProjectCreate{
		Name: "ToyProject",
	}

	controller.CreateProject(1, project)

	result := controller.MarkAsDone(2, 1)

	if result != "NOT_PROJECT_OWNER" {
		t.Fatalf("Expected 'NOT_PROJECT_OWNER', got '%s'", result)
		return
	}
	fmt.Println("Done!")
}

func TestAddTaskToProject(t *testing.T) {
	controller := GenerateProjectController()
	createArtist(controller)

	controller.CreateProject(1, dto.ProjectCreate{
		Name: "A project",
	})

	result := controller.AddTask(1, 1, dto.TaskCreate{
		ActivityName: "Start",
	})

	project := controller.ProjectService.GetById(1)
	fmt.Printf("%d count\n", project.NumberOfTasks)

	if result != "OK" {
		t.Fatalf("Expected 'OK', got '%s'", result)
		return
	}
	fmt.Println("Done!")
}

func createArtist(controller *controllers.ProjectController) bool {
	return controller.UserService.CreateUser(&dto.UserRegister{
		Name:     "Example",
		Email:    "example@gmail.com",
		Password: "Str0ngP455!",
	}, false)
}

func TestAdd5TaskToProject(t *testing.T) {
	controller := GenerateProjectController()
	createArtist(controller)

	controller.CreateProject(1, dto.ProjectCreate{
		Name: "A project",
	})

	for i := 0; i < 5; i++ {
		controller.AddTask(1, 1, dto.TaskCreate{
			ActivityName: fmt.Sprintf("Task#%d", i+1),
		})
	}

	var count int64

	controller.TaskService.DBContext.Model(&models.Task{}).Where("project_id = ?", 1).Count(&count)
	project := controller.ProjectService.GetById(1)

	if count != 5 && project.NumberOfTasks != 5 {
		t.Fatalf("Expected 5 tasks, got %d items", count)
		return
	}
	fmt.Println("Done!")
}

func TestDeleteProject(t *testing.T) {
	controller := GenerateProjectController()
	createArtist(controller)

	controller.CreateProject(1, dto.ProjectCreate{
		Name: "A project",
	})

	tasks := []dto.TaskCreate{
		{
			ActivityName: "Task1",
		},
		{
			ActivityName: "Task2",
		},
		{
			ActivityName: "Task3",
		},
	}

	for i := 0; i < len(tasks); i++ {
		task := &tasks[i]
		controller.AddTask(1, 1, *task)
	}

	result := controller.DeleteProject(1)

	project := controller.ProjectService.GetById(1)

	if result != "OK" && project != nil {
		t.Fatalf("Exepected 'OK', got '%s'", result)
		return
	}

	fmt.Println("Done!")
}

func TestRecentTasksProject(t *testing.T) {
	controller := GenerateProjectController()
	createArtist(controller)

	controller.CreateProject(1, dto.ProjectCreate{
		Name: "A project",
	})

	tasks := []dto.TaskCreate{
		{
			ActivityName: "Task1",
		},
		{
			ActivityName: "Task2",
		},
		{
			ActivityName: "Task3",
		},
	}

	for i := 0; i < len(tasks); i++ {
		task := &tasks[i]
		controller.AddTask(1, 1, *task)
	}

	recentTasks := controller.TaskService.GetRecent(7)

	if len(recentTasks) != 5 {
		t.Fatalf("Exepected '5', got '%d'", len(recentTasks))
		return
	}

	fmt.Println("Done!")
}

func TestDeleteTaskFromProject(t *testing.T) {
	controller := GenerateProjectController()
	createArtist(controller)

	controller.CreateProject(1, dto.ProjectCreate{
		Name: "A project",
	})

	controller.AddTask(1, 1, dto.TaskCreate{
		ActivityName: "Test this thing...",
	})

}

func TestGetAllProjects(t *testing.T) {
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

	// Eliminar Project2
	controller.DeleteProject(2)

	results := controller.GetAllProjects()

	for i := 0; i < len(results); i++ {
		project := results[i]
		fmt.Printf("Project: %s\n", project.Name)
	}

	if len(results) != 3 {
		t.Fatalf("Expected %d entities, got %d entities instead", 3, len(results))
		return
	}
}
