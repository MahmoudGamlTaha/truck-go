package handlers

import (
	"net/http"
	"strconv"
	"truck-management/internal/models"
	"truck-management/internal/services"

	"github.com/gin-gonic/gin"
)

type VisitHandler struct {
	visitService *services.VisitService
}

func NewVisitHandler(visitService *services.VisitService) *VisitHandler {
	return &VisitHandler{visitService: visitService}
}

// CreateVisit godoc
// @Summary Create a new visit
// @Description Create a new customer visit
// @Tags visits
// @Accept json
// @Produce json
// @Param request body models.CreateVisitRequest true "Visit data"
// @Success 201 {object} models.Visit
// @Failure 400 {object} map[string]string
// @Security BearerAuth
// @Router /visits [post]
func (h *VisitHandler) CreateVisit(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	
	var req models.CreateVisitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	visit, err := h.visitService.CreateVisit(companyID, req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, visit)
}

// GetVisits godoc
// @Summary Get visits
// @Description Get all visits for the company
// @Tags visits
// @Produce json
// @Success 200 {array} models.Visit
// @Security BearerAuth
// @Router /visits [get]
func (h *VisitHandler) GetVisits(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	
	visits, err := h.visitService.GetVisits(companyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, visits)
}

// GetVisit godoc
// @Summary Get a visit by ID
// @Description Retrieve a specific visit by its ID
// @Tags visits
// @Produce json
// @Param id path int true "Visit ID"
// @Success 200 {object} models.Visit
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /visits/{id} [get]
func (h *VisitHandler) GetVisit(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	visit, err := h.visitService.GetVisit(uint(id), companyID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Visit not found"})
		return
	}

	c.JSON(http.StatusOK, visit)
}

// UpdateVisit godoc
// @Summary Update visit status
// @Description Update the status of a visit
// @Tags visits
// @Accept json
// @Produce json
// @Param id path int true "Visit ID"
// @Param status query string true "New status" Enums(pending,in_progress,completed,cancelled)
// @Success 200 {object} models.Visit
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /visits/{id} [put]
func (h *VisitHandler) UpdateVisit(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	status := models.VisitStatus(c.Query("status"))
	
	if status == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Status is required"})
		return
	}

	visit, err := h.visitService.UpdateVisit(uint(id), companyID, status)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, visit)
}