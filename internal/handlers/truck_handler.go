package handlers

import (
	"net/http"
	"strconv"
	"truck-management/internal/models"
	"truck-management/internal/services"
	"truck-management/internal/websocket"

	"github.com/gin-gonic/gin"
)

type TruckHandler struct {
	truckService *services.TruckService
	wsHub        *websocket.Hub
	taskService  *services.TaskService
}

func NewTruckHandler(truckService *services.TruckService, wsHub *websocket.Hub, taskService *services.TaskService) *TruckHandler {
	return &TruckHandler{
		truckService: truckService,
		wsHub:        wsHub,
		taskService:  taskService,
	}
}

// CreateTruck godoc
// @Summary Create a new truck
// @Description Add a new truck to the company fleet
// @Tags trucks
// @Accept json
// @Produce json
// @Param request body models.CreateTruckRequest true "Truck data"
// @Success 201 {object} models.Truck
// @Failure 400 {object} map[string]string
// @Security BearerAuth
// @Router /trucks [post]
func (h *TruckHandler) CreateTruck(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)

	var req models.CreateTruckRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	truck, err := h.truckService.CreateTruck(companyID, req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, truck)
}

// GetTrucks godoc
// @Summary Get trucks
// @Description Get all trucks for the company with filtering options
// @Tags trucks
// @Produce json
// @Param status query string false "Filter by status"
// @Param branch_id query int false "Filter by branch ID"
// @Param driver_id query int false "Filter by driver ID"
// @Param model query string false "Filter by model"
// @Param online query bool false "Filter online trucks only"
// @Param approved query bool false "Filter approved trucks only"
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Success 200 {object} map[string]interface{}
// @Security BearerAuth
// @Router /trucks [get]
func (h *TruckHandler) GetTrucks(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	role := c.MustGet("role").(models.UserRole)
	userID := c.MustGet("user_id").(uint)

	var filter models.TruckFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// If user is driver, they can only see their own truck
	if role == models.RoleDriver {
		filter.DriverID = &userID
	}

	trucks, total, err := h.truckService.GetTrucks(companyID, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"trucks": trucks,
		"total":  total,
		"page":   filter.Page,
		"limit":  filter.Limit,
	})
}

// GetTruck godoc
// @Summary Get a truck by ID
// @Description Retrieve a specific truck by its ID
// @Tags trucks
// @Produce json
// @Param id path int true "Truck ID"
// @Success 200 {object} models.Truck
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /trucks/{id} [get]
func (h *TruckHandler) GetTruck(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	role := c.MustGet("role").(models.UserRole)
	userID := c.MustGet("user_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)

	truck, err := h.truckService.GetTruck(uint(id), companyID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Truck not found"})
		return
	}

	// If user is driver, they can only see their own truck
	if role == models.RoleDriver && (truck.DriverID == nil || *truck.DriverID != userID) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	c.JSON(http.StatusOK, truck)
}

// UpdateTruck godoc
// @Summary Update a truck
// @Description Update truck information
// @Tags trucks
// @Accept json
// @Produce json
// @Param id path int true "Truck ID"
// @Param request body models.UpdateTruckRequest true "Updated truck data"
// @Success 200 {object} models.Truck
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /trucks/{id} [put]
func (h *TruckHandler) UpdateTruck(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)

	var req models.UpdateTruckRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	truck, err := h.truckService.UpdateTruck(uint(id), companyID, req)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, truck)
}

// DeleteTruck godoc
// @Summary Delete a truck
// @Description Remove a truck from the fleet
// @Tags trucks
// @Param id path int true "Truck ID"
// @Success 204
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /trucks/{id} [delete]
func (h *TruckHandler) DeleteTruck(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)

	err := h.truckService.DeleteTruck(uint(id), companyID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

// UpdateTruckLocation godoc
// @Summary Update truck location
// @Description Update the real-time location of a truck
// @Tags trucks
// @Accept json
// @Produce json
// @Param id path int true "Truck ID"
// @Param request body models.LocationUpdateRequest true "Location data"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /trucks/{id}/location [post]
func (h *TruckHandler) UpdateTruckLocation(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)

	var req models.LocationUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.truckService.UpdateTruckLocation(uint(id), companyID, req)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	// Broadcast location update via WebSocket
	h.wsHub.BroadcastToCompany(companyID, websocket.Message{
		Type: "location_update",
		Data: map[string]interface{}{
			"truck_id":  id,
			"latitude":  req.Latitude,
			"longitude": req.Longitude,
			"speed":     req.Speed,
			"heading":   req.Heading,
		},
	})

	c.JSON(http.StatusOK, gin.H{"message": "Location updated successfully"})
}

// GetOnlineTrucks godoc
// @Summary Get online trucks
// @Description Get all trucks that are currently online
// @Tags trucks
// @Produce json
// @Success 200 {array} models.Truck
// @Security BearerAuth
// @Router /trucks/online [get]
func (h *TruckHandler) GetOnlineTrucks(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)

	trucks, err := h.truckService.GetOnlineTrucks(companyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, trucks)
}

// ApproveTruck godoc
// @Summary Approve a truck
// @Description Approve a truck for operation (Assignee only)
// @Tags trucks
// @Param id path int true "Truck ID"
// @Success 200 {object} models.Truck
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /trucks/{id}/approve [put]
func (h *TruckHandler) ApproveTruck(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	userID := c.MustGet("user_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)

	truck, err := h.truckService.ApproveTruck(uint(id), companyID, userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, truck)
}

// GetDriverTruck godoc
// @Summary Get driver's assigned truck
// @Description Get the truck assigned to the current driver
// @Tags trucks
// @Produce json
// @Success 200 {object} models.Truck
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /trucks/my-truck [get]
func (h *TruckHandler) GetDriverTruck(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	userID := c.MustGet("user_id").(uint)

	truck, err := h.truckService.GetDriverTruck(userID, companyID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No truck assigned"})
		return
	}

	c.JSON(http.StatusOK, truck)
}
