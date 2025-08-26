package handlers

import (
	"net/http"
	"strconv"
	"truck-management/internal/models"
	"truck-management/internal/services"

	"github.com/gin-gonic/gin"
)

type CompanyHandler struct {
	companyService *services.CompanyService
}

func NewCompanyHandler(companyService *services.CompanyService) *CompanyHandler {
	return &CompanyHandler{companyService: companyService}
}

// CreateCompany godoc
// @Summary Create a new company
// @Description Create a new company for multi-tenant system
// @Tags companies
// @Accept json
// @Produce json
// @Param request body models.CreateCompanyRequest true "Company data"
// @Success 201 {object} models.Company
// @Failure 400 {object} map[string]string
// @Security BearerAuth
// @Router /companies [post]
func (h *CompanyHandler) CreateCompany(c *gin.Context) {
	var req models.CreateCompanyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	company, err := h.companyService.CreateCompany(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, company)
}

// GetCompanies godoc
// @Summary Get all companies
// @Description Retrieve all companies
// @Tags companies
// @Produce json
// @Success 200 {array} models.Company
// @Security BearerAuth
// @Router /companies [get]
func (h *CompanyHandler) GetCompanies(c *gin.Context) {
	companies, err := h.companyService.GetCompanies()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, companies)
}

// GetCompany godoc
// @Summary Get a company by ID
// @Description Retrieve a specific company by its ID
// @Tags companies
// @Produce json
// @Param id path int true "Company ID"
// @Success 200 {object} models.Company
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /companies/{id} [get]
func (h *CompanyHandler) GetCompany(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	company, err := h.companyService.GetCompany(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Company not found"})
		return
	}

	c.JSON(http.StatusOK, company)
}

// UpdateCompany godoc
// @Summary Update a company
// @Description Update company information
// @Tags companies
// @Accept json
// @Produce json
// @Param id path int true "Company ID"
// @Param request body models.UpdateCompanyRequest true "Updated company data"
// @Success 200 {object} models.Company
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /companies/{id} [put]
func (h *CompanyHandler) UpdateCompany(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	var req models.UpdateCompanyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	company, err := h.companyService.UpdateCompany(uint(id), req)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, company)
}

// DeleteCompany godoc
// @Summary Delete a company
// @Description Delete a company and all associated data
// @Tags companies
// @Param id path int true "Company ID"
// @Success 204
// @Failure 404 {object} map[string]string
// @Security BearerAuth
// @Router /companies/{id} [delete]
func (h *CompanyHandler) DeleteCompany(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	
	err := h.companyService.DeleteCompany(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}