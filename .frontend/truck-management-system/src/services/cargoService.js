import { apiService } from './apiService';
import { API_CONFIG, HTTP_METHODS } from '../config/api';

class CargoService {
    async getCargo() {
        return apiService.request(API_CONFIG.ENDPOINTS.CARGO);
    }

    async getUnassignedCargo() {
        return apiService.request(API_CONFIG.ENDPOINTS.CARGO_UNASSIGNED);
    }

    async assignCargo(id, assignmentData) {
        return apiService.request(API_CONFIG.ENDPOINTS.CARGO_ASSIGN, {
            method: HTTP_METHODS.POST,
            params: { id },
            body: assignmentData
        });
    }

    async unassignCargo(id) {
        return apiService.request(API_CONFIG.ENDPOINTS.CARGO_UNASSIGN, {
            method: HTTP_METHODS.POST,
            params: { id }
        });
    }

    async getCargoEvents(id) {
        return apiService.request(API_CONFIG.ENDPOINTS.CARGO_EVENTS, {
            params: { id }
        });
    }

    async getCargoLocation(id) {
        return apiService.request(API_CONFIG.ENDPOINTS.CARGO_LOCATION, {
            params: { id }
        });
    }

    async trackCargo(trackingNumber) {
        return apiService.request(API_CONFIG.ENDPOINTS.CARGO_TRACK, {
            params: { tracking_number: trackingNumber }
        });
    }

    async getTruckCargo(truckId) {
        return apiService.request(API_CONFIG.ENDPOINTS.TRUCK_CARGO, {
            params: { truck_id: truckId }
        });
    }

    async createCargo(cargoData) {
        return apiService.request(API_CONFIG.ENDPOINTS.CARGO, {
            method: HTTP_METHODS.POST,
            body: cargoData
        });
    }

    async updateCargo(id, cargoData) {
        return apiService.request(`${API_CONFIG.ENDPOINTS.CARGO}/${id}`, {
            method: HTTP_METHODS.PUT,
            body: cargoData
        });
    }

    async deleteCargo(id) {
        return apiService.request(`${API_CONFIG.ENDPOINTS.CARGO}/${id}`, {
            method: HTTP_METHODS.DELETE
        });
    }
}

export const cargoService = new CargoService();
