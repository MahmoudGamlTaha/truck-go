package repositories

import (
	"fmt"
	"truck-management/internal/models"

	"gorm.io/gorm"
)

type CargoRepository struct {
	db *gorm.DB
}

func NewCargoRepository(db *gorm.DB) *CargoRepository {
	return &CargoRepository{db: db}
}

func (r *CargoRepository) Create(cargo *models.Cargo) error {
	return r.db.Create(cargo).Error
}

func (r *CargoRepository) GetByCompanyID(companyID uint, filter models.CargoFilter) ([]models.Cargo, int64, error) {
	var cargos []models.Cargo
	var total int64

	query := r.db.Where("company_id = ?", companyID).
		Preload("Truck").
		Preload("AssignedByUser").
		Preload("Company")

	// Apply filters
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}
	if filter.Type != "" {
		query = query.Where("type = ?", filter.Type)
	}
	if filter.Priority != "" {
		query = query.Where("priority = ?", filter.Priority)
	}
	if filter.TruckID != nil {
		query = query.Where("truck_id = ?", *filter.TruckID)
	}
	if filter.Assigned != nil {
		if *filter.Assigned {
			query = query.Where("truck_id IS NOT NULL")
		} else {
			query = query.Where("truck_id IS NULL")
		}
	}
	if filter.Search != "" {
		searchTerm := "%" + filter.Search + "%"
		query = query.Where("title ILIKE ? OR tracking_number ILIKE ? OR description ILIKE ?", 
			searchTerm, searchTerm, searchTerm)
	}

	// Count total
	query.Model(&models.Cargo{}).Count(&total)

	// Apply pagination
	offset := (filter.Page - 1) * filter.Limit
	err := query.Offset(offset).Limit(filter.Limit).Order("created_at DESC").Find(&cargos).Error

	return cargos, total, err
}

func (r *CargoRepository) GetByID(id uint, companyID uint) (*models.Cargo, error) {
	var cargo models.Cargo
	err := r.db.Where("id = ? AND company_id = ?", id, companyID).
		Preload("Truck").
		Preload("Truck.Driver").
		Preload("AssignedByUser").
		Preload("Company").
		Preload("CargoEvents").
		Preload("CargoEvents.User").
		First(&cargo).Error
	return &cargo, err
}

func (r *CargoRepository) GetByTrackingNumber(trackingNumber string) (*models.Cargo, error) {
	var cargo models.Cargo
	err := r.db.Where("tracking_number = ?", trackingNumber).
		Preload("Truck").
		Preload("Truck.Driver").
		Preload("AssignedByUser").
		Preload("Company").
		Preload("CargoEvents").
		Preload("CargoEvents.User").
		First(&cargo).Error
	return &cargo, err
}

func (r *CargoRepository) Update(cargo *models.Cargo) error {
	return r.db.Save(cargo).Error
}

func (r *CargoRepository) Delete(id uint, companyID uint) error {
	return r.db.Where("company_id = ?", companyID).Delete(&models.Cargo{}, id).Error
}

func (r *CargoRepository) GetByTruckID(truckID uint, companyID uint) ([]models.Cargo, error) {
	var cargos []models.Cargo
	err := r.db.Where("truck_id = ? AND company_id = ?", truckID, companyID).
		Preload("AssignedByUser").
		Find(&cargos).Error
	return cargos, err
}

func (r *CargoRepository) CreateEvent(event *models.CargoEvent) error {
	return r.db.Create(event).Error
}

func (r *CargoRepository) GetEventsByCargoID(cargoID uint) ([]models.CargoEvent, error) {
	var events []models.CargoEvent
	err := r.db.Where("cargo_id = ?", cargoID).
		Preload("User").
		Order("timestamp DESC").
		Find(&events).Error
	return events, err
}

func (r *CargoRepository) GenerateTrackingNumber(companyID uint) (string, error) {
	var count int64
	r.db.Model(&models.Cargo{}).Where("company_id = ?", companyID).Count(&count)
	return fmt.Sprintf("TRK%d%06d", companyID, count+1), nil
}

func (r *CargoRepository) GetUnassignedCargos(companyID uint) ([]models.Cargo, error) {
	var cargos []models.Cargo
	err := r.db.Where("company_id = ? AND truck_id IS NULL AND status = ?", 
		companyID, models.CargoStatusPending).
		Order("priority DESC, created_at ASC").
		Find(&cargos).Error
	return cargos, err
}

func (r *CargoRepository) GetCargoWithLocationHistory(id uint, companyID uint) (*models.Cargo, error) {
	var cargo models.Cargo
	err := r.db.Where("id = ? AND company_id = ?", id, companyID).
		Preload("Truck").
		Preload("Truck.Driver").
		Preload("Truck.LastLocation").
		Preload("AssignedByUser").
		Preload("Company").
		Preload("CargoEvents", "latitude IS NOT NULL AND longitude IS NOT NULL").
		Preload("CargoEvents.User").
		First(&cargo).Error
	return &cargo, err
}

func (r *CargoRepository) GetCargoInTransit(companyID uint) ([]models.Cargo, error) {
	var cargos []models.Cargo
	err := r.db.Where("company_id = ? AND status = ?", companyID, models.CargoStatusInTransit).
		Preload("Truck").
		Preload("Truck.LastLocation").
		Find(&cargos).Error
	return cargos, err
}