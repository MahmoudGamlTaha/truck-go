package middleware

import (
	"net/http"
	"strings"
	"truck-management/internal/models"
	"truck-management/internal/utils"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		bearerToken := strings.Split(authHeader, " ")
		if len(bearerToken) != 2 || bearerToken[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization format"})
			c.Abort()
			return
		}

		claims, err := utils.ValidateJWT(bearerToken[1])
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("company_id", claims.CompanyID)
		c.Set("role", claims.Role)
		c.Next()
	}
}

func TenantMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		companyID, exists := c.Get("company_id")
		if !exists || companyID == nil {
			c.JSON(http.StatusForbidden, gin.H{"error": "Company access required"})
			c.Abort()
			return
		}
		c.Next()
	}
}

func ModeratorMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "Role not found"})
			c.Abort()
			return
		}

		userRole := role.(models.UserRole)
		if userRole != models.RoleAdmin && userRole != models.RoleAssignee {
			c.JSON(http.StatusForbidden, gin.H{"error": "Admin or Assignee access required"})
			c.Abort()
			return
		}
		c.Next()
	}
}

func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "Role not found"})
			c.Abort()
			return
		}

		userRole := role.(models.UserRole)
		if userRole != models.RoleAdmin {
			c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
			c.Abort()
			return
		}
		c.Next()
	}
}

func DriverMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "Role not found"})
			c.Abort()
			return
		}

		userRole := role.(models.UserRole)
		if userRole != models.RoleDriver {
			c.JSON(http.StatusForbidden, gin.H{"error": "Driver access required"})
			c.Abort()
			return
		}
		c.Next()
	}
}

func DriverDataMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "Role not found"})
			c.Abort()
			return
		}

		userRole := role.(models.UserRole)
		userID, userIDExists := c.Get("user_id")
		
		// If user is driver, they can only see their own data
		if userRole == models.RoleDriver {
			if !userIDExists {
				c.JSON(http.StatusForbidden, gin.H{"error": "User ID not found"})
				c.Abort()
				return
			}
			c.Set("driver_filter", userID)
		}
		c.Next()
	}
}