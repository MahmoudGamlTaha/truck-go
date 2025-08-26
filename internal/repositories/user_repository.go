package repositories

import (
	"truck-management/internal/models"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *UserRepository) GetByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Preload("Company").Where("email = ?", email).First(&user).Error
	return &user, err
}

func (r *UserRepository) GetByID(id uint) (*models.User, error) {
	var user models.User
	err := r.db.Preload("Company").First(&user, id).Error
	return &user, err
}

func (r *UserRepository) GetByCompanyID(companyID uint) ([]models.User, error) {
	var users []models.User
	err := r.db.Where("company_id = ?", companyID).
		Preload("Branch").
		Preload("Truck").
		Find(&users).Error
	return users, err
}

func (r *UserRepository) Update(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *UserRepository) Delete(id uint, companyID uint) error {
	return r.db.Where("company_id = ?", companyID).Delete(&models.User{}, id).Error
}

func (r *UserRepository) GetDrivers(companyID uint) ([]models.User, error) {
	var users []models.User
	err := r.db.Where("company_id = ? AND role = ?", companyID, models.RoleDriver).
		Preload("Branch").
		Preload("Truck").
		Find(&users).Error
	return users, err
}