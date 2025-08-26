package handlers

import (
	"log"
	"net/http"
	"strconv"
	ws "truck-management/internal/websocket"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow connections from any origin
	},
}

type WebSocketHandler struct {
	hub *ws.Hub
}

func NewWebSocketHandler(hub *ws.Hub) *WebSocketHandler {
	return &WebSocketHandler{hub: hub}
}

// HandleWebSocket godoc
// @Summary WebSocket connection
// @Description Establish WebSocket connection for real-time updates
// @Tags websocket
// @Success 101 "Switching Protocols"
// @Security BearerAuth
// @Router /ws [get]
func (h *WebSocketHandler) HandleWebSocket(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("WebSocket upgrade error: %v", err)
		return
	}

	// Get company ID from query or header
	companyIDStr := c.Query("company_id")
	if companyIDStr == "" {
		log.Println("Missing company_id in WebSocket connection")
		conn.Close()
		return
	}

	companyID, err := strconv.ParseUint(companyIDStr, 10, 32)
	if err != nil {
		log.Printf("Invalid company_id: %v", err)
		conn.Close()
		return
	}

	client := &ws.Client{
		Hub:       h.hub,
		Conn:      conn,
		Send:      make(chan ws.Message, 256),
		CompanyID: uint(companyID),
	}

	h.hub.Register(client)

	go client.WritePump()
	go client.ReadPump()
}
