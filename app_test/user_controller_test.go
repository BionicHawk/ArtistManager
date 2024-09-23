package app_test

import (
	"ArtistManager/api_config/controllers"
	"ArtistManager/api_config/models/dto"
	"fmt"
	"testing"
)

func TestCreateAdmin(t *testing.T) {
	controller := GenerateUserController()
	result := createUser(controller, true)
	user := controller.GetUser(1)

	if result == false || user == nil {
		t.Fatalf("Couldn't create an Admin!\n")
		return
	}
	fmt.Println("Done!")
}

func TestCreateAdminDuplicate(t *testing.T) {
	controller := GenerateUserController()
	_ = createUser(controller, true)
	result := createUser(controller, true)

	if result == true {
		t.Fatalf("There should not be any duplicate")
		return
	}
	fmt.Println("Done!")
}

func TestGetExistingUser(t *testing.T) {
	controller := GenerateUserController()

	createUser(controller, false)

	result := controller.GetUser(1)

	if result == nil {
		t.Fatalf("No user found!")
		return
	}
	fmt.Println("Done!")
}

func TestGetNotExistingUser(t *testing.T) {
	controller := GenerateUserController()

	result := controller.GetUser(1)

	if result != nil {
		t.Fatalf("It should've gave nil")
		return
	}
	fmt.Println("Done!")
}

func TestLogin(t *testing.T) {
	controller := GenerateUserController()

	createUser(controller, false)

	result := controller.Login("example@gmail.com", "Str0ngP455!")

	if result == nil {
		t.Fatalf("It should be a successful login")
		return
	}
	fmt.Println("Done!")
}

func TestLoginNoUser(t *testing.T) {
	controller := GenerateUserController()

	result := controller.Login("example@gmail.com", "Str0ngP455!")

	if result != nil {
		t.Fatalf("It should've gave nil")
		return
	}
	fmt.Println("Done!")
}

func TestChangeEmail(t *testing.T) {
	newEmail := "example2@gmail.com"
	controller := GenerateUserController()

	createUser(controller, false)

	result := controller.ChangeEmail("example@gmail.com", newEmail)
	loginResult := controller.Login(newEmail, "Str0ngP455!")

	if result != "OK" || loginResult == nil {
		t.Fatalf("User should have this email '%s'", newEmail)
		return
	}
	fmt.Println("Done!")

}

func TestChangeEmailWithWrongEmailSource(t *testing.T) {
	oldEmail := "example1@gmail.com"
	newEmail := "example2@gmail.com"
	controller := GenerateUserController()

	createUser(controller, false)

	result := controller.ChangeEmail(oldEmail, newEmail)

	if result == "OK" {
		t.Fatalf("'%s' does not exist in the DB, but somehow it 'changed' an email to '%s'", oldEmail, newEmail)
		return
	}
	fmt.Println("Done!")
}

func TestChangeSameEmail(t *testing.T) {
	oldEmail := "example@gmail.com"
	controller := GenerateUserController()

	createUser(controller, false)

	result := controller.ChangeEmail(oldEmail, oldEmail)

	if result != "SAME_EMAIL" {
		t.Fatalf("The user with an email '%s' should have not changed due to be the same email", oldEmail)
		return
	}
	fmt.Println("Done!")
}

func TestChangePassword(t *testing.T) {
	newPassword := "N3wP455w0rd!"

	controller := GenerateUserController()
	createUser(controller, false)

	result := controller.ChangePassword(1, "Str0ngP455!", newPassword)

	if result != "OK" {
		t.Fatalf("Password '%s' should have been set. Output = '%s'", newPassword, result)
		return
	}
	fmt.Println("Done!")

}

func TestChangePassword2NotExistingUser(t *testing.T) {
	oldPassword := "Str0ngP455!"
	newPassword := "N3wP455w0rd!"

	controller := GenerateUserController()

	result := controller.ChangePassword(1, oldPassword, newPassword)

	if result != "USER_NOT_FOUND" {
		t.Fatalf("USER_NOT_FOUND expected as result, it gave '%s' instead", result)
		return
	}
	fmt.Println("Done!")
}

func TestChangePasswordWithWrongOldPassword(t *testing.T) {
	oldPassword := "Str0ngP455!w"
	newPassword := "N3wP455w0rd!"

	controller := GenerateUserController()
	createUser(controller, false)

	result := controller.ChangePassword(1, oldPassword, newPassword)

	if result != "OLD_PASSWORD_INVALID" {
		t.Fatalf("'OLD_PASSWORD_INVALID' expected, instead it returned '%s'", result)
		return
	}
	fmt.Println("Done!")
}

func TestChangePasswordWithSamePassword(t *testing.T) {
	oldPassword := "Str0ngP455!"

	controller := GenerateUserController()
	createUser(controller, false)

	result := controller.ChangePassword(1, oldPassword, oldPassword)

	if result != "SAME_PASSWORD_INVALID" {
		t.Fatalf("'SAME_PASSWORD_INVALID' expected as response, but received '%s' instead", result)
		return
	}
	fmt.Println("Done!")
}

func TestSearchUsers(t *testing.T) {
	controller := GenerateUserController()

	registers := []dto.UserRegister{
		{
			Name:     "Example1",
			Email:    "example@gmail.com",
			Password: "12345678",
		},
		{
			Name:     "Example2",
			Email:    "example1@gmail.com",
			Password: "12345678",
		},
		{
			Name:     "Example3",
			Email:    "example2@gmail.com",
			Password: "12345678",
		},
		{
			Name:     "Example4",
			Email:    "example3@gmail.com",
			Password: "12345678",
		},
	}

	for i := 0; i < len(registers); i++ {
		register := &registers[i]
		controller.CreateUser(register)
	}

	results := controller.SearchByName("Example")

	if len(results) != 4 {
		t.Fatalf("Results doesn't contain the expected number of entities. Expected %d, got %d", 4, len(results))
		return
	}
	fmt.Println("Done!")
}

func TestSearchUsersWithNoResults(t *testing.T) {
	controller := GenerateUserController()
	term := "Test"

	registers := []dto.UserRegister{
		{
			Name:     "Example1",
			Email:    "example@gmail.com",
			Password: "12345678",
		},
		{
			Name:     "Example2",
			Email:    "example1@gmail.com",
			Password: "12345678",
		},
		{
			Name:     "Example3",
			Email:    "example2@gmail.com",
			Password: "12345678",
		},
		{
			Name:     "Example4",
			Email:    "example3@gmail.com",
			Password: "12345678",
		},
	}

	for i := 0; i < len(registers); i++ {
		register := &registers[i]
		controller.CreateUser(register)
	}

	results := controller.SearchByName(term)

	if len(results) != 0 {
		t.Fatalf("A search with term '%s', should not retrieve any entity due to the database not containing any user with a name like it. Got %d entities", term, len(results))
		return
	}
	fmt.Println("Done!")

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
