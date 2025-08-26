package handlers

import (
	"net/http"
	"strconv"
	"truck-management/internal/models"
	"truck-management/internal/services"

	"github.com/gin-gonic/gin"
)

type RouteHandler struct {
	routeService *services.RouteService
}

func NewRouteHandler(routeService *services.RouteService) *RouteHandler {
	return &RouteHandler{routeService: routeService}
}

// CreateRoute godoc
// @Summary Create a new route
// @Description Create a new route (Assignee only)
// @Tags routes
// @Accept json
// @Produce json
// @Param request body models.CreateRouteRequest true "Route data"
// @Success 201 {object} models.Route
// @Failure 400 {object} map[string]string
// @Security BearerAuth
// @Router /routes [post]
func (h *RouteHandler) CreateRoute(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	userID := c.MustGet("user_id").(uint)
	
	var req models.CreateRouteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	route, err := h.routeService.CreateRoute(companyID, userID, req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, route)
}

// GetRoutes godoc
// @Summary Get routes
// @Description Get all routes (drivers see only their routes)
// @Tags routes
// @Produce json
// @Param status query string false "Filter by status"
// @Param truck_id query int false "Filter by truck ID"
// @Param driver_id query int false "Filter by driver ID"
// @Param branch_id query int false "Filter by branch ID"
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Success 200 {object} map[string]interface{}
// @Security BearerAuth
// @Router /routes [get]
func (h *RouteHandler) GetRoutes(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	userID := c.MustGet("user_id").(uint)
	role := c.MustGet("role").(models.UserRole)
	
	var filter models.RouteFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	routes, total, err := h.routeService.GetRoutes(companyID, filter, role, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"routes": routes,
		"total":  total,
		"page":   filter.Page,
		"limit":  filter.Limit,
	})
}

// GetRoute godoc
// @Summary Get a route by ID
// @Description Retrieve a specific route by its ID
// @Tags routes
// @Produce json
// @Param id path int true "Route ID"
// @Success 200 {object} models.Route
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /routes/{id} [get]
func (h *RouteHandler) GetRoute(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	userID := c.MustGet("user_id").(uint)
	role := c.MustGet("role").(models.UserRole)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	route, err := h.routeService.GetRoute(uint(id), companyID, role, userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Route not found"})
		return
	}

	c.JSON(http.StatusOK, route)
}

// UpdateRoute godoc
// @Summary Update a route
// @Description Update route information (Assignee only)
// @Tags routes
// @Accept json
// @Produce json
// @Param id path int true "Route ID"
// @Param request body models.UpdateRouteRequest true "Updated route data"
// @Success 200 {object} models.Route
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /routes/{id} [put]
func (h *RouteHandler) UpdateRoute(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	var req models.UpdateRouteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	route, err := h.routeService.UpdateRoute(uint(id), companyID, req)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, route)
}

// ApproveRoute godoc
// @Summary Approve a route
// @Description Approve a route and make it active (Assignee only)
// @Tags routes
// @Param id path int true "Route ID"
// @Success 200 {object} models.Route
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /routes/{id}/approve [put]
func (h *RouteHandler) ApproveRoute(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	userID := c.MustGet("user_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	route, err := h.routeService.ApproveRoute(uint(id), companyID, userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, route)
}

// DeleteRoute godoc
// @Summary Delete a route
// @Description Delete a route (Assignee only)
// @Tags routes
// @Param id path int true "Route ID"
// @Success 204
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /routes/{id} [delete]
func (h *RouteHandler) DeleteRoute(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	err := h.routeService.DeleteRoute(uint(id), companyID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

// CreateRouteStop godoc
// @Summary Create a route stop
// @Description Add a stop to a route (Assignee only)
// @Tags routes
// @Accept json
// @Produce json
// @Param id path int true "Route ID"
// @Param request body models.CreateRouteStopRequest true "Route stop data"
// @Success 201 {object} models.RouteStop
// @Failure 400 {object} map[string]string
// @Security BearerAuth
// @Router /routes/{id}/stops [post]
func (h *RouteHandler) CreateRouteStop(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	routeID, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	var req models.CreateRouteStopRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	stop, err := h.routeService.CreateRouteStop(uint(routeID), companyID, req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, stop)
}

// GetRouteStops godoc
// @Summary Get route stops
// @Description Get all stops for a route
// @Tags routes
// @Produce json
// @Param id path int true "Route ID"
// @Success 200 {array} models.RouteStop
// @Security BearerAuth
// @Router /routes/{id}/stops [get]
func (h *RouteHandler) GetRouteStops(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	routeID, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	stops, err := h.routeService.GetRouteStops(uint(routeID), companyID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, stops)
}

// CompleteRouteStop godoc
// @Summary Complete a route stop
// @Description Mark a route stop as completed (Driver only)
// @Tags routes
// @Accept json
// @Produce json
// @Param id path int true "Route Stop ID"
// @Param request body map[string]string true "Completion notes"
// @Success 200 {object} models.RouteStop
// @Failure 400 {object} map[string]string
// @Security BearerAuth
// @Router /route-stops/{id}/complete [put]
func (h *RouteHandler) CompleteRouteStop(c *gin.Context) {
	stopID, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	var req map[string]string
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	notes := req["notes"]
	stop, err := h.routeService.CompleteRouteStop(uint(stopID), notes)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, stop)
}