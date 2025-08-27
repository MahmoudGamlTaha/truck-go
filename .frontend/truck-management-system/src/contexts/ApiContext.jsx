import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { websocketService } from '../services/websocketService';
import { handleApiError, setupGlobalErrorHandler } from '../utils/errorHandler';

const ApiContext = createContext();

export const useApiContext = () => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error('useApiContext must be used within an ApiProvider');
    }
    return context;
};

export const ApiProvider = ({ children }) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [wsConnected, setWsConnected] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Setup global error handling
        setupGlobalErrorHandler();

        // Monitor online/offline status
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Setup WebSocket event listeners
        websocketService.on('connected', () => {
            setWsConnected(true);
            console.log('WebSocket connected');
        });

        websocketService.on('disconnected', () => {
            setWsConnected(false);
            console.log('WebSocket disconnected');
        });

        websocketService.on('notification', (notification) => {
            addNotification(notification);
        });

        websocketService.on('alert', (alert) => {
            addNotification({
                ...alert,
                type: 'alert',
                priority: 'high'
            });
        });

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            websocketService.disconnect();
        };
    }, []);

    // Add notification to the list
    const addNotification = (notification) => {
        const newNotification = {
            id: Date.now() + Math.random(),
            timestamp: new Date(),
            ...notification
        };
        
        setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50 notifications
    };

    // Remove notification
    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // Clear all notifications
    const clearNotifications = () => {
        setNotifications([]);
    };

    // API call wrapper with error handling and offline support
    const apiCall = async (apiFunction, ...args) => {
        if (!isOnline) {
            throw new Error('No internet connection. Please check your network and try again.');
        }

        try {
            return await apiFunction(...args);
        } catch (error) {
            const handledError = handleApiError(error);
            
            // Add error notification
            addNotification({
                type: 'error',
                title: 'API Error',
                message: handledError.message,
                priority: 'high'
            });
            
            throw handledError;
        }
    };

    // Connect to WebSocket with authentication
    const connectWebSocket = (token) => {
        if (token && isOnline) {
            websocketService.connect(token);
        }
    };

    // Disconnect WebSocket
    const disconnectWebSocket = () => {
        websocketService.disconnect();
        setWsConnected(false);
    };

    // Subscribe to real-time updates
    const subscribeToUpdates = (type, id) => {
        switch (type) {
            case 'truck':
                websocketService.subscribeTruckLocation(id);
                break;
            case 'route':
                websocketService.subscribeRouteUpdates(id);
                break;
            case 'cargo':
                websocketService.subscribeCargoUpdates(id);
                break;
            case 'fleet':
                websocketService.subscribeFleetUpdates();
                break;
            default:
                console.warn('Unknown subscription type:', type);
        }
    };

    // Unsubscribe from updates
    const unsubscribeFromUpdates = (type, id) => {
        switch (type) {
            case 'truck':
                websocketService.unsubscribeTruckLocation(id);
                break;
            // Add other unsubscribe methods as needed
            default:
                console.warn('Unknown unsubscription type:', type);
        }
    };

    // Batch API calls
    const batchApiCalls = async (calls) => {
        const results = await Promise.allSettled(
            calls.map(call => apiCall(call.fn, ...call.args))
        );
        
        return results.map((result, index) => ({
            ...calls[index],
            success: result.status === 'fulfilled',
            data: result.status === 'fulfilled' ? result.value : null,
            error: result.status === 'rejected' ? result.reason : null
        }));
    };

    // Cache management
    const [cache, setCache] = useState(new Map());
    
    const getCachedData = (key) => {
        const cached = cache.get(key);
        if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes cache
            return cached.data;
        }
        return null;
    };

    const setCachedData = (key, data) => {
        setCache(prev => new Map(prev).set(key, {
            data,
            timestamp: Date.now()
        }));
    };

    const clearCache = () => {
        setCache(new Map());
    };

    // API call with caching
    const cachedApiCall = async (key, apiFunction, ...args) => {
        const cached = getCachedData(key);
        if (cached) {
            return cached;
        }

        const result = await apiCall(apiFunction, ...args);
        setCachedData(key, result);
        return result;
    };

    const value = {
        // Connection status
        isOnline,
        wsConnected,
        
        // API methods
        apiCall,
        cachedApiCall,
        batchApiCalls,
        
        // WebSocket methods
        connectWebSocket,
        disconnectWebSocket,
        subscribeToUpdates,
        unsubscribeFromUpdates,
        
        // Notifications
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
        
        // Cache management
        getCachedData,
        setCachedData,
        clearCache,
        
        // Direct access to services
        apiService,
        websocketService
    };

    return (
        <ApiContext.Provider value={value}>
            {children}
        </ApiContext.Provider>
    );
};

