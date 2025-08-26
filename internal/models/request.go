package models

import (
	"time"

	"gorm.io/gorm"
)

type RequestType string
type RequestStatus string

const (
	RequestTypeTruckAssignment RequestType = "truck_assignment"
	RequestTypeMaintenace      RequestType = "maintenance"
	RequestTypeLeave           RequestType = "leave"
	RequestTypeOther           RequestType = "other"
)

const (
	RequestStatusPending    RequestStatus = "pending"
	RequestStatusAccepted   RequestStatus = "accepted"
	RequestStatusTerminated RequestStatus = "terminated"
)

type Request struct {
	ID               uint           `json:"id" gorm:"primaryKey"`
	CompanyID        uint           `json:"company_id" gorm:"not null"`
	Company          Company        `json:"company,omitempty"`
	UserID           uint           `json:"user_id" gorm:"not null"`
	User             User           `json:"user,omitempty"`
	TruckID          *uint          `json:"truck_id"`
	Truck            *Truck         `json:"truck,omitempty"`
	Type             RequestType    `json:"type" gorm:"not null"`
	Status           RequestStatus  `json:"status" gorm:"default:'pending'"`
	Title            string         `json:"title" gorm:"not null"`
	Description      string         `json:"description"`
	AcceptedBy       *uint          `json:"accepted_by"`
	AcceptedByUser   *User          `json:"accepted_by_user,omitempty"`
	AcceptedAt       *time.Time     `json:"accepted_at"`
	TerminatedBy     *uint          `json:"terminated_by"`
	TerminatedByUser *User          `json:"terminated_by_user,omitempty"`
	TerminatedAt     *time.Time     `json:"terminated_at"`
	TerminationReason string        `json:"termination_reason"`
	CreatedAt        time.Time      `json:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at"`
	DeletedAt        gorm.DeletedAt `json:"-" gorm:"index"`
}

type CreateRequestRequest struct {
	TruckID     *uint       `json:"truck_id"`
	Type        RequestType `json:"type" binding:"required"`
	Title       string      `json:"title" binding:"required"`
	Description string      `json:"description"`
}

type TerminateRequestRequest struct {
	Reason string `json:"reason" binding:"required"`
}