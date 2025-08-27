// Error handling utilities for API responses and application errors

export class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

export class ValidationError extends Error {
    constructor(message, field = null) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
    }
}

export class NetworkError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NetworkError';
    }
}

// Error handler for API responses
export const handleApiError = (error) => {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return new NetworkError('Network connection failed. Please check your internet connection.');
    }

    if (error.status) {
        switch (error.status) {
            case 400:
                return new ValidationError(error.message || 'Invalid request data');
            case 401:
                return new ApiError('Authentication required. Please log in again.', 401);
            case 403:
                return new ApiError('Access denied. You do not have permission to perform this action.', 403);
            case 404:
                return new ApiError('Resource not found.', 404);
            case 409:
                return new ValidationError('Conflict: Resource already exists or is in use.');
            case 422:
                return new ValidationError(error.message || 'Validation failed');
            case 500:
                return new ApiError('Server error. Please try again later.', 500);
            case 503:
                return new ApiError('Service temporarily unavailable. Please try again later.', 503);
            default:
                return new ApiError(error.message || 'An unexpected error occurred', error.status);
        }
    }

    return new ApiError(error.message || 'An unexpected error occurred');
};

// Global error handler for unhandled promise rejections
export const setupGlobalErrorHandler = () => {
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        
        // You can add global error reporting here
        // For example, send to error tracking service like Sentry
        
        // Prevent the default browser error handling
        event.preventDefault();
    });

    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        
        // You can add global error reporting here
    });
};

// Error notification helper
export const showErrorNotification = (error) => {
    const message = error.message || 'An unexpected error occurred';
    
    // You can integrate with your notification system here
    // For now, we'll use a simple alert (replace with your notification library)
    console.error('Error:', message);
    
    // Example integration with react-hot-toast or similar:
    // toast.error(message);
    
    return message;
};

// Validation helpers
export const validateRequired = (value, fieldName) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
        throw new ValidationError(`${fieldName} is required`);
    }
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ValidationError('Please enter a valid email address');
    }
};

export const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(phone)) {
        throw new ValidationError('Please enter a valid phone number');
    }
};

export const validateLicensePlate = (licensePlate) => {
    if (!licensePlate || licensePlate.length < 3) {
        throw new ValidationError('License plate must be at least 3 characters long');
    }
};

// Retry mechanism for failed API calls
export const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await apiCall();
        } catch (error) {
            lastError = error;
            
            // Don't retry on client errors (4xx)
            if (error.status && error.status >= 400 && error.status < 500) {
                throw error;
            }
            
            if (attempt < maxRetries) {
                console.log(`API call failed, retrying in ${delay}ms... (attempt ${attempt}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            }
        }
    }
    
    throw lastError;
};

// Safe async wrapper that handles errors gracefully
export const safeAsync = (asyncFn) => {
    return async (...args) => {
        try {
            return await asyncFn(...args);
        } catch (error) {
            const handledError = handleApiError(error);
            showErrorNotification(handledError);
            throw handledError;
        }
    };
};

// Form validation helper
export const validateForm = (data, rules) => {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
        const rule = rules[field];
        const value = data[field];
        
        try {
            if (rule.required) {
                validateRequired(value, rule.label || field);
            }
            
            if (value && rule.type === 'email') {
                validateEmail(value);
            }
            
            if (value && rule.type === 'phone') {
                validatePhone(value);
            }
            
            if (value && rule.minLength && value.length < rule.minLength) {
                throw new ValidationError(`${rule.label || field} must be at least ${rule.minLength} characters long`);
            }
            
            if (value && rule.maxLength && value.length > rule.maxLength) {
                throw new ValidationError(`${rule.label || field} must be no more than ${rule.maxLength} characters long`);
            }
            
            if (rule.custom && typeof rule.custom === 'function') {
                rule.custom(value);
            }
        } catch (error) {
            errors[field] = error.message;
        }
    });
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

