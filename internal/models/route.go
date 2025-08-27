package models

import (
	"time"

	"gorm.io/gorm"
)

type RouteStatus string

const (
	RouteStatusDraft     RouteStatus = "draft"
	RouteStatusActive    RouteStatus = "active"
	RouteStatusCompleted RouteStatus = "completed"
	RouteStatusCancelled RouteStatus = "cancelled"
)

type Route struct {
	ID             uint           `json:"id" gorm:"primaryKey"`
	CompanyID      uint           `json:"company_id" gorm:"not null"`
	Company        Company        `json:"company,omitempty"`
	BranchID       *uint          `json:"branch_id"`
	Branch         *Branch        `json:"branch,omitempty"`
	TruckID        *uint          `json:"truck_id"`
	Truck          *Truck         `json:"truck,omitempty"`
	DriverID       *uint          `json:"driver_id"`
	Driver         *User          `json:"driver,omitempty"`
	Name           string         `json:"name" gorm:"not null"`
	Description    string         `json:"description"`
	Status         RouteStatus    `json:"status" gorm:"default:'draft'"`
	StartTime      *time.Time     `json:"start_time"`
	EndTime        *time.Time     `json:"end_time"`
	CreatedBy      uint           `json:"created_by" gorm:"not null"`
	CreatedByUser  User           `json:"created_by_user,omitempty" gorm:"foreignKey:CreatedBy;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	ApprovedBy     *uint          `json:"approved_by"`
	ApprovedByUser *User          `json:"approved_by_user,omitempty" gorm:"foreignKey:ApprovedBy;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	ApprovedAt     *time.Time     `json:"approved_at"`
	RouteStops     []RouteStop    `json:"route_stops,omitempty"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `json:"-" gorm:"index"`
}

type RouteStop struct {
	ID               uint           `json:"id" gorm:"primaryKey"`
	RouteID          uint           `json:"route_id" gorm:"not null"`
	Route            Route          `json:"route,omitempty"`
	StopOrder        int            `json:"stop_order" gorm:"not null"`
	Address          string         `json:"address" gorm:"not null"`
	Latitude         *float64       `json:"latitude"`
	Longitude        *float64       `json:"longitude"`
	ContactName      string         `json:"contact_name"`
	ContactPhone     string         `json:"contact_phone"`
	Instructions     string         `json:"instructions"`
	EstimatedArrival *time.Time     `json:"estimated_arrival"`
	ActualArrival    *time.Time     `json:"actual_arrival"`
	IsCompleted      bool           `json:"is_completed" gorm:"default:false"`
	CompletedAt      *time.Time     `json:"completed_at"`
	Notes            string         `json:"notes"`
	CreatedAt        time.Time      `json:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at"`
	DeletedAt        gorm.DeletedAt `json:"-" gorm:"index"`
}

type CreateRouteRequest struct {
	BranchID    *uint      `json:"branch_id"`
	Name        string     `json:"name" binding:"required"`
	Description string     `json:"description"`
	StartTime   *time.Time `json:"start_time"`
	EndTime     *time.Time `json:"end_time"`
}

type UpdateRouteRequest struct {
	BranchID    *uint       `json:"branch_id"`
	TruckID     *uint       `json:"truck_id"`
	DriverID    *uint       `json:"driver_id"`
	Name        string      `json:"name"`
	Description string      `json:"description"`
	Status      RouteStatus `json:"status"`
	StartTime   *time.Time  `json:"start_time"`
	EndTime     *time.Time  `json:"end_time"`
}

type CreateRouteStopRequest struct {
	StopOrder        int        `json:"stop_order" binding:"required"`
	Address          string     `json:"address" binding:"required"`
	Latitude         *float64   `json:"latitude"`
	Longitude        *float64   `json:"longitude"`
	ContactName      string     `json:"contact_name"`
	ContactPhone     string     `json:"contact_phone"`
	Instructions     string     `json:"instructions"`
	EstimatedArrival *time.Time `json:"estimated_arrival"`
}

type RouteFilter struct {
	Status   RouteStatus `form:"status"`
	TruckID  *uint       `form:"truck_id"`
	DriverID *uint       `form:"driver_id"`
	BranchID *uint       `form:"branch_id"`
	Page     int         `form:"page,default=1"`
	Limit    int         `form:"limit,default=10"`
}
