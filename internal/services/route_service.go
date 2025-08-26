package services

import (
	"time"
	"truck-management/internal/models"
	"truck-management/internal/repositories"
)

type RouteService struct {
	routeRepo *repositories.RouteRepository
	truckRepo *repositories.TruckRepository
}

func NewRouteService(routeRepo *repositories.RouteRepository, truckRepo *repositories.TruckRepository) *RouteService {
	return &RouteService{
		routeRepo: routeRepo,
		truckRepo: truckRepo,
	}
}

func (s *RouteService) CreateRoute(companyID uint, createdBy uint, req models.CreateRouteRequest) (*models.Route, error) {
	route := &models.Route{
		CompanyID:   companyID,
		BranchID:    req.BranchID,
		Name:        req.Name,
		Description: req.Description,
		Status:      models.RouteStatusDraft,
		StartTime:   req.StartTime,
		EndTime:     req.EndTime,
		CreatedBy:   createdBy,
	}

	err := s.routeRepo.Create(route)
	if err != nil {
		return nil, err
	}

	return s.routeRepo.GetByID(route.ID, companyID, nil)
}

func (s *RouteService) GetRoutes(companyID uint, filter models.RouteFilter, userRole models.UserRole, userID uint) ([]models.Route, int64, error) {
	var driverID *uint
	if userRole == models.RoleDriver {
		driverID = &userID
	}
	return s.routeRepo.GetByCompanyID(companyID, filter, driverID)
}

func (s *RouteService) GetRoute(id uint, companyID uint, userRole models.UserRole, userID uint) (*models.Route, error) {
	var driverID *uint
	if userRole == models.RoleDriver {
		driverID = &userID
	}
	return s.routeRepo.GetByID(id, companyID, driverID)
}

func (s *RouteService) UpdateRoute(id uint, companyID uint, req models.UpdateRouteRequest) (*models.Route, error) {
	route, err := s.routeRepo.GetByID(id, companyID, nil)
	if err != nil {
		return nil, err
	}

	if req.BranchID != nil {
		route.BranchID = req.BranchID
	}
	if req.TruckID != nil {
		route.TruckID = req.TruckID
	}
	if req.DriverID != nil {
		route.DriverID = req.DriverID
	}
	if req.Name != "" {
		route.Name = req.Name
	}
	if req.Description != "" {
		route.Description = req.Description
	}
	if req.Status != "" {
		route.Status = req.Status
	}
	if req.StartTime != nil {
		route.StartTime = req.StartTime
	}
	if req.EndTime != nil {
		route.EndTime = req.EndTime
	}

	err = s.routeRepo.Update(route)
	if err != nil {
		return nil, err
	}

	return s.routeRepo.GetByID(id, companyID, nil)
}

func (s *RouteService) ApproveRoute(id uint, companyID uint, approvedBy uint) (*models.Route, error) {
	route, err := s.routeRepo.GetByID(id, companyID, nil)
	if err != nil {
		return nil, err
	}

	route.Status = models.RouteStatusActive
	route.ApprovedBy = &approvedBy
	now := time.Now()
	route.ApprovedAt = &now

	err = s.routeRepo.Update(route)
	if err != nil {
		return nil, err
	}

	return s.routeRepo.GetByID(id, companyID, nil)
}

func (s *RouteService) DeleteRoute(id uint, companyID uint) error {
	return s.routeRepo.Delete(id, companyID)
}

func (s *RouteService) CreateRouteStop(routeID uint, companyID uint, req models.CreateRouteStopRequest) (*models.RouteStop, error) {
	// Verify route belongs to company
	_, err := s.routeRepo.GetByID(routeID, companyID, nil)
	if err != nil {
		return nil, err
	}

	stop := &models.RouteStop{
		RouteID:          routeID,
		StopOrder:        req.StopOrder,
		Address:          req.Address,
		Latitude:         req.Latitude,
		Longitude:        req.Longitude,
		ContactName:      req.ContactName,
		ContactPhone:     req.ContactPhone,
		Instructions:     req.Instructions,
		EstimatedArrival: req.EstimatedArrival,
	}

	err = s.routeRepo.CreateStop(stop)
	if err != nil {
		return nil, err
	}

	return stop, nil
}

func (s *RouteService) GetRouteStops(routeID uint, companyID uint) ([]models.RouteStop, error) {
	// Verify route belongs to company
	_, err := s.routeRepo.GetByID(routeID, companyID, nil)
	if err != nil {
		return nil, err
	}

	return s.routeRepo.GetStopsByRouteID(routeID)
}

func (s *RouteService) CompleteRouteStop(stopID uint, notes string) (*models.RouteStop, error) {
	// This would need additional validation to ensure the stop belongs to the user's route
	stop := &models.RouteStop{
		ID:          stopID,
		IsCompleted: true,
		Notes:       notes,
	}
	now := time.Now()
	stop.CompletedAt = &now
	stop.ActualArrival = &now

	err := s.routeRepo.UpdateStop(stop)
	if err != nil {
		return nil, err
	}

	return stop, nil
}