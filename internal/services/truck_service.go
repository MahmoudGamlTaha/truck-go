package services

import (
	"time"
	"truck-management/internal/models"
	"truck-management/internal/repositories"
)

type TruckService struct {
	truckRepo *repositories.TruckRepository
}

func NewTruckService(truckRepo *repositories.TruckRepository) *TruckService {
	return &TruckService{truckRepo: truckRepo}
}

func (s *TruckService) CreateTruck(companyID uint, req models.CreateTruckRequest) (*models.Truck, error) {
	truck := &models.Truck{
		CompanyID:    companyID,
		BranchID:     req.BranchID,
		LicensePlate: req.LicensePlate,
		Model:        req.Model,
		Year:         req.Year,
		Color:        req.Color,
		DriverID:     req.DriverID,
		Status:       models.TruckStatusOffline,
		IsApproved:   false,
	}

	err := s.truckRepo.Create(truck)
	if err != nil {
		return nil, err
	}

	return s.truckRepo.GetByID(truck.ID, companyID)
}

func (s *TruckService) GetTrucks(companyID uint, filter models.TruckFilter) ([]models.Truck, int64, error) {
	return s.truckRepo.GetByCompanyID(companyID, filter)
}

func (s *TruckService) GetTruck(id uint, companyID uint) (*models.Truck, error) {
	return s.truckRepo.GetByID(id, companyID)
}

func (s *TruckService) UpdateTruck(id uint, companyID uint, req models.UpdateTruckRequest) (*models.Truck, error) {
	truck, err := s.truckRepo.GetByID(id, companyID)
	if err != nil {
		return nil, err
	}

	if req.BranchID != nil {
		truck.BranchID = req.BranchID
	}
	if req.LicensePlate != "" {
		truck.LicensePlate = req.LicensePlate
	}
	if req.Model != "" {
		truck.Model = req.Model
	}
	if req.Year != 0 {
		truck.Year = req.Year
	}
	if req.Color != "" {
		truck.Color = req.Color
	}
	if req.Status != "" {
		truck.Status = req.Status
	}
	if req.DriverID != nil {
		truck.DriverID = req.DriverID
	}
	truck.IsApproved = req.IsApproved

	err = s.truckRepo.Update(truck)
	if err != nil {
		return nil, err
	}

	return s.truckRepo.GetByID(id, companyID)
}

func (s *TruckService) DeleteTruck(id uint, companyID uint) error {
	return s.truckRepo.Delete(id, companyID)
}

func (s *TruckService) UpdateTruckLocation(truckID uint, companyID uint, req models.LocationUpdateRequest) error {
	// Verify truck belongs to company
	truck, err := s.truckRepo.GetByID(truckID, companyID)
	if err != nil {
		return err
	}

	// Create location record
	location := &models.TruckLocation{
		TruckID:   truck.ID,
		Latitude:  req.Latitude,
		Longitude: req.Longitude,
		Speed:     req.Speed,
		Heading:   req.Heading,
		Timestamp: time.Now(),
	}

	err = s.truckRepo.CreateLocation(location)
	if err != nil {
		return err
	}

	// Update truck status to online if it was offline
	if truck.Status == models.TruckStatusOffline {
		truck.Status = models.TruckStatusOnline
		return s.truckRepo.Update(truck)
	}

	return nil
}

func (s *TruckService) GetOnlineTrucks(companyID uint) ([]models.Truck, error) {
	return s.truckRepo.GetOnlineTrucks(companyID)
}

func (s *TruckService) ApproveTruck(id uint, companyID uint, approvedBy uint) (*models.Truck, error) {
	truck, err := s.truckRepo.GetByID(id, companyID)
	if err != nil {
		return nil, err
	}

	truck.IsApproved = true
	truck.ApprovedBy = &approvedBy
	now := time.Now()
	truck.ApprovedAt = &now

	err = s.truckRepo.Update(truck)
	if err != nil {
		return nil, err
	}

	return s.truckRepo.GetByID(id, companyID)
}

func (s *TruckService) GetDriverTruck(driverID uint, companyID uint) (*models.Truck, error) {
	return s.truckRepo.GetByDriverID(driverID, companyID)
}