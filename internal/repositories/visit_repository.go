package repositories

import (
	"truck-management/internal/models"

	"gorm.io/gorm"
)

type VisitRepository struct {
	db *gorm.DB
}

func NewVisitRepository(db *gorm.DB) *VisitRepository {
	return &VisitRepository{db: db}
}

func (r *VisitRepository) Create(visit *models.Visit) error {
	return r.db.Create(visit).Error
}

func (r *VisitRepository) GetByCompanyID(companyID uint) ([]models.Visit, error) {
	var visits []models.Visit
	err := r.db.Where("company_id = ?", companyID).
		Preload("Truck").
		Preload("Driver").
		Preload("Tasks").
		Find(&visits).Error
	return visits, err
}

func (r *VisitRepository) GetByID(id uint, companyID uint) (*models.Visit, error) {
	var visit models.Visit
	err := r.db.Where("id = ? AND company_id = ?", id, companyID).
		Preload("Truck").
		Preload("Driver").
		Preload("Tasks").
		First(&visit).Error
	return &visit, err
}

func (r *VisitRepository) Update(visit *models.Visit) error {
	return r.db.Save(visit).Error
}