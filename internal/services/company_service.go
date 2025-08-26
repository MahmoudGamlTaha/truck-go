package services

import (
	"truck-management/internal/models"
	"truck-management/internal/repositories"
)

type CompanyService struct {
	companyRepo *repositories.CompanyRepository
}

func NewCompanyService(companyRepo *repositories.CompanyRepository) *CompanyService {
	return &CompanyService{companyRepo: companyRepo}
}

func (s *CompanyService) CreateCompany(req models.CreateCompanyRequest) (*models.Company, error) {
	company := &models.Company{
		Name:    req.Name,
		Address: req.Address,
		Phone:   req.Phone,
		Email:   req.Email,
		License: req.License,
	}

	err := s.companyRepo.Create(company)
	if err != nil {
		return nil, err
	}

	return s.companyRepo.GetByID(company.ID)
}

func (s *CompanyService) GetCompanies() ([]models.Company, error) {
	return s.companyRepo.GetAll()
}

func (s *CompanyService) GetCompany(id uint) (*models.Company, error) {
	return s.companyRepo.GetByID(id)
}

func (s *CompanyService) UpdateCompany(id uint, req models.UpdateCompanyRequest) (*models.Company, error) {
	company, err := s.companyRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	if req.Name != "" {
		company.Name = req.Name
	}
	if req.Address != "" {
		company.Address = req.Address
	}
	if req.Phone != "" {
		company.Phone = req.Phone
	}
	if req.Email != "" {
		company.Email = req.Email
	}
	if req.License != "" {
		company.License = req.License
	}

	err = s.companyRepo.Update(company)
	if err != nil {
		return nil, err
	}

	return s.companyRepo.GetByID(id)
}

func (s *CompanyService) DeleteCompany(id uint) error {
	return s.companyRepo.Delete(id)
}