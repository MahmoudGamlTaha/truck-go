package handlers

import (
	"net/http"
	"strconv"
	"truck-management/internal/models"
	"truck-management/internal/services"

	"github.com/gin-gonic/gin"
)

type BranchHandler struct {
	branchService *services.BranchService
}

func NewBranchHandler(branchService *services.BranchService) *BranchHandler {
	return &BranchHandler{branchService: branchService}
}

// CreateBranch godoc
// @Summary Create a new branch
// @Description Create a new branch for the company (Admin only)
// @Tags branches
// @Accept json
// @Produce json
// @Param request body models.CreateBranchRequest true "Branch data"
// @Success 201 {object} models.Branch
// @Failure 400 {object} map[string]string
// @Security BearerAuth
// @Router /branches [post]
func (h *BranchHandler) CreateBranch(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	
	var req models.CreateBranchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	branch, err := h.branchService.CreateBranch(companyID, req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, branch)
}

// GetBranches godoc
// @Summary Get all branches
// @Description Get all branches for the company
// @Tags branches
// @Produce json
// @Success 200 {array} models.Branch
// @Security BearerAuth
// @Router /branches [get]
func (h *BranchHandler) GetBranches(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	
	branches, err := h.branchService.GetBranches(companyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, branches)
}

// GetBranch godoc
// @Summary Get a branch by ID
// @Description Retrieve a specific branch by its ID
// @Tags branches
// @Produce json
// @Param id path int true "Branch ID"
// @Success 200 {object} models.Branch
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /branches/{id} [get]
func (h *BranchHandler) GetBranch(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	branch, err := h.branchService.GetBranch(uint(id), companyID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Branch not found"})
		return
	}

	c.JSON(http.StatusOK, branch)
}

// UpdateBranch godoc
// @Summary Update a branch
// @Description Update branch information (Admin only)
// @Tags branches
// @Accept json
// @Produce json
// @Param id path int true "Branch ID"
// @Param request body models.UpdateBranchRequest true "Updated branch data"
// @Success 200 {object} models.Branch
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /branches/{id} [put]
func (h *BranchHandler) UpdateBranch(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	var req models.UpdateBranchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	branch, err := h.branchService.UpdateBranch(uint(id), companyID, req)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, branch)
}

// DeleteBranch godoc
// @Summary Delete a branch
// @Description Delete a branch (Admin only)
// @Tags branches
// @Param id path int true "Branch ID"
// @Success 204
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /branches/{id} [delete]
func (h *BranchHandler) DeleteBranch(c *gin.Context) {
	companyID := c.MustGet("company_id").(uint)
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	err := h.branchService.DeleteBranch(uint(id), companyID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}