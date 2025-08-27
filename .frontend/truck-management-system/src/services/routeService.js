import { apiService } from './apiService';
import { API_CONFIG, HTTP_METHODS } from '../config/api';

class RouteService {
    async getRoutes() {
        return apiService.request(API_CONFIG.ENDPOINTS.ROUTES);
    }

    async approveRoute(id) {
        return apiService.request(API_CONFIG.ENDPOINTS.ROUTE_APPROVE, {
            method: HTTP_METHODS.POST,
            params: { id }
        });
    }

    async getRouteStops(id) {
        return apiService.request(API_CONFIG.ENDPOINTS.ROUTE_STOPS, {
            params: { id }
        });
    }

    async completeRouteStop(id) {
        return apiService.request(API_CONFIG.ENDPOINTS.ROUTE_STOP_COMPLETE, {
            method: HTTP_METHODS.POST,
            params: { id }
        });
    }

    async createRoute(routeData) {
        return apiService.request(API_CONFIG.ENDPOINTS.ROUTES, {
            method: HTTP_METHODS.POST,
            body: routeData
        });
    }

    async updateRoute(id, routeData) {
        return apiService.request(`${API_CONFIG.ENDPOINTS.ROUTES}/${id}`, {
            method: HTTP_METHODS.PUT,
            body: routeData
        });
    }

    async deleteRoute(id) {
        return apiService.request(`${API_CONFIG.ENDPOINTS.ROUTES}/${id}`, {
            method: HTTP_METHODS.DELETE
        });
    }
}

export const routeService = new RouteService();
