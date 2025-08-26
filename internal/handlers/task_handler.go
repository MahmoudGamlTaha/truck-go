package handlers

import (
	"net/http"
	"strconv"
	"truck-management/internal/models"
	"truck-management/internal/services"

	"github.com/gin-gonic/gin"
)

type TaskHandler struct {
	taskService *services.TaskService
}

func NewTaskHandler(taskService *services.TaskService) *TaskHandler {
	return &TaskHandler{taskService: taskService}
}

// CreateTask godoc
// @Summary Create a new task
// @Description Add a new task to a visit
// @Tags tasks
// @Accept json
// @Produce json
// @Param request body models.CreateTaskRequest true "Task data"
// @Success 201 {object} models.Task
// @Failure 400 {object} map[string]string
// @Security BearerAuth
// @Router /tasks [post]
func (h *TaskHandler) CreateTask(c *gin.Context) {
	var req models.CreateTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	task, err := h.taskService.CreateTask(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, task)
}

// GetTasks godoc
// @Summary Get tasks by visit
// @Description Get all tasks for a specific visit
// @Tags tasks
// @Produce json
// @Param visit_id query int true "Visit ID"
// @Success 200 {array} models.Task
// @Security BearerAuth
// @Router /tasks [get]
func (h *TaskHandler) GetTasks(c *gin.Context) {
	visitIDStr := c.Query("visit_id")
	visitID, err := strconv.ParseUint(visitIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid visit_id"})
		return
	}

	tasks, err := h.taskService.GetTasksByVisit(uint(visitID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tasks)
}

// GetTask godoc
// @Summary Get a task by ID
// @Description Retrieve a specific task by its ID
// @Tags tasks
// @Produce json
// @Param id path int true "Task ID"
// @Success 200 {object} models.Task
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /tasks/{id} [get]
func (h *TaskHandler) GetTask(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)

	task, err := h.taskService.GetTask(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	c.JSON(http.StatusOK, task)
}

// UpdateTask godoc
// @Summary Update a task
// @Description Update task information
// @Tags tasks
// @Accept json
// @Produce json
// @Param id path int true "Task ID"
// @Param request body models.Task true "Updated task data"
// @Success 200 {object} models.Task
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /tasks/{id} [put]
func (h *TaskHandler) UpdateTask(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)

	var req models.Task
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	task, err := h.taskService.GetTask(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	if req.Title != "" {
		task.Title = req.Title
	}
	if req.Description != "" {
		task.Description = req.Description
	}

	// Update task logic would go here
	c.JSON(http.StatusOK, task)
}

// CompleteTask godoc
// @Summary Complete a task
// @Description Mark a task as completed
// @Tags tasks
// @Param id path int true "Task ID"
// @Success 200 {object} models.Task
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /tasks/{id}/complete [put]
func (h *TaskHandler) CompleteTask(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)

	task, err := h.taskService.CompleteTask(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, task)
}
