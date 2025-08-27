import { apiService } from './apiService';
import { API_CONFIG, HTTP_METHODS } from '../config/api';

class TruckService {
    async getTrucks() {
        return apiService.request(API_CONFIG.ENDPOINTS.TRUCKS);
    }

    async getOnlineTrucks() {
        return apiService.request(API_CONFIG.ENDPOINTS.TRUCKS_ONLINE);
    }

    async getTruckLocation(id) {
        return apiService.request(API_CONFIG.ENDPOINTS.TRUCK_LOCATION, {
            params: { id }
        });
    }

    async approveTruck(id) {
        return apiService.request(API_CONFIG.ENDPOINTS.TRUCK_APPROVE, {
            method: HTTP_METHODS.POST,
            params: { id }
        });
    }

    async getMyTruck() {
        return apiService.request(API_CONFIG.ENDPOINTS.MY_TRUCK);
    }

    async createTruck(truckData) {
        return apiService.request(API_CONFIG.ENDPOINTS.TRUCKS, {
            method: HTTP_METHODS.POST,
            body: truckData
        });
    }

    async updateTruck(id, truckData) {
        return apiService.request(`${API_CONFIG.ENDPOINTS.TRUCKS}/${id}`, {
            method: HTTP_METHODS.PUT,
            body: truckData
        });
    }

    async deleteTruck(id) {
        return apiService.request(`${API_CONFIG.ENDPOINTS.TRUCKS}/${id}`, {
            method: HTTP_METHODS.DELETE
        });
    }
}

export const truckService = new TruckService();
