package models

import (
	"time"

	"gorm.io/gorm"
)

type TruckStatus string

const (
	TruckStatusOnline   TruckStatus = "online"
	TruckStatusOffline  TruckStatus = "offline"
	TruckStatusInUse    TruckStatus = "in_use"
	TruckStatusMaintenance TruckStatus = "maintenance"
)

type Truck struct {
	ID           uint            `json:"id" gorm:"primaryKey"`
	CompanyID    uint            `json:"company_id" gorm:"not null"`
	Company      Company         `json:"company,omitempty"`
	BranchID     *uint           `json:"branch_id"`
	Branch       *Branch         `json:"branch,omitempty"`
	LicensePlate string          `json:"license_plate" gorm:"uniqueIndex;not null"`
	Model        string          `json:"model" gorm:"not null"`
	Year         int             `json:"year"`
	Color        string          `json:"color"`
	Status       TruckStatus     `json:"status" gorm:"default:'offline'"`
	DriverID     *uint           `json:"driver_id"`
	Driver       *User           `json:"driver,omitempty"`
	IsApproved   bool            `json:"is_approved" gorm:"default:false"`
	ApprovedBy   *uint           `json:"approved_by"`
	ApprovedByUser *User         `json:"approved_by_user,omitempty"`
	ApprovedAt   *time.Time      `json:"approved_at"`
	LastLocation *TruckLocation  `json:"last_location,omitempty"`
	Locations    []TruckLocation `json:"locations,omitempty"`
	Visits       []Visit         `json:"visits,omitempty"`
	Routes       []Route         `json:"routes,omitempty"`
	IsActive     bool            `json:"is_active" gorm:"default:true"`
	CreatedAt    time.Time       `json:"created_at"`
	UpdatedAt    time.Time       `json:"updated_at"`
	DeletedAt    gorm.DeletedAt  `json:"-" gorm:"index"`
}

type TruckLocation struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	TruckID   uint      `json:"truck_id" gorm:"not null"`
	Truck     Truck     `json:"truck,omitempty"`
	Latitude  float64   `json:"latitude" gorm:"not null"`
	Longitude float64   `json:"longitude" gorm:"not null"`
	Speed     float64   `json:"speed"`
	Heading   float64   `json:"heading"`
	Timestamp time.Time `json:"timestamp" gorm:"default:CURRENT_TIMESTAMP"`
	CreatedAt time.Time `json:"created_at"`
}

type CreateTruckRequest struct {
	BranchID     *uint  `json:"branch_id"`
	LicensePlate string `json:"license_plate" binding:"required"`
	Model        string `json:"model" binding:"required"`
	Year         int    `json:"year" binding:"required"`
	Color        string `json:"color"`
	DriverID     *uint  `json:"driver_id"`
}

type UpdateTruckRequest struct {
	BranchID     *uint       `json:"branch_id"`
	LicensePlate string      `json:"license_plate"`
	Model        string      `json:"model"`
	Year         int         `json:"year"`
	Color        string      `json:"color"`
	Status       TruckStatus `json:"status"`
	DriverID     *uint       `json:"driver_id"`
	IsApproved   bool        `json:"is_approved"`
}

type LocationUpdateRequest struct {
	Latitude  float64 `json:"latitude" binding:"required"`
	Longitude float64 `json:"longitude" binding:"required"`
	Speed     float64 `json:"speed"`
	Heading   float64 `json:"heading"`
}

type TruckFilter struct {
	Status   TruckStatus `form:"status"`
	BranchID *uint       `form:"branch_id"`
	DriverID *uint       `form:"driver_id"`
	Model    string      `form:"model"`
	Online   *bool       `form:"online"`
	Approved *bool       `form:"approved"`
	Page     int         `form:"page,default=1"`
	Limit    int         `form:"limit,default=10"`
}