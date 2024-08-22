package services

import (
	"ArtistManager/api_config/models"
	"ArtistManager/api_config/models/dto"
	"os"
	"path"

	"gorm.io/gorm"
)

type UserService struct {
	DBContext *gorm.DB
}

func (service *UserService) GetById(id uint) *models.User {
	var user *models.User
	service.DBContext.First(user, id)
	return user
}

func (service *UserService) CreateUser(userRegister *dto.UserRegister, admin bool) bool {
	var existingUser *models.User

	service.DBContext.First(&existingUser, "email = ?", userRegister.Email)

	if existingUser != nil {
		return false
	}

	var role string

	if admin {
		role = "ADMIN"
	} else {
		role = "ARTIST"
	}

	user := models.User{
		Name:  userRegister.Name,
		Email: userRegister.Email,
		Pwd:   userRegister.Password,
		Role:  role,
	}

	service.DBContext.Create(user)

	return true
}

func (service *UserService) UpdateProfilePicture(userId uint, file os.File) bool {
	var user *models.User

	name := file.Name()
	extension := path.Ext(name)

	service.DBContext.First(&user, userId)

	if user == nil {
		return false
	}

	if extension == ".png" || extension == ".jpg" || extension == ".webp" {
		data := []byte{}
		_, err := file.Read(data)

		if err != nil {
			return false
		}

		user.ProfilePic = &data

		service.DBContext.Update("profile_pic", &user)
		return true
	}

	return false
}
