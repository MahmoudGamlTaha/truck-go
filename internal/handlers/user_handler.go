package handlers

import (
	"net/http"
	"strconv"
	"truck-management/internal/models"
	"truck-management/internal/services"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService *services.UserService
}

func NewUserHandler(userService *services.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

// CreateUser godoc
// @Summary Create a new user
// @Description Create a new user (Admin only)
// @Tags users
// @Accept json
// @Produce json
// @Param request body models.CreateUserRequest true "User data"
// @Success 201 {object} models.User
// @Failure 400 {object} map[string]string
// @Security BearerAuth
// @Router /users [post]
func (h *UserHandler) CreateUser(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	
	var req models.CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.userService.CreateUser(companyID, req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, user)
}

// GetUsers godoc
// @Summary Get all users
// @Description Get all users for the company (Admin only)
// @Tags users
// @Produce json
// @Success 200 {array} models.User
// @Security BearerAuth
// @Router /users [get]
func (h *UserHandler) GetUsers(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	
	users, err := h.userService.GetUsers(companyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, users)
}

// GetUser godoc
// @Summary Get a user by ID
// @Description Retrieve a specific user by its ID
// @Tags users
// @Produce json
// @Param id path int true "User ID"
// @Success 200 {object} models.User
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /users/{id} [get]
func (h *UserHandler) GetUser(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	user, err := h.userService.GetUser(uint(id), companyID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// UpdateUser godoc
// @Summary Update a user
// @Description Update user information (Admin only)
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Param request body models.UpdateUserRequest true "Updated user data"
// @Success 200 {object} models.User
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /users/{id} [put]
func (h *UserHandler) UpdateUser(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	var req models.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.userService.UpdateUser(uint(id), companyID, req)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, user)
}

// DeleteUser godoc
// @Summary Delete a user
// @Description Delete a user (Admin only)
// @Tags users
// @Param id path int true "User ID"
// @Success 204
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /users/{id} [delete]
func (h *UserHandler) DeleteUser(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	err := h.userService.DeleteUser(uint(id), companyID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

// GetDrivers godoc
// @Summary Get all drivers
// @Description Get all drivers for the company
// @Tags users
// @Produce json
// @Success 200 {array} models.User
// @Security BearerAuth
// @Router /users/drivers [get]
func (h *UserHandler) GetDrivers(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	
	drivers, err := h.userService.GetDrivers(companyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, drivers)
}

// AssignTruckToDriver godoc
// @Summary Assign truck to driver
// @Description Assign a truck to a driver (Admin only)
// @Tags users
// @Accept json
// @Produce json
// @Param driver_id path int true "Driver ID"
// @Param request body map[string]int true "Truck assignment data"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Security BearerAuth
// @Router /users/{driver_id}/assign-truck [post]
func (h *UserHandler) AssignTruckToDriver(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	driverID, _ := strconv.ParseUint(c.Param("driver_id"), 10, 32)
	
	var req map[string]uint
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	truckID := req["truck_id"]
	err := h.userService.AssignTruckToDriver(uint(driverID), truckID, companyID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Truck assigned successfully"})
}