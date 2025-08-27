import { apiService } from './apiService';
import { API_CONFIG, HTTP_METHODS } from '../config/api';

class RequestService {
    async getRequests() {
        return apiService.request(API_CONFIG.ENDPOINTS.REQUESTS);
    }

    async acceptRequest(id) {
        return apiService.request(API_CONFIG.ENDPOINTS.REQUEST_ACCEPT, {
            method: HTTP_METHODS.POST,
            params: { id }
        });
    }

    async terminateRequest(id) {
        return apiService.request(API_CONFIG.ENDPOINTS.REQUEST_TERMINATE, {
            method: HTTP_METHODS.POST,
            params: { id }
        });
    }

    async createRequest(requestData) {
        return apiService.request(API_CONFIG.ENDPOINTS.REQUESTS, {
            method: HTTP_METHODS.POST,
            body: requestData
        });
    }
}

export const requestService = new RequestService();
