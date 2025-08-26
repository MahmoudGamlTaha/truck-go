package models

import (
	"time"

	"gorm.io/gorm"
)

type CargoStatus string
type CargoType string
type CargoPriority string

const (
	CargoStatusPending    CargoStatus = "pending"
	CargoStatusAssigned   CargoStatus = "assigned"
	CargoStatusInTransit  CargoStatus = "in_transit"
	CargoStatusDelivered  CargoStatus = "delivered"
	CargoStatusCancelled  CargoStatus = "cancelled"
)

const (
	CargoTypeGeneral     CargoType = "general"
	CargoTypeFragile     CargoType = "fragile"
	CargoTypeHazardous   CargoType = "hazardous"
	CargoTypePerishable  CargoType = "perishable"
	CargoTypeLiquid      CargoType = "liquid"
	CargoTypeOversized   CargoType = "oversized"
)

const (
	CargoPriorityLow      CargoPriority = "low"
	CargoPriorityMedium   CargoPriority = "medium"
	CargoPriorityHigh     CargoPriority = "high"
	CargoPriorityUrgent   CargoPriority = "urgent"
)

type Cargo struct {
	ID              uint           `json:"id" gorm:"primaryKey"`
	CompanyID       uint           `json:"company_id" gorm:"not null"`
	Company         Company        `json:"company,omitempty"`
	TruckID         *uint          `json:"truck_id"`
	Truck           *Truck         `json:"truck,omitempty"`
	TrackingNumber  string         `json:"tracking_number" gorm:"uniqueIndex;not null"`
	Title           string         `json:"title" gorm:"not null"`
	Description     string         `json:"description"`
	Type            CargoType      `json:"type" gorm:"default:'general'"`
	Priority        CargoPriority  `json:"priority" gorm:"default:'medium'"`
	Status          CargoStatus    `json:"status" gorm:"default:'pending'"`
	Weight          float64        `json:"weight"` // in kg
	Volume          float64        `json:"volume"` // in cubic meters
	Value           float64        `json:"value"`  // monetary value
	Currency        string         `json:"currency" gorm:"default:'USD'"`
	
	// Origin details
	OriginAddress   string         `json:"origin_address" gorm:"not null"`
	OriginLatitude  *float64       `json:"origin_latitude"`
	OriginLongitude *float64       `json:"origin_longitude"`
	OriginContact   string         `json:"origin_contact"`
	OriginPhone     string         `json:"origin_phone"`
	
	// Destination details
	DestinationAddress   string    `json:"destination_address" gorm:"not null"`
	DestinationLatitude  *float64  `json:"destination_latitude"`
	DestinationLongitude *float64  `json:"destination_longitude"`
	DestinationContact   string    `json:"destination_contact"`
	DestinationPhone     string    `json:"destination_phone"`
	
	// Timing
	PickupTime      *time.Time     `json:"pickup_time"`
	DeliveryTime    *time.Time     `json:"delivery_time"`
	EstimatedDelivery *time.Time   `json:"estimated_delivery"`
	ActualPickup    *time.Time     `json:"actual_pickup"`
	ActualDelivery  *time.Time     `json:"actual_delivery"`
	
	// Assignment details
	AssignedBy      *uint          `json:"assigned_by"`
	AssignedByUser  *User          `json:"assigned_by_user,omitempty"`
	AssignedAt      *time.Time     `json:"assigned_at"`
	
	// Special instructions
	Instructions    string         `json:"instructions"`
	SpecialHandling bool           `json:"special_handling" gorm:"default:false"`
	
	// Tracking
	CargoEvents     []CargoEvent   `json:"cargo_events,omitempty"`
	
	// Real-time tracking
	CurrentLatitude  *float64      `json:"current_latitude"`
	CurrentLongitude *float64      `json:"current_longitude"`
	CurrentLocation  string        `json:"current_location"`
	LastUpdated      *time.Time    `json:"last_updated"`
	
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `json:"-" gorm:"index"`
}

type CargoEvent struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	CargoID     uint           `json:"cargo_id" gorm:"not null"`
	Cargo       Cargo          `json:"cargo,omitempty"`
	EventType   string         `json:"event_type" gorm:"not null"` // pickup, delivery, status_change, location_update
	Description string         `json:"description"`
	Location    string         `json:"location"`
	Latitude    *float64       `json:"latitude"`
	Longitude   *float64       `json:"longitude"`
	UserID      *uint          `json:"user_id"`
	User        *User          `json:"user,omitempty"`
	Timestamp   time.Time      `json:"timestamp" gorm:"default:CURRENT_TIMESTAMP"`
	CreatedAt   time.Time      `json:"created_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

type CreateCargoRequest struct {
	Title           string        `json:"title" binding:"required"`
	Description     string        `json:"description"`
	Type            CargoType     `json:"type"`
	Priority        CargoPriority `json:"priority"`
	Weight          float64       `json:"weight" binding:"required"`
	Volume          float64       `json:"volume"`
	Value           float64       `json:"value"`
	Currency        string        `json:"currency"`
	
	OriginAddress   string        `json:"origin_address" binding:"required"`
	OriginLatitude  *float64      `json:"origin_latitude"`
	OriginLongitude *float64      `json:"origin_longitude"`
	OriginContact   string        `json:"origin_contact"`
	OriginPhone     string        `json:"origin_phone"`
	
	DestinationAddress   string   `json:"destination_address" binding:"required"`
	DestinationLatitude  *float64 `json:"destination_latitude"`
	DestinationLongitude *float64 `json:"destination_longitude"`
	DestinationContact   string   `json:"destination_contact"`
	DestinationPhone     string   `json:"destination_phone"`
	
	PickupTime        *time.Time `json:"pickup_time"`
	DeliveryTime      *time.Time `json:"delivery_time"`
	EstimatedDelivery *time.Time `json:"estimated_delivery"`
	
	Instructions      string     `json:"instructions"`
	SpecialHandling   bool       `json:"special_handling"`
}

type UpdateCargoRequest struct {
	Title           string        `json:"title"`
	Description     string        `json:"description"`
	Type            CargoType     `json:"type"`
	Priority        CargoPriority `json:"priority"`
	Status          CargoStatus   `json:"status"`
	Weight          float64       `json:"weight"`
	Volume          float64       `json:"volume"`
	Value           float64       `json:"value"`
	Currency        string        `json:"currency"`
	
	OriginAddress   string        `json:"origin_address"`
	OriginLatitude  *float64      `json:"origin_latitude"`
	OriginLongitude *float64      `json:"origin_longitude"`
	OriginContact   string        `json:"origin_contact"`
	OriginPhone     string        `json:"origin_phone"`
	
	DestinationAddress   string   `json:"destination_address"`
	DestinationLatitude  *float64 `json:"destination_latitude"`
	DestinationLongitude *float64 `json:"destination_longitude"`
	DestinationContact   string   `json:"destination_contact"`
	DestinationPhone     string   `json:"destination_phone"`
	
	PickupTime        *time.Time `json:"pickup_time"`
	DeliveryTime      *time.Time `json:"delivery_time"`
	EstimatedDelivery *time.Time `json:"estimated_delivery"`
	
	Instructions      string     `json:"instructions"`
	SpecialHandling   bool       `json:"special_handling"`
}

type AssignCargoRequest struct {
	TruckID uint `json:"truck_id" binding:"required"`
}

type CargoFilter struct {
	Status    CargoStatus   `form:"status"`
	Type      CargoType     `form:"type"`
	Priority  CargoPriority `form:"priority"`
	TruckID   *uint         `form:"truck_id"`
	Assigned  *bool         `form:"assigned"`
	Search    string        `form:"search"`
	Page      int           `form:"page,default=1"`
	Limit     int           `form:"limit,default=10"`
}

type CreateCargoEventRequest struct {
	EventType   string   `json:"event_type" binding:"required"`
	Description string   `json:"description"`
	Location    string   `json:"location"`
	Latitude    *float64 `json:"latitude"`
	Longitude   *float64 `json:"longitude"`
}

type UpdateCargoLocationRequest struct {
	Latitude    float64 `json:"latitude" binding:"required"`
	Longitude   float64 `json:"longitude" binding:"required"`
	Location    string  `json:"location"`
	Speed       float64 `json:"speed"`
	Heading     float64 `json:"heading"`
}

type CargoTrackingResponse struct {
	Cargo          Cargo            `json:"cargo"`
	CurrentStatus  string            `json:"current_status"`
	Progress       float64           `json:"progress"` // 0-100%
	EstimatedETA   *time.Time        `json:"estimated_eta"`
	LastUpdate     *time.Time        `json:"last_update"`
	RecentEvents   []CargoEvent      `json:"recent_events"`
	TruckLocation  *TruckLocation    `json:"truck_location,omitempty"`
}