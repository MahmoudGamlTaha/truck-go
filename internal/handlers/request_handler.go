package handlers

import (
	"net/http"
	"strconv"
	"truck-management/internal/models"
	"truck-management/internal/services"

	"github.com/gin-gonic/gin"
)

type RequestHandler struct {
	requestService *services.RequestService
}

func NewRequestHandler(requestService *services.RequestService) *RequestHandler {
	return &RequestHandler{requestService: requestService}
}

// CreateRequest godoc
// @Summary Create a new request
// @Description Submit a new request (truck assignment, maintenance, etc.)
// @Tags requests
// @Accept json
// @Produce json
// @Param request body models.CreateRequestRequest true "Request data"
// @Success 201 {object} models.Request
// @Failure 400 {object} map[string]string
// @Security BearerAuth
// @Router /requests [post]
func (h *RequestHandler) CreateRequest(c *gin.Context) {
	userID := c.MustGet("user_id").(uint)
	companyID := c.MustGet("company_id").(uint)
	
	var req models.CreateRequestRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	request, err := h.requestService.CreateRequest(userID, companyID, req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, request)
}

// GetRequests godoc
// @Summary Get requests
// @Description Get all requests for the company
// @Tags requests
// @Produce json
// @Success 200 {array} models.Request
// @Security BearerAuth
// @Router /requests [get]
func (h *RequestHandler) GetRequests(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	
	requests, err := h.requestService.GetRequests(companyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, requests)
}

// AcceptRequest godoc
// @Summary Accept a request
// @Description Accept a pending request (assignee only)
// @Tags requests
// @Param id path int true "Request ID"
// @Success 200 {object} models.Request
// @Failure 403 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /requests/{id}/accept [put]
func (h *RequestHandler) AcceptRequest(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	assigneeID := c.MustGet("user_id").(uint)
	role := c.MustGet("role").(models.UserRole)
	
	if role != models.RoleAdmin && role != models.RoleAssignee {
		c.JSON(http.StatusForbidden, gin.H{"error": "Admin or Assignee access required"})
		return
	}
	
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	request, err := h.requestService.AcceptRequest(uint(id), companyID, assigneeID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, request)
}

// TerminateRequest godoc
// @Summary Terminate a request
// @Description Terminate a request with a reason (assignee only)
// @Tags requests
// @Accept json
// @Param id path int true "Request ID"
// @Param request body models.TerminateRequestRequest true "Termination reason"
// @Success 200 {object} models.Request
// @Failure 400 {object} map[string]string
// @Failure 403 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /requests/{id}/terminate [put]
func (h *RequestHandler) TerminateRequest(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	assigneeID := c.MustGet("user_id").(uint)
	role := c.MustGet("role").(models.UserRole)
	
	if role != models.RoleAdmin && role != models.RoleAssignee {
		c.JSON(http.StatusForbidden, gin.H{"error": "Admin or Assignee access required"})
		return
	}
	
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	var req models.TerminateRequestRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	request, err := h.requestService.TerminateRequest(uint(id), companyID, assigneeID, req.Reason)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, request)
}