import { apiService } from './apiService';
import { API_CONFIG, HTTP_METHODS } from '../config/api';

class TaskService {
    async getTasks() {
        return apiService.request(API_CONFIG.ENDPOINTS.TASKS);
    }

    async completeTask(id) {
        return apiService.request(API_CONFIG.ENDPOINTS.TASK_COMPLETE, {
            method: HTTP_METHODS.POST,
            params: { id }
        });
    }

    async createTask(taskData) {
        return apiService.request(API_CONFIG.ENDPOINTS.TASKS, {
            method: HTTP_METHODS.POST,
            body: taskData
        });
    }

    async updateTask(id, taskData) {
        return apiService.request(`${API_CONFIG.ENDPOINTS.TASKS}/${id}`, {
            method: HTTP_METHODS.PUT,
            body: taskData
        });
    }
}

export const taskService = new TaskService();
