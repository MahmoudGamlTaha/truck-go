package models

import (
	"time"

	"gorm.io/gorm"
)

type Branch struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	CompanyID uint           `json:"company_id" gorm:"not null"`
	Company   Company        `json:"company,omitempty"`
	Name      string         `json:"name" gorm:"not null"`
	Address   string         `json:"address"`
	Phone     string         `json:"phone"`
	Email     string         `json:"email"`
	ManagerID *uint          `json:"manager_id"`
	Manager   *User          `json:"manager,omitempty"`
	IsActive  bool           `json:"is_active" gorm:"default:true"`
	Users     []User         `json:"users,omitempty"`
	Trucks    []Truck        `json:"trucks,omitempty"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

type CreateBranchRequest struct {
	Name      string `json:"name" binding:"required"`
	Address   string `json:"address"`
	Phone     string `json:"phone"`
	Email     string `json:"email" binding:"omitempty,email"`
	ManagerID *uint  `json:"manager_id"`
}

type UpdateBranchRequest struct {
	Name      string `json:"name"`
	Address   string `json:"address"`
	Phone     string `json:"phone"`
	Email     string `json:"email" binding:"omitempty,email"`
	ManagerID *uint  `json:"manager_id"`
	IsActive  bool   `json:"is_active"`
}