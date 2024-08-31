package app_test

import (
	"ArtistManager/api_config/controllers"
	"ArtistManager/api_config/models"
	"ArtistManager/api_config/models/dto"
	"ArtistManager/api_config/services"
	"fmt"
	"os"
	"testing"
)

func generateUserController() *controllers.UserController {
	err := os.Remove("database.db3")

	if err != nil {
		fmt.Println("No database found!")
	}

	db := models.Init()

	userService := services.UserService{
		DBContext: db,
	}

	return &controllers.UserController{
		UserService: &userService,
	}
}

func TestCreateAdmin(t *testing.T) {
	controller := generateUserController()
	result := createUser(controller, true)

	if result == false {
		t.Fatalf("Couldn't create an Admin!\n")
	}
}

func TestCreateAdminDuplicate(t *testing.T) {
	controller := generateUserController()
	_ = createUser(controller, true)
	result := createUser(controller, true)

	if result == true {
		t.Fatalf("There should not be any duplicate")
	}
}

func TestGetExistingUser(t *testing.T) {
	controller := generateUserController()

	createUser(controller, false)

	result := controller.GetUser(1)

	if result == nil {
		t.Fatalf("No user found!")
	}
}

func TestGetNotExistingUser(t *testing.T) {
	controller := generateUserController()

	result := controller.GetUser(1)

	if result != nil {
		t.Fatalf("It should've gave nil")
	}
}

func TestLogin(t *testing.T) {
	controller := generateUserController()

	createUser(controller, false)

	result := controller.Login("example@gmail.com", "Str0ngP455!")

	if result == nil {
		t.Fatalf("It should be a successful login")
	}
}

func TestLoginNoUser(t *testing.T) {
	controller := generateUserController()

	result := controller.Login("example@gmail.com", "Str0ngP455!")

	if result != nil {
		t.Fatalf("It should've gave nil")
	}
}

func TestChangeEmail(t *testing.T) {
	newEmail := "example2@gmail.com"
	controller := generateUserController()

	createUser(controller, false)

	result := controller.ChangeEmail("example@gmail.com", newEmail)
	loginResult := controller.Login(newEmail, "Str0ngP455!")

	if result == false || loginResult == nil {
		t.Fatalf("User should have this email '%s'", newEmail)
	}

}

func TestChangeEmailWithWrongEmailSource(t *testing.T) {
	oldEmail := "example1@gmail.com"
	newEmail := "example2@gmail.com"
	controller := generateUserController()

	createUser(controller, false)

	result := controller.ChangeEmail(oldEmail, newEmail)

	if result == true {
		t.Fatalf("'%s' does not exist in the DB, but somehow it 'changed' an email to '%s'", oldEmail, newEmail)
	}
}

func TestChangeSameEmail(t *testing.T) {
	oldEmail := "example@gmail.com"
	controller := generateUserController()

	createUser(controller, false)

	result := controller.ChangeEmail(oldEmail, oldEmail)

	if result == true {
		t.Fatalf("The user with an email '%s' should have not changed due to be the same email", oldEmail)
	}
}

func TestChangePassword(t *testing.T) {
	newPassword := "N3wP455w0rd!"

	controller := generateUserController()
	createUser(controller, false)

	result := controller.ChangePassword(1, "Str0ngP455!", newPassword)

	if result != "OK" {
		t.Fatalf("Password '%s' should have been set", newPassword)
	}

}

func TestChangePassword2NotExistingUser(t *testing.T) {
	oldPassword := "Str0ngP455!"
	newPassword := "N3wP455w0rd!"

	controller := generateUserController()

	result := controller.ChangePassword(1, oldPassword, newPassword)

	if result != "USER_NOT_FOUND" {
		t.Fatalf("USER_NOT_FOUND expected as result, it gave '%s' instead", result)
	}
}

func TestChangePasswordWithWrongOldPassword(t *testing.T) {
	oldPassword := "Str0ngP455!w"
	newPassword := "N3wP455w0rd!"

	controller := generateUserController()
	createUser(controller, false)

	result := controller.ChangePassword(1, oldPassword, newPassword)

	if result != "OLD_PASSWORD_INVALID" {
		t.Fatalf("'OLD_PASSWORD_INVALID' expected, instead it returned '%s'", result)
	}
}

func createUser(controller *controllers.UserController, isAdmin bool) bool {
	if isAdmin {
		return controller.CreateAdmin(&dto.UserRegister{
			Name:     "Lorem Ipsum",
			Email:    "example@gmail.com",
			Password: "Str0ngP455!",
		})
	}

	return controller.CreateUser(&dto.UserRegister{
		Name:     "Lorem Ipsum",
		Email:    "example@gmail.com",
		Password: "Str0ngP455!",
	})
}
