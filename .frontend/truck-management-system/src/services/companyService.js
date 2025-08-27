import { apiService } from './apiService';
import { API_CONFIG, HTTP_METHODS } from '../config/api';

class CompanyService {
    async getCompanies() {
        return apiService.request(API_CONFIG.ENDPOINTS.COMPANIES);
    }

    async createCompany(companyData) {
        return apiService.request(API_CONFIG.ENDPOINTS.COMPANIES, {
            method: HTTP_METHODS.POST,
            body: companyData
        });
    }

    async updateCompany(id, companyData) {
        return apiService.request(`${API_CONFIG.ENDPOINTS.COMPANIES}/${id}`, {
            method: HTTP_METHODS.PUT,
            body: companyData
        });
    }
}

export const companyService = new CompanyService();
