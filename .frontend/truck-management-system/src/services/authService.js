import { apiService } from './apiService';
import { API_CONFIG, HTTP_METHODS } from '../config/api';

class AuthService {
    async login(credentials) {
        return apiService.request(API_CONFIG.ENDPOINTS.LOGIN, {
            method: HTTP_METHODS.POST,
            body: credentials
        });
    }

    async register(registrationData) {
        return apiService.request(API_CONFIG.ENDPOINTS.REGISTER, {
            method: HTTP_METHODS.POST,
            body: registrationData
        });
    }
}

export const authService = new AuthService();
