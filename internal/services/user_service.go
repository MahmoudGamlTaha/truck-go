package services

import (
	"errors"
	"truck-management/internal/models"
	"truck-management/internal/repositories"
	"truck-management/internal/utils"
)

type UserService struct {
	userRepo *repositories.UserRepository
}

func NewUserService(userRepo *repositories.UserRepository) *UserService {
	return &UserService{userRepo: userRepo}
}

func (s *UserService) CreateUser(companyID uint, req models.CreateUserRequest) (*models.User, error) {
	// Check if user already exists
	_, err := s.userRepo.GetByEmail(req.Email)
	if err == nil {
		return nil, errors.New("user already exists")
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Email:     req.Email,
		Password:  hashedPassword,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Role:      req.Role,
		CompanyID: &companyID,
		BranchID:  req.BranchID,
		TruckID:   req.TruckID,
	}

	err = s.userRepo.Create(user)
	if err != nil {
		return nil, err
	}

	return s.userRepo.GetByID(user.ID)
}

func (s *UserService) GetUsers(companyID uint) ([]models.User, error) {
	return s.userRepo.GetByCompanyID(companyID)
}

func (s *UserService) GetUser(id uint, companyID uint) (*models.User, error) {
	user, err := s.userRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Verify user belongs to company
	if user.CompanyID == nil || *user.CompanyID != companyID {
		return nil, errors.New("user not found")
	}

	return user, nil
}

func (s *UserService) UpdateUser(id uint, companyID uint, req models.UpdateUserRequest) (*models.User, error) {
	user, err := s.GetUser(id, companyID)
	if err != nil {
		return nil, err
	}

	if req.FirstName != "" {
		user.FirstName = req.FirstName
	}
	if req.LastName != "" {
		user.LastName = req.LastName
	}
	if req.Role != "" {
		user.Role = req.Role
	}
	if req.BranchID != nil {
		user.BranchID = req.BranchID
	}
	if req.TruckID != nil {
		user.TruckID = req.TruckID
	}
	user.IsActive = req.IsActive

	err = s.userRepo.Update(user)
	if err != nil {
		return nil, err
	}

	return s.userRepo.GetByID(id)
}

func (s *UserService) DeleteUser(id uint, companyID uint) error {
	// Verify user belongs to company
	_, err := s.GetUser(id, companyID)
	if err != nil {
		return err
	}

	return s.userRepo.Delete(id, companyID)
}

func (s *UserService) GetDrivers(companyID uint) ([]models.User, error) {
	return s.userRepo.GetDrivers(companyID)
}

func (s *UserService) AssignTruckToDriver(driverID uint, truckID uint, companyID uint) error {
	user, err := s.GetUser(driverID, companyID)
	if err != nil {
		return err
	}

	if user.Role != models.RoleDriver {
		return errors.New("user is not a driver")
	}

	user.TruckID = &truckID
	return s.userRepo.Update(user)
}