package models

import (
	"time"

	"gorm.io/gorm"
)

type VisitStatus string

const (
	VisitStatusPending    VisitStatus = "pending"
	VisitStatusInProgress VisitStatus = "in_progress"
	VisitStatusCompleted  VisitStatus = "completed"
	VisitStatusCancelled  VisitStatus = "cancelled"
)

type Visit struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	CompanyID   uint           `json:"company_id" gorm:"not null"`
	Company     Company        `json:"company,omitempty"`
	TruckID     uint           `json:"truck_id" gorm:"not null"`
	Truck       Truck          `json:"truck,omitempty"`
	DriverID    uint           `json:"driver_id" gorm:"not null"`
	Driver      User           `json:"driver,omitempty"`
	CustomerName string        `json:"customer_name" gorm:"not null"`
	Address     string         `json:"address" gorm:"not null"`
	Latitude    *float64       `json:"latitude"`
	Longitude   *float64       `json:"longitude"`
	Status      VisitStatus    `json:"status" gorm:"default:'pending'"`
	StartTime   *time.Time     `json:"start_time"`
	EndTime     *time.Time     `json:"end_time"`
	Notes       string         `json:"notes"`
	Tasks       []Task         `json:"tasks,omitempty"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

type Task struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	VisitID     uint           `json:"visit_id" gorm:"not null"`
	Visit       Visit          `json:"visit,omitempty"`
	Title       string         `json:"title" gorm:"not null"`
	Description string         `json:"description"`
	IsCompleted bool           `json:"is_completed" gorm:"default:false"`
	CompletedAt *time.Time     `json:"completed_at"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

type CreateVisitRequest struct {
	TruckID      uint     `json:"truck_id" binding:"required"`
	DriverID     uint     `json:"driver_id" binding:"required"`
	CustomerName string   `json:"customer_name" binding:"required"`
	Address      string   `json:"address" binding:"required"`
	Latitude     *float64 `json:"latitude"`
	Longitude    *float64 `json:"longitude"`
	Notes        string   `json:"notes"`
}

type CreateTaskRequest struct {
	VisitID     uint   `json:"visit_id" binding:"required"`
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
}