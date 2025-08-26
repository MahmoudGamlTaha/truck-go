package repositories

import (
	"truck-management/internal/models"

	"gorm.io/gorm"
)

type BranchRepository struct {
	db *gorm.DB
}

func NewBranchRepository(db *gorm.DB) *BranchRepository {
	return &BranchRepository{db: db}
}

func (r *BranchRepository) Create(branch *models.Branch) error {
	return r.db.Create(branch).Error
}

func (r *BranchRepository) GetByCompanyID(companyID uint) ([]models.Branch, error) {
	var branches []models.Branch
	err := r.db.Where("company_id = ?", companyID).
		Preload("Manager").
		Preload("Users").
		Preload("Trucks").
		Find(&branches).Error
	return branches, err
}

func (r *BranchRepository) GetByID(id uint, companyID uint) (*models.Branch, error) {
	var branch models.Branch
	err := r.db.Where("id = ? AND company_id = ?", id, companyID).
		Preload("Manager").
		Preload("Users").
		Preload("Trucks").
		First(&branch).Error
	return &branch, err
}

func (r *BranchRepository) Update(branch *models.Branch) error {
	return r.db.Save(branch).Error
}

func (r *BranchRepository) Delete(id uint, companyID uint) error {
	return r.db.Where("company_id = ?", companyID).Delete(&models.Branch{}, id).Error
}