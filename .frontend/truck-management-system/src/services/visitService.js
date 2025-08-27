import { apiService } from './apiService';
import { API_CONFIG, HTTP_METHODS } from '../config/api';

class VisitService {
    async getVisits() {
        return apiService.request(API_CONFIG.ENDPOINTS.VISITS);
    }

    async createVisit(visitData) {
        return apiService.request(API_CONFIG.ENDPOINTS.VISITS, {
            method: HTTP_METHODS.POST,
            body: visitData
        });
    }

    async updateVisit(id, visitData) {
        return apiService.request(`${API_CONFIG.ENDPOINTS.VISITS}/${id}`, {
            method: HTTP_METHODS.PUT,
            body: visitData
        });
    }
}

export const visitService = new VisitService();
