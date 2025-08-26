package utils

import (
	"errors"
	"os"
	"time"
	"truck-management/internal/models"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID    uint             `json:"user_id"`
	CompanyID *uint            `json:"company_id"`
	Role      models.UserRole  `json:"role"`
	jwt.RegisteredClaims
}

func getJWTSecret() string {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "your-super-secret-jwt-key-change-this-in-production"
	}
	return secret
}

func GenerateJWT(user models.User) (string, error) {
	claims := Claims{
		UserID:    user.ID,
		CompanyID: user.CompanyID,
		Role:      user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(getJWTSecret()))
}

func ValidateJWT(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(getJWTSecret()), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}