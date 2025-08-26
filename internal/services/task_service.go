package services

import (
	"time"
	"truck-management/internal/models"
	"truck-management/internal/repositories"
)

type TaskService struct {
	taskRepo *repositories.TaskRepository
}

func NewTaskService(taskRepo *repositories.TaskRepository) *TaskService {
	return &TaskService{taskRepo: taskRepo}
}

func (s *TaskService) CreateTask(req models.CreateTaskRequest) (*models.Task, error) {
	task := &models.Task{
		VisitID:     req.VisitID,
		Title:       req.Title,
		Description: req.Description,
	}

	err := s.taskRepo.Create(task)
	if err != nil {
		return nil, err
	}

	return s.taskRepo.GetByID(task.ID)
}

func (s *TaskService) GetTasksByVisit(visitID uint) ([]models.Task, error) {
	return s.taskRepo.GetByVisitID(visitID)
}

func (s *TaskService) GetTask(id uint) (*models.Task, error) {
	return s.taskRepo.GetByID(id)
}

func (s *TaskService) CompleteTask(id uint) (*models.Task, error) {
	task, err := s.taskRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	task.IsCompleted = true
	now := time.Now()
	task.CompletedAt = &now

	err = s.taskRepo.Update(task)
	if err != nil {
		return nil, err
	}

	return task, nil
}
