package services

import (
	"time"
	"truck-management/internal/models"
	"truck-management/internal/repositories"
)

type VisitService struct {
	visitRepo *repositories.VisitRepository
}

func NewVisitService(visitRepo *repositories.VisitRepository) *VisitService {
	return &VisitService{visitRepo: visitRepo}
}

func (s *VisitService) CreateVisit(companyID uint, req models.CreateVisitRequest) (*models.Visit, error) {
	visit := &models.Visit{
		CompanyID:    companyID,
		TruckID:      req.TruckID,
		DriverID:     req.DriverID,
		CustomerName: req.CustomerName,
		Address:      req.Address,
		Latitude:     req.Latitude,
		Longitude:    req.Longitude,
		Notes:        req.Notes,
		Status:       models.VisitStatusPending,
	}

	err := s.visitRepo.Create(visit)
	if err != nil {
		return nil, err
	}

	return s.visitRepo.GetByID(visit.ID, companyID)
}

func (s *VisitService) GetVisits(companyID uint) ([]models.Visit, error) {
	return s.visitRepo.GetByCompanyID(companyID)
}

func (s *VisitService) GetVisit(id uint, companyID uint) (*models.Visit, error) {
	return s.visitRepo.GetByID(id, companyID)
}

func (s *VisitService) UpdateVisit(id uint, companyID uint, status models.VisitStatus) (*models.Visit, error) {
	visit, err := s.visitRepo.GetByID(id, companyID)
	if err != nil {
		return nil, err
	}

	visit.Status = status
	if status == models.VisitStatusInProgress && visit.StartTime == nil {
		now := time.Now()
		visit.StartTime = &now
	}
	if status == models.VisitStatusCompleted && visit.EndTime == nil {
		now := time.Now()
		visit.EndTime = &now
	}

	err = s.visitRepo.Update(visit)
	if err != nil {
		return nil, err
	}

	return s.visitRepo.GetByID(id, companyID)
}