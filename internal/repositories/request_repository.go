package repositories

import (
	"truck-management/internal/models"

	"gorm.io/gorm"
)

type RequestRepository struct {
	db *gorm.DB
}

func NewRequestRepository(db *gorm.DB) *RequestRepository {
	return &RequestRepository{db: db}
}

func (r *RequestRepository) Create(request *models.Request) error {
	return r.db.Create(request).Error
}

func (r *RequestRepository) GetByCompanyID(companyID uint) ([]models.Request, error) {
	var requests []models.Request
	err := r.db.Where("company_id = ?", companyID).
		Preload("User").
		Preload("Truck").
		Preload("AcceptedByUser").
		Preload("TerminatedByUser").
		Find(&requests).Error
	return requests, err
}

func (r *RequestRepository) GetByID(id uint, companyID uint) (*models.Request, error) {
	var request models.Request
	err := r.db.Where("id = ? AND company_id = ?", id, companyID).
		Preload("User").
		Preload("Truck").
		Preload("AcceptedByUser").
		Preload("TerminatedByUser").
		First(&request).Error
	return &request, err
}

func (r *RequestRepository) Update(request *models.Request) error {
	return r.db.Save(request).Error
}