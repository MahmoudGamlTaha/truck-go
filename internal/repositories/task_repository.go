package repositories

import (
	"truck-management/internal/models"

	"gorm.io/gorm"
)

type TaskRepository struct {
	db *gorm.DB
}

func NewTaskRepository(db *gorm.DB) *TaskRepository {
	return &TaskRepository{db: db}
}

func (r *TaskRepository) Create(task *models.Task) error {
	return r.db.Create(task).Error
}

func (r *TaskRepository) GetByVisitID(visitID uint) ([]models.Task, error) {
	var tasks []models.Task
	err := r.db.Where("visit_id = ?", visitID).Find(&tasks).Error
	return tasks, err
}

func (r *TaskRepository) GetByID(id uint) (*models.Task, error) {
	var task models.Task
	err := r.db.Preload("Visit").First(&task, id).Error
	return &task, err
}

func (r *TaskRepository) Update(task *models.Task) error {
	return r.db.Save(task).Error
}