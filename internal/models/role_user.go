package models

type RoleUser struct {
	ID   uint   `json:"id" gorm:"primaryKey"`
	Role string `json:"role" gorm:"not null"`
}
