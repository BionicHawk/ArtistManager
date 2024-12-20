package services

import (
	"ArtistManager/api_config/models"
	"ArtistManager/api_config/models/dto"
	"fmt"
	"time"

	"gorm.io/gorm"
)

type UserService struct {
	DBContext *gorm.DB
}

func (service *UserService) GetById(id uint) (user *models.User) {
	err := service.DBContext.First(&user, id).Error

	if err != nil {
		return nil
	}

	return user
}

func (service *UserService) GetRecentUsers(days uint) []models.User {
	var users []models.User

	var fromTime = time.Now().AddDate(0, 0, -int(days)).UTC()
	service.DBContext.Model(&models.User{}).Where("created_at >= ?", fromTime).Find(&users)

	return users
}

func (service *UserService) GetByEmail(emailValue string) (user *models.User) {
	err := service.DBContext.Raw(
		`SELECT * FROM USERS
		WHERE EMAIL = ?
		LIMIT 1`, emailValue).Scan(&user).Error
	// err := service.DBContext.First(&user, "email = ?", emailValue).Error

	if err != nil {
		return nil
	}

	return user
}

func (service *UserService) SearchUsersByNameTerm(name string) (users []models.User) {
	service.DBContext.Where("name LIKE ?", fmt.Sprintf("%%%s%%", name)).Find(&users)
	return users
}

func (service *UserService) CreateUser(userRegister *dto.UserRegister, admin bool) bool {
	// var existingUser *models.User

	var count int64
	service.DBContext.Raw("SELECT COUNT(*) FROM USERS WHERE EMAIL = ?", userRegister.Email).Scan(&count)
	// err := service.DBContext.First(&existingUser, "email = ?", userRegister.Email).Error

	if count > 0 {
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

	return service.DBContext.Create(&user).Error == nil
}

func (service *UserService) UpdateProfilePicture(userId uint, blob []byte) bool {
	var user *models.User

	service.DBContext.First(&user, userId)

	if user == nil {
		return false
	}

	errDb := service.DBContext.Model(&user).Update("profile_pic", blob).Error
	return errDb == nil
}

func (service *UserService) CreateDtoOut(user *models.User) dto.UserDtoOut {
	projectOuts := []dto.ProjectDtoOut{}
	projectsLength := len(user.Projects)

	for i := 0; i < projectsLength; i++ {
		project := user.Projects[i]

		taskOuts := []dto.TaskDtoOut{}
		taskLength := len(project.Tasks)

		for j := 0; j < taskLength; j++ {
			task := project.Tasks[j]
			taskOut := dto.TaskDtoOut{
				ID:           task.ID,
				ActivityName: task.ActivityName,
				Description:  task.Description,
				Status:       task.Status,
				CreatedAt:    task.CreatedAt,
				EndedAt:      &task.EndedAt.Time,
			}

			taskOuts = append(taskOuts, taskOut)
		}

		projectOut := dto.ProjectDtoOut{
			ID:          project.ID,
			Name:        project.Name,
			Description: &project.Description.String,
			Tasks:       taskOuts,
			CreatedAt:   project.CreatedAt,
			EndedAt:     &project.EndedAt.Time,
		}

		projectOuts = append(projectOuts, projectOut)
	}

	return dto.UserDtoOut{
		ID:         user.ID,
		Name:       user.Name,
		ProfilePic: user.ProfilePic,
		Email:      user.Email,
		Projects:   projectOuts,
		Role:       user.Role,
		CreatedAt:  user.CreatedAt,
		Active:     user.Active,
	}
}

func (service *UserService) UpdateEmail(user *models.User, newEmail string) string {
	otherUserWithSameEmail := service.GetByEmail(newEmail)

	if otherUserWithSameEmail != nil && otherUserWithSameEmail.ID != user.ID {
		return "EMAIL_USED"
	}

	err := service.DBContext.Model(&user).Update("email", newEmail).Error
	if err != nil {
		fmt.Println("Error updating email:", err)
		return "EMAIL_USED"
	}

	return "OK"
}

func (service *UserService) UpdatePassword(user *models.User, newPassword string) string {
	service.DBContext.Model(&user).Update("pwd", newPassword)
	return "OK"
}

func (service *UserService) GetAllUsers() (users []models.User) {
	service.DBContext.Where("active = 1").Find(&users)
	return users
}

func (service *UserService) UpdateRole(userId uint, newRole string) bool {
	var user *models.User

	service.DBContext.First(&user, userId)

	if user == nil {
		return false
	}

	if newRole != "ADMIN" && newRole != "ARTIST" {
		return false
	}

	errDb := service.DBContext.Model(&user).Update("role", newRole).Error
	return errDb == nil
}

func (service *UserService) ChangeName(userId uint, newName string) bool {
	var user *models.User

	service.DBContext.First(&user, userId)

	if user == nil {
		return false
	}

	errDb := service.DBContext.Model(&user).Update("name", newName).Error
	return errDb == nil
}

func (service *UserService) DeleteUser(userId uint) bool {
	var user *models.User

	service.DBContext.First(&user, userId)

	if user == nil {
		return false
	}

	service.DBContext.Model(&user).Update("active", 0)
	return true
}
