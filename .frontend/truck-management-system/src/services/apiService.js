import { API_CONFIG, buildUrl, HTTP_METHODS, DEFAULT_HEADERS, STATUS_CODES } from '../config/api.js';

class ApiService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.token = localStorage.getItem('auth_token');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('auth_token', token);
        } else {
            localStorage.removeItem('auth_token');
        }
    }

    // Get authentication headers
    getAuthHeaders() {
        const headers = { ...DEFAULT_HEADERS };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        const url = buildUrl(endpoint, options.params);
        
        const config = {
            method: options.method || HTTP_METHODS.GET,
            headers: {
                ...this.getAuthHeaders(),
                ...options.headers
            }
        };

        if (options.body) {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Handle different response types
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }










}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;

