package repositories

import (
	"truck-management/internal/models"

	"gorm.io/gorm"
)

type RouteRepository struct {
	db *gorm.DB
}

func NewRouteRepository(db *gorm.DB) *RouteRepository {
	return &RouteRepository{db: db}
}

func (r *RouteRepository) Create(route *models.Route) error {
	return r.db.Create(route).Error
}

func (r *RouteRepository) GetByCompanyID(companyID uint, filter models.RouteFilter, driverID *uint) ([]models.Route, int64, error) {
	var routes []models.Route
	var total int64

	query := r.db.Where("company_id = ?", companyID).
		Preload("Branch").
		Preload("Truck").
		Preload("Driver").
		Preload("CreatedByUser").
		Preload("ApprovedByUser").
		Preload("RouteStops")

	// Driver can only see their own routes
	if driverID != nil {
		query = query.Where("driver_id = ?", *driverID)
	}

	// Apply filters
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}
	if filter.TruckID != nil {
		query = query.Where("truck_id = ?", *filter.TruckID)
	}
	if filter.DriverID != nil {
		query = query.Where("driver_id = ?", *filter.DriverID)
	}
	if filter.BranchID != nil {
		query = query.Where("branch_id = ?", *filter.BranchID)
	}

	// Count total
	query.Model(&models.Route{}).Count(&total)

	// Apply pagination
	offset := (filter.Page - 1) * filter.Limit
	err := query.Offset(offset).Limit(filter.Limit).Order("created_at DESC").Find(&routes).Error

	return routes, total, err
}

func (r *RouteRepository) GetByID(id uint, companyID uint, driverID *uint) (*models.Route, error) {
	var route models.Route
	query := r.db.Where("id = ? AND company_id = ?", id, companyID)
	
	// Driver can only see their own routes
	if driverID != nil {
		query = query.Where("driver_id = ?", *driverID)
	}
	
	err := query.Preload("Branch").
		Preload("Truck").
		Preload("Driver").
		Preload("CreatedByUser").
		Preload("ApprovedByUser").
		Preload("RouteStops").
		First(&route).Error
	return &route, err
}

func (r *RouteRepository) Update(route *models.Route) error {
	return r.db.Save(route).Error
}

func (r *RouteRepository) Delete(id uint, companyID uint) error {
	return r.db.Where("company_id = ?", companyID).Delete(&models.Route{}, id).Error
}

func (r *RouteRepository) CreateStop(stop *models.RouteStop) error {
	return r.db.Create(stop).Error
}

func (r *RouteRepository) GetStopsByRouteID(routeID uint) ([]models.RouteStop, error) {
	var stops []models.RouteStop
	err := r.db.Where("route_id = ?", routeID).Order("stop_order ASC").Find(&stops).Error
	return stops, err
}

func (r *RouteRepository) UpdateStop(stop *models.RouteStop) error {
	return r.db.Save(stop).Error
}

func (r *RouteRepository) DeleteStop(id uint) error {
	return r.db.Delete(&models.RouteStop{}, id).Error
}