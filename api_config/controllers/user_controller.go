package controllers

import (
	"ArtistManager/api_config/models/dto"
	"ArtistManager/api_config/services"
)

type UserController struct {
	UserService *services.UserService
}

func (controller *UserController) CreateAdmin(userRegister *dto.UserRegister) bool {
	return controller.UserService.CreateUser(userRegister, true)
}

func (controller *UserController) GetUser(userId uint) *dto.UserDtoOut {
	user := controller.UserService.GetById(userId)

	if user == nil {
		return nil
	}

	userOut := controller.UserService.CreateDtoOut(user)

	return &userOut
}
