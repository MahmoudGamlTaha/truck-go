import { apiService } from './apiService';
import { API_CONFIG, HTTP_METHODS } from '../config/api';

class UserService {
    async getUsers() {
        return apiService.request(API_CONFIG.ENDPOINTS.USERS);
    }

    async getDrivers() {
        return apiService.request(API_CONFIG.ENDPOINTS.DRIVERS);
    }

    async createUser(userData) {
        return apiService.request(API_CONFIG.ENDPOINTS.USERS, {
            method: HTTP_METHODS.POST,
            body: userData
        });
    }

    async updateUser(id, userData) {
        return apiService.request(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, {
            method: HTTP_METHODS.PUT,
            body: userData
        });
    }

    async deleteUser(id) {
        return apiService.request(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, {
            method: HTTP_METHODS.DELETE
        });
    }
}

export const userService = new UserService();
