package repositories

import (
	"truck-management/internal/models"

	"gorm.io/gorm"
)

type TruckRepository struct {
	db *gorm.DB
}

func NewTruckRepository(db *gorm.DB) *TruckRepository {
	return &TruckRepository{db: db}
}

func (r *TruckRepository) Create(truck *models.Truck) error {
	return r.db.Create(truck).Error
}

func (r *TruckRepository) GetByCompanyID(companyID uint, filter models.TruckFilter) ([]models.Truck, int64, error) {
	var trucks []models.Truck
	var total int64

	query := r.db.Where("company_id = ?", companyID).
		Preload("Driver").
		Preload("Branch").
		Preload("ApprovedByUser").
		Preload("LastLocation")

	// Apply filters
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}
	if filter.BranchID != nil {
		query = query.Where("branch_id = ?", *filter.BranchID)
	}
	if filter.DriverID != nil {
		query = query.Where("driver_id = ?", *filter.DriverID)
	}
	if filter.Model != "" {
		query = query.Where("model ILIKE ?", "%"+filter.Model+"%")
	}
	if filter.Online != nil && *filter.Online {
		query = query.Where("status IN ?", []models.TruckStatus{models.TruckStatusOnline, models.TruckStatusInUse})
	}
	if filter.Approved != nil {
		query = query.Where("is_approved = ?", *filter.Approved)
	}

	// Count total
	query.Model(&models.Truck{}).Count(&total)

	// Apply pagination
	offset := (filter.Page - 1) * filter.Limit
	err := query.Offset(offset).Limit(filter.Limit).Find(&trucks).Error

	return trucks, total, err
}

func (r *TruckRepository) GetByID(id uint, companyID uint) (*models.Truck, error) {
	var truck models.Truck
	err := r.db.Where("id = ? AND company_id = ?", id, companyID).
		Preload("Driver").
		Preload("Branch").
		Preload("ApprovedByUser").
		Preload("LastLocation").
		Preload("Company").
		First(&truck, id).Error
	return &truck, err
}

func (r *TruckRepository) Update(truck *models.Truck) error {
	return r.db.Save(truck).Error
}

func (r *TruckRepository) Delete(id uint, companyID uint) error {
	return r.db.Where("company_id = ?", companyID).Delete(&models.Truck{}, id).Error
}

func (r *TruckRepository) CreateLocation(location *models.TruckLocation) error {
	return r.db.Create(location).Error
}

func (r *TruckRepository) GetOnlineTrucks(companyID uint) ([]models.Truck, error) {
	var trucks []models.Truck
	err := r.db.Where("company_id = ? AND status IN ? AND is_approved = ?", companyID, 
		[]models.TruckStatus{models.TruckStatusOnline, models.TruckStatusInUse}).
		Preload("Driver").
		Preload("Branch").
		Preload("LastLocation").
		Find(&trucks).Error
	return trucks, err
}

func (r *TruckRepository) GetByDriverID(driverID uint, companyID uint) (*models.Truck, error) {
	var truck models.Truck
	err := r.db.Where("driver_id = ? AND company_id = ?", driverID, companyID).
		Preload("Driver").
		Preload("Branch").
		Preload("ApprovedByUser").
		Preload("LastLocation").
		Preload("Company").
		First(&truck).Error
	return &truck, err
}