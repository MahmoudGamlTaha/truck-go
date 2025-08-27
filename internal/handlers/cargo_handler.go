package handlers

import (
	"net/http"
	"strconv"
	"time"
	"truck-management/internal/models"
	"truck-management/internal/services"
	"truck-management/internal/websocket"

	"github.com/gin-gonic/gin"
)

type CargoHandler struct {
	cargoService *services.CargoService
	wsHub        *websocket.Hub
}

func NewCargoHandler(cargoService *services.CargoService, wsHub *websocket.Hub) *CargoHandler {
	return &CargoHandler{
		cargoService: cargoService,
		wsHub:        wsHub,
	}
}

// CreateCargo godoc
// @Summary Create a new cargo
// @Description Add a new cargo shipment to the system
// @Tags cargo
// @Accept json
// @Produce json
// @Param request body models.CreateCargoRequest true "Cargo data"
// @Success 201 {object} models.Cargo
// @Failure 400 {object} map[string]string
// @Security BearerAuth
// @Router /cargo [post]
func (h *CargoHandler) CreateCargo(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	
	var req models.CreateCargoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cargo, err := h.cargoService.CreateCargo(companyID, req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Broadcast cargo creation via WebSocket
	h.wsHub.BroadcastToCompany(companyID, websocket.Message{
		Type: "cargo_created",
		Data: cargo,
	})

	c.JSON(http.StatusCreated, cargo)
}

// GetCargos godoc
// @Summary Get cargo list
// @Description Get all cargo shipments for the company with filtering options
// @Tags cargo
// @Produce json
// @Param status query string false "Filter by status"
// @Param type query string false "Filter by cargo type"
// @Param priority query string false "Filter by priority"
// @Param truck_id query int false "Filter by truck ID"
// @Param assigned query bool false "Filter assigned/unassigned cargo"
// @Param search query string false "Search in title, tracking number, or description"
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Success 200 {object} map[string]interface{}
// @Security BearerAuth
// @Router /cargo [get]
func (h *CargoHandler) GetCargos(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	
	var filter models.CargoFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cargos, total, err := h.cargoService.GetCargos(companyID, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"cargo": cargos,
		"total": total,
		"page":  filter.Page,
		"limit": filter.Limit,
	})
}

// GetCargo godoc
// @Summary Get a cargo by ID
// @Description Retrieve a specific cargo shipment by its ID
// @Tags cargo
// @Produce json
// @Param id path int true "Cargo ID"
// @Success 200 {object} models.Cargo
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /cargo/{id} [get]
func (h *CargoHandler) GetCargo(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	cargo, err := h.cargoService.GetCargo(uint(id), companyID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cargo not found"})
		return
	}

	c.JSON(http.StatusOK, cargo)
}

// GetCargoByTracking godoc
// @Summary Get cargo by tracking number
// @Description Retrieve cargo information using tracking number
// @Tags cargo
// @Produce json
// @Param tracking_number path string true "Tracking Number"
// @Success 200 {object} models.Cargo
// @Failure 404 {object} map[string]string
// @Router /cargo/track/{tracking_number} [get]
func (h *CargoHandler) GetCargoByTracking(c *gin.Context) {
	trackingNumber := c.Param("tracking_number")
	
	cargo, err := h.cargoService.GetCargoByTracking(trackingNumber)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cargo not found"})
		return
	}

	c.JSON(http.StatusOK, cargo)
}

// UpdateCargo godoc
// @Summary Update a cargo
// @Description Update cargo shipment information
// @Tags cargo
// @Accept json
// @Produce json
// @Param id path int true "Cargo ID"
// @Param request body models.UpdateCargoRequest true "Updated cargo data"
// @Success 200 {object} models.Cargo
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /cargo/{id} [put]
func (h *CargoHandler) UpdateCargo(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	var req models.UpdateCargoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cargo, err := h.cargoService.UpdateCargo(uint(id), companyID, req)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	// Broadcast cargo update via WebSocket
	h.wsHub.BroadcastToCompany(companyID, websocket.Message{
		Type: "cargo_updated",
		Data: cargo,
	})

	c.JSON(http.StatusOK, cargo)
}

// DeleteCargo godoc
// @Summary Delete a cargo
// @Description Remove a cargo shipment from the system
// @Tags cargo
// @Param id path int true "Cargo ID"
// @Success 204
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /cargo/{id} [delete]
func (h *CargoHandler) DeleteCargo(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	err := h.cargoService.DeleteCargo(uint(id), companyID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	// Broadcast cargo deletion via WebSocket
	h.wsHub.BroadcastToCompany(companyID, websocket.Message{
		Type: "cargo_deleted",
		Data: map[string]interface{}{"cargo_id": id},
	})

	c.Status(http.StatusNoContent)
}

// AssignCargoToTruck godoc
// @Summary Assign cargo to truck
// @Description Assign a cargo shipment to a specific truck
// @Tags cargo
// @Accept json
// @Produce json
// @Param id path int true "Cargo ID"
// @Param request body models.AssignCargoRequest true "Assignment data"
// @Success 200 {object} models.Cargo
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /cargo/{id}/assign [post]
func (h *CargoHandler) AssignCargoToTruck(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	userID := c.MustGet("user_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	var req models.AssignCargoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cargo, err := h.cargoService.AssignCargoToTruck(uint(id), companyID, req.TruckID, userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	// Broadcast cargo assignment via WebSocket
	h.wsHub.BroadcastToCompany(companyID, websocket.Message{
		Type: "cargo_assigned",
		Data: cargo,
	})

	c.JSON(http.StatusOK, cargo)
}

// UnassignCargoFromTruck godoc
// @Summary Unassign cargo from truck
// @Description Remove cargo assignment from truck
// @Tags cargo
// @Param id path int true "Cargo ID"
// @Success 200 {object} models.Cargo
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /cargo/{id}/unassign [post]
func (h *CargoHandler) UnassignCargoFromTruck(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	userID := c.MustGet("user_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)

	cargo, err := h.cargoService.UnassignCargoFromTruck(uint(id), companyID, userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	// Broadcast cargo unassignment via WebSocket
	h.wsHub.BroadcastToCompany(companyID, websocket.Message{
		Type: "cargo_unassigned",
		Data: cargo,
	})

	c.JSON(http.StatusOK, cargo)
}

// GetCargosByTruck godoc
// @Summary Get cargo assigned to truck
// @Description Get all cargo shipments assigned to a specific truck
// @Tags cargo
// @Produce json
// @Param truck_id path int true "Truck ID"
// @Success 200 {array} models.Cargo
// @Security BearerAuth
// @Router /cargo/trucks/{truck_id}/cargo [get]
func (h *CargoHandler) GetCargosByTruck(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	truckID, _ := strconv.ParseUint(c.Param("truck_id"), 10, 32)

	cargos, err := h.cargoService.GetCargosByTruck(uint(truckID), companyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, cargos)
}

// CreateCargoEvent godoc
// @Summary Create cargo event
// @Description Add a new event to cargo tracking history
// @Tags cargo
// @Accept json
// @Produce json
// @Param id path int true "Cargo ID"
// @Param request body models.CreateCargoEventRequest true "Event data"
// @Success 201 {object} models.CargoEvent
// @Failure 400 {object} map[string]string
// @Security BearerAuth
// @Router /cargo/{id}/events [post]
func (h *CargoHandler) CreateCargoEvent(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	userID := c.MustGet("user_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	var req models.CreateCargoEventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	event, err := h.cargoService.CreateCargoEvent(uint(id), companyID, userID, req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Broadcast cargo event via WebSocket
	h.wsHub.BroadcastToCompany(companyID, websocket.Message{
		Type: "cargo_event",
		Data: event,
	})

	c.JSON(http.StatusCreated, event)
}

// GetCargoEvents godoc
// @Summary Get cargo events
// @Description Get tracking history for a specific cargo
// @Tags cargo
// @Produce json
// @Param id path int true "Cargo ID"
// @Success 200 {array} models.CargoEvent
// @Security BearerAuth
// @Router /cargo/{id}/events [get]
func (h *CargoHandler) GetCargoEvents(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)

	events, err := h.cargoService.GetCargoEvents(uint(id), companyID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, events)
}

// GetUnassignedCargos godoc
// @Summary Get unassigned cargo
// @Description Get all cargo that hasn't been assigned to any truck
// @Tags cargo
// @Produce json
// @Success 200 {array} models.Cargo
// @Security BearerAuth
// @Router /cargo/unassigned [get]
func (h *CargoHandler) GetUnassignedCargos(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)

	cargos, err := h.cargoService.GetUnassignedCargos(companyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, cargos)
}

// UpdateCargoLocation godoc
// @Summary Update cargo real-time location
// @Description Update the current GPS location of cargo during transit
// @Tags cargo
// @Accept json
// @Produce json
// @Param id path int true "Cargo ID"
// @Param request body models.UpdateCargoLocationRequest true "Location data"
// @Success 200 {object} models.Cargo
// @Failure 400 {object} map[string]string
// @Security BearerAuth
// @Router /cargo/{id}/location [post]
func (h *CargoHandler) UpdateCargoLocation(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	userID := c.MustGet("user_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	var req models.UpdateCargoLocationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cargo, err := h.cargoService.UpdateCargoLocation(uint(id), companyID, userID, req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Broadcast location update via WebSocket
	h.wsHub.BroadcastToCompany(companyID, websocket.Message{
		Type: "cargo_location_update",
		Data: map[string]interface{}{
			"cargo_id":  id,
			"latitude":  req.Latitude,
			"longitude": req.Longitude,
			"location":  req.Location,
			"speed":     req.Speed,
			"heading":   req.Heading,
			"timestamp": time.Now(),
		},
	})

	c.JSON(http.StatusOK, cargo)
}

// GetCargoTracking godoc
// @Summary Get detailed cargo tracking info
// @Description Get comprehensive tracking information including progress and ETA
// @Tags cargo
// @Produce json
// @Param tracking_number path string true "Tracking Number"
// @Success 200 {object} models.CargoTrackingResponse
// @Failure 404 {object} map[string]string
// @Router /cargo/track/{tracking_number}/details [get]
func (h *CargoHandler) GetCargoTracking(c *gin.Context) {
	trackingNumber := c.Param("tracking_number")
	
	tracking, err := h.cargoService.GetCargoTracking(trackingNumber)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cargo not found"})
		return
	}

	c.JSON(http.StatusOK, tracking)
}

// GetCargoRoute godoc
// @Summary Get cargo route history
// @Description Get the complete route history with GPS coordinates
// @Tags cargo
// @Produce json
// @Param id path int true "Cargo ID"
// @Success 200 {array} models.CargoEvent
// @Security BearerAuth
// @Router /cargo/{id}/route [get]
func (h *CargoHandler) GetCargoRoute(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)

	route, err := h.cargoService.GetCargoRoute(uint(id), companyID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, route)
}

// GetNearbyCargoForTruck godoc
// @Summary Get nearby cargo for pickup
// @Description Get cargo near truck's current location for efficient pickup routing
// @Tags cargo
// @Produce json
// @Param truck_id path int true "Truck ID"
// @Param radius query float64 false "Search radius in kilometers" default(10)
// @Success 200 {array} models.Cargo
// @Security BearerAuth
// @Router /cargo/trucks/{truck_id}/nearby-cargo [get]
func (h *CargoHandler) GetNearbyCargoForTruck(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	truckID, _ := strconv.ParseUint(c.Param("truck_id"), 10, 32)
	
	radius := 10.0 // default 10km
	if r := c.Query("radius"); r != "" {
		if parsed, err := strconv.ParseFloat(r, 64); err == nil {
			radius = parsed
		}
	}

	cargos, err := h.cargoService.GetNearbyCargoForTruck(uint(truckID), companyID, radius)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, cargos)
}