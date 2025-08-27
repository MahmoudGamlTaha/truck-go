// API Configuration for TruckFlow Backend
export const API_CONFIG = {
    BASE_URL: 'http://localhost:8080/api/v1',
    ENDPOINTS: {
        // Authentication
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        
        // Companies
        COMPANIES: '/companies',
        
        // Users
        USERS: '/users',
        DRIVERS: '/users/drivers',
        
        // Trucks
        TRUCKS: '/trucks',
        TRUCKS_ONLINE: '/trucks/online',
        TRUCK_LOCATION: '/trucks/{id}/location',
        TRUCK_APPROVE: '/trucks/{id}/approve',
        MY_TRUCK: '/trucks/my-truck',
        
        // Routes
        ROUTES: '/routes',
        ROUTE_APPROVE: '/routes/{id}/approve',
        ROUTE_STOPS: '/routes/{id}/stops',
        ROUTE_STOP_COMPLETE: '/route-stops/{id}/complete',
        
        // Cargo
        CARGO: '/cargo',
        CARGO_UNASSIGNED: '/cargo/unassigned',
        CARGO_ASSIGN: '/cargo/{id}/assign',
        CARGO_UNASSIGN: '/cargo/{id}/unassign',
        CARGO_EVENTS: '/cargo/{id}/events',
        CARGO_LOCATION: '/cargo/{id}/location',
        CARGO_TRACK: '/cargo/track/{tracking_number}',
        TRUCK_CARGO: '/trucks/{truck_id}/cargo',
        
        // Visits
        VISITS: '/visits',
        
        // Tasks
        TASKS: '/tasks',
        TASK_COMPLETE: '/tasks/{id}/complete',
        
        // Requests
        REQUESTS: '/requests',
        REQUEST_ACCEPT: '/requests/{id}/accept',
        REQUEST_TERMINATE: '/requests/{id}/terminate',
        
        // Branches
        BRANCHES: '/branches',
        
        // WebSocket
        WEBSOCKET: '/ws'
    }
};

// Helper function to build full URL
export const buildUrl = (endpoint, params = {}) => {
    let url = API_CONFIG.BASE_URL + endpoint;
    
    // Replace path parameters
    Object.keys(params).forEach(key => {
        url = url.replace(`{${key}}`, params[key]);
    });
    
    return url;
};

// HTTP Methods
export const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
};

// Default headers
export const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

// API Response status codes
export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

