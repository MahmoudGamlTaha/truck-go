package models

import (
	"time"

	"gorm.io/gorm"
)

type UserRole string

const (
	RoleAdmin    UserRole = "admin"
	RoleAssignee UserRole = "assignee"
	RoleDriver   UserRole = "driver"
	RoleDraft    UserRole = "draft"
)

type User struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Email     string         `json:"email" gorm:"uniqueIndex;not null"`
	Password  string         `json:"-" gorm:"not null"`
	FirstName string         `json:"first_name" gorm:"not null"`
	LastName  string         `json:"last_name" gorm:"not null"`
	Role      UserRole       `json:"role" gorm:"default:'user'"`
	CompanyID *uint          `json:"company_id"`
	Company   *Company       `json:"company,omitempty"`
	BranchID  *uint          `json:"branch_id"`
	Branch    *Branch        `json:"branch,omitempty"`
	TruckID   *uint          `json:"truck_id"` // For drivers assigned to specific truck
	Truck     *Truck         `json:"truck,omitempty"`
	IsActive  bool           `json:"is_active" gorm:"default:true"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

type RegisterRequest struct {
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=6"`
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name" binding:"required"`
	CompanyID *uint  `json:"company_id"`
	BranchID  *uint  `json:"branch_id"`
}

type CreateUserRequest struct {
	Email     string   `json:"email" binding:"required,email"`
	Password  string   `json:"password" binding:"required,min=6"`
	FirstName string   `json:"first_name" binding:"required"`
	LastName  string   `json:"last_name" binding:"required"`
	Role      UserRole `json:"role" binding:"required"`
	BranchID  *uint    `json:"branch_id"`
	TruckID   *uint    `json:"truck_id"`
}

type UpdateUserRequest struct {
	FirstName string   `json:"first_name"`
	LastName  string   `json:"last_name"`
	Role      UserRole `json:"role"`
	BranchID  *uint    `json:"branch_id"`
	TruckID   *uint    `json:"truck_id"`
	IsActive  bool     `json:"is_active"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}
