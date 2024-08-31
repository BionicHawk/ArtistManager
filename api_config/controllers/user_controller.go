package controllers

import (
	"ArtistManager/api_config/models/dto"
	"ArtistManager/api_config/services"
	"os"
)

type UserController struct {
	UserService *services.UserService
}

func (controller *UserController) CreateAdmin(userRegister *dto.UserRegister) bool {
	return controller.UserService.CreateUser(userRegister, true)
}

func (controller *UserController) CreateUser(userRegister *dto.UserRegister) bool {
	return controller.UserService.CreateUser(userRegister, false)
}

func (controller *UserController) GetUser(userId uint) *dto.UserDtoOut {
	user := controller.UserService.GetById(userId)

	if user == nil {
		return nil
	}

	userOut := controller.UserService.CreateDtoOut(user)
	return &userOut
}

func (controller *UserController) Login(email string, password string) *dto.UserDtoOut {
	user := controller.UserService.GetByEmail(email)

	if user == nil {
		return nil
	}

	if user.Pwd != password {
		return nil
	}

	userOut := controller.UserService.CreateDtoOut(user)
	return &userOut
}

func (controller *UserController) ChangeEmail(oldEmail string, newEmail string) bool {
	userOldEmail := controller.UserService.GetByEmail(oldEmail)

	if userOldEmail == nil {
		return false
	}

	return controller.UserService.UpdateEmail(userOldEmail, newEmail)
}

func (controller *UserController) ChangePassword(userId uint, oldPassword string, newPassword string) string {
	user := controller.UserService.GetById(userId)

	if user == nil {
		return "USER_NOT_FOUND"
	}

	if user.Pwd != oldPassword {
		return "OLD_PASSWORD_INVALID"
	}

	return controller.UserService.UpdatePassword(user, newPassword)
}

func (controller *UserController) ChangeProfilePic(userId uint, image os.File) bool {
	return controller.UserService.UpdateProfilePicture(userId, image)
}
