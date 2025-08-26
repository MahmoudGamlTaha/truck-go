package services

import (
	"truck-management/internal/models"
	"truck-management/internal/repositories"
)

type BranchService struct {
	branchRepo *repositories.BranchRepository
}

func NewBranchService(branchRepo *repositories.BranchRepository) *BranchService {
	return &BranchService{branchRepo: branchRepo}
}

func (s *BranchService) CreateBranch(companyID uint, req models.CreateBranchRequest) (*models.Branch, error) {
	branch := &models.Branch{
		CompanyID: companyID,
		Name:      req.Name,
		Address:   req.Address,
		Phone:     req.Phone,
		Email:     req.Email,
		ManagerID: req.ManagerID,
	}

	err := s.branchRepo.Create(branch)
	if err != nil {
		return nil, err
	}

	return s.branchRepo.GetByID(branch.ID, companyID)
}

func (s *BranchService) GetBranches(companyID uint) ([]models.Branch, error) {
	return s.branchRepo.GetByCompanyID(companyID)
}

func (s *BranchService) GetBranch(id uint, companyID uint) (*models.Branch, error) {
	return s.branchRepo.GetByID(id, companyID)
}

func (s *BranchService) UpdateBranch(id uint, companyID uint, req models.UpdateBranchRequest) (*models.Branch, error) {
	branch, err := s.branchRepo.GetByID(id, companyID)
	if err != nil {
		return nil, err
	}

	if req.Name != "" {
		branch.Name = req.Name
	}
	if req.Address != "" {
		branch.Address = req.Address
	}
	if req.Phone != "" {
		branch.Phone = req.Phone
	}
	if req.Email != "" {
		branch.Email = req.Email
	}
	if req.ManagerID != nil {
		branch.ManagerID = req.ManagerID
	}
	branch.IsActive = req.IsActive

	err = s.branchRepo.Update(branch)
	if err != nil {
		return nil, err
	}

	return s.branchRepo.GetByID(id, companyID)
}

func (s *BranchService) DeleteBranch(id uint, companyID uint) error {
	return s.branchRepo.Delete(id, companyID)
}