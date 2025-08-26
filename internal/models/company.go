package models

import (
	"time"

	"gorm.io/gorm"
)

type Company struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Name        string         `json:"name" gorm:"not null"`
	Address     string         `json:"address"`
	Phone       string         `json:"phone"`
	Email       string         `json:"email"`
	License     string         `json:"license" gorm:"uniqueIndex"`
	IsActive    bool           `json:"is_active" gorm:"default:true"`
	Users       []User         `json:"users,omitempty"`
	Trucks      []Truck        `json:"trucks,omitempty"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

type CreateCompanyRequest struct {
	Name    string `json:"name" binding:"required"`
	Address string `json:"address"`
	Phone   string `json:"phone"`
	Email   string `json:"email" binding:"email"`
	License string `json:"license" binding:"required"`
}

type UpdateCompanyRequest struct {
	Name    string `json:"name"`
	Address string `json:"address"`
	Phone   string `json:"phone"`
	Email   string `json:"email" binding:"omitempty,email"`
	License string `json:"license"`
}