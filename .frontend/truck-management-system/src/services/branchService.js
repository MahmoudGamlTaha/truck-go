import { apiService } from './apiService';
import { API_CONFIG, HTTP_METHODS } from '../config/api';

class BranchService {
    async getBranches() {
        return apiService.request(API_CONFIG.ENDPOINTS.BRANCHES);
    }

    async createBranch(branchData) {
        return apiService.request(API_CONFIG.ENDPOINTS.BRANCHES, {
            method: HTTP_METHODS.POST,
            body: branchData
        });
    }

    async updateBranch(id, branchData) {
        return apiService.request(`${API_CONFIG.ENDPOINTS.BRANCHES}/${id}`, {
            method: HTTP_METHODS.PUT,
            body: branchData
        });
    }

    async deleteBranch(id) {
        return apiService.request(`${API_CONFIG.ENDPOINTS.BRANCHES}/${id}`, {
            method: HTTP_METHODS.DELETE
        });
    }
}

export const branchService = new BranchService();
