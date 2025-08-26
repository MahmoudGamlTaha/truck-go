package repositories

import (
	"truck-management/internal/models"

	"gorm.io/gorm"
)

type CompanyRepository struct {
	db *gorm.DB
}

func NewCompanyRepository(db *gorm.DB) *CompanyRepository {
	return &CompanyRepository{db: db}
}

func (r *CompanyRepository) Create(company *models.Company) error {
	return r.db.Create(company).Error
}

func (r *CompanyRepository) GetAll() ([]models.Company, error) {
	var companies []models.Company
	err := r.db.Preload("Users").Preload("Trucks").Find(&companies).Error
	return companies, err
}

func (r *CompanyRepository) GetByID(id uint) (*models.Company, error) {
	var company models.Company
	err := r.db.Preload("Users").Preload("Trucks").First(&company, id).Error
	return &company, err
}

func (r *CompanyRepository) Update(company *models.Company) error {
	return r.db.Save(company).Error
}

func (r *CompanyRepository) Delete(id uint) error {
	return r.db.Delete(&models.Company{}, id).Error
}