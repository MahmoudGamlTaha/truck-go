package services

import (
	"time"
	"truck-management/internal/models"
	"truck-management/internal/repositories"
)

type RequestService struct {
	requestRepo *repositories.RequestRepository
}

func NewRequestService(requestRepo *repositories.RequestRepository) *RequestService {
	return &RequestService{requestRepo: requestRepo}
}

func (s *RequestService) CreateRequest(userID uint, companyID uint, req models.CreateRequestRequest) (*models.Request, error) {
	request := &models.Request{
		CompanyID:   companyID,
		UserID:      userID,
		TruckID:     req.TruckID,
		Type:        req.Type,
		Title:       req.Title,
		Description: req.Description,
		Status:      models.RequestStatusPending,
	}

	err := s.requestRepo.Create(request)
	if err != nil {
		return nil, err
	}

	return s.requestRepo.GetByID(request.ID, companyID)
}

func (s *RequestService) GetRequests(companyID uint) ([]models.Request, error) {
	return s.requestRepo.GetByCompanyID(companyID)
}

func (s *RequestService) AcceptRequest(id uint, companyID uint, moderatorID uint) (*models.Request, error) {
	request, err := s.requestRepo.GetByID(id, companyID)
	if err != nil {
		return nil, err
	}

	request.Status = models.RequestStatusAccepted
	request.AcceptedBy = &moderatorID
	now := time.Now()
	request.AcceptedAt = &now

	err = s.requestRepo.Update(request)
	if err != nil {
		return nil, err
	}

	return s.requestRepo.GetByID(id, companyID)
}

func (s *RequestService) TerminateRequest(id uint, companyID uint, moderatorID uint, reason string) (*models.Request, error) {
	request, err := s.requestRepo.GetByID(id, companyID)
	if err != nil {
		return nil, err
	}

	request.Status = models.RequestStatusTerminated
	request.TerminatedBy = &moderatorID
	request.TerminationReason = reason
	now := time.Now()
	request.TerminatedAt = &now

	err = s.requestRepo.Update(request)
	if err != nil {
		return nil, err
	}

	return s.requestRepo.GetByID(id, companyID)
}