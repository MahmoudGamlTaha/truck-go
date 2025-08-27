package services

import (
	"errors"
	"truck-management/internal/models"
	"truck-management/internal/repositories"
	"truck-management/internal/utils"

	"gorm.io/gorm"
)

type AuthService struct {
	userRepo *repositories.UserRepository
}

func NewAuthService(userRepo *repositories.UserRepository) *AuthService {
	return &AuthService{userRepo: userRepo}
}

func (s *AuthService) Register(req models.RegisterRequest) (*models.User, error) {
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
		CompanyID: req.CompanyID,
		Role:      models.UserRole("visitor"),
	}

	err = s.userRepo.Create(user)
	if err != nil {
		return nil, err
	}

	// Get user with company info
	return s.userRepo.GetByID(user.ID)
}

func (s *AuthService) Login(req models.LoginRequest) (*models.LoginResponse, error) {
	user, err := s.userRepo.GetByEmail(req.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("invalid credentials")
		}
		return nil, err
	}

	if !user.IsActive {
		return nil, errors.New("account is deactivated")
	}

	err = utils.CheckPassword(req.Password, user.Password)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	token, err := utils.GenerateJWT(*user)
	if err != nil {
		return nil, err
	}

	return &models.LoginResponse{
		Token: token,
		User:  *user,
	}, nil
}
