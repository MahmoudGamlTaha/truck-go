import { API_CONFIG } from '../config/api.js';

class WebSocketService {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 5000; // 5 seconds
        this.listeners = new Map();
        this.isConnected = false;
    }

    // Connect to WebSocket
    connect(token) {
        try {
            const wsUrl = `ws://localhost:8080${API_CONFIG.ENDPOINTS.WEBSOCKET}`;
            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                console.log('WebSocket connected');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                
                // Send authentication token
                if (token) {
                    this.send({
                        type: 'auth',
                        token: token
                    });
                }
                
                this.emit('connected');
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.isConnected = false;
                this.emit('disconnected');
                this.attemptReconnect(token);
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.emit('error', error);
            };

        } catch (error) {
            console.error('Failed to connect to WebSocket:', error);
        }
    }

    // Disconnect WebSocket
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
            this.isConnected = false;
        }
    }

    // Send message through WebSocket
    send(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket is not connected');
        }
    }

    // Handle incoming messages
    handleMessage(data) {
        const { type, payload } = data;
        
        switch (type) {
            case 'truck_location_update':
                this.emit('truckLocationUpdate', payload);
                break;
            case 'truck_status_update':
                this.emit('truckStatusUpdate', payload);
                break;
            case 'route_update':
                this.emit('routeUpdate', payload);
                break;
            case 'cargo_update':
                this.emit('cargoUpdate', payload);
                break;
            case 'driver_status_update':
                this.emit('driverStatusUpdate', payload);
                break;
            case 'alert':
                this.emit('alert', payload);
                break;
            case 'notification':
                this.emit('notification', payload);
                break;
            default:
                console.log('Unknown message type:', type);
        }
    }

    // Attempt to reconnect
    attemptReconnect(token) {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            
            setTimeout(() => {
                this.connect(token);
            }, this.reconnectInterval);
        } else {
            console.error('Max reconnection attempts reached');
            this.emit('maxReconnectAttemptsReached');
        }
    }

    // Event listener management
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in WebSocket event callback:', error);
                }
            });
        }
    }

    // Subscribe to truck location updates
    subscribeTruckLocation(truckId) {
        this.send({
            type: 'subscribe',
            channel: 'truck_location',
            truck_id: truckId
        });
    }

    // Unsubscribe from truck location updates
    unsubscribeTruckLocation(truckId) {
        this.send({
            type: 'unsubscribe',
            channel: 'truck_location',
            truck_id: truckId
        });
    }

    // Subscribe to route updates
    subscribeRouteUpdates(routeId) {
        this.send({
            type: 'subscribe',
            channel: 'route_updates',
            route_id: routeId
        });
    }

    // Subscribe to cargo updates
    subscribeCargoUpdates(cargoId) {
        this.send({
            type: 'subscribe',
            channel: 'cargo_updates',
            cargo_id: cargoId
        });
    }

    // Subscribe to fleet-wide updates
    subscribeFleetUpdates() {
        this.send({
            type: 'subscribe',
            channel: 'fleet_updates'
        });
    }

    // Get connection status
    getConnectionStatus() {
        return this.isConnected;
    }
}

// Create and export a singleton instance
export const websocketService = new WebSocketService();
export default websocketService;

