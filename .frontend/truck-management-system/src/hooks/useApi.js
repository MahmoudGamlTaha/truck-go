import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';

// Custom hook for API calls with loading and error states
export const useApi = (apiCall, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiCall(...args);
            setData(result);
            return result;
        } catch (err) {
            setError(err.message || 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    }, dependencies);

    return { data, loading, error, execute };
};

// Hook for fetching data on component mount
export const useFetch = (apiCall, dependencies = []) => {
    const { data, loading, error, execute } = useApi(apiCall, dependencies);

    useEffect(() => {
        execute();
    }, dependencies);

    return { data, loading, error, refetch: execute };
};

// Hook for authentication
export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on mount
        const token = localStorage.getItem('authToken');
        if (token) {
            apiService.setToken(token);
            // You might want to validate the token with the backend here
            setUser({ token }); // Simplified - in real app, decode token or fetch user data
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await apiService.login(credentials);
            const { token, user } = response;
            
            apiService.setToken(token);
            setUser(user);
            
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        apiService.setToken(null);
        setUser(null);
    };

    return {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
    };
};

// Hook for trucks
export const useTrucks = () => {
    const { data: trucks, loading, error, refetch } = useFetch(() => apiService.getTrucks());
    
    const createTruck = useCallback(async (truckData) => {
        const result = await apiService.createTruck(truckData);
        refetch(); // Refresh the list
        return result;
    }, [refetch]);

    const updateTruck = useCallback(async (id, truckData) => {
        const result = await apiService.updateTruck(id, truckData);
        refetch(); // Refresh the list
        return result;
    }, [refetch]);

    const deleteTruck = useCallback(async (id) => {
        const result = await apiService.deleteTruck(id);
        refetch(); // Refresh the list
        return result;
    }, [refetch]);

    return {
        trucks,
        loading,
        error,
        refetch,
        createTruck,
        updateTruck,
        deleteTruck
    };
};

// Hook for users/drivers
export const useUsers = () => {
    const { data: users, loading, error, refetch } = useFetch(() => apiService.getUsers());
    
    const createUser = useCallback(async (userData) => {
        const result = await apiService.createUser(userData);
        refetch();
        return result;
    }, [refetch]);

    const updateUser = useCallback(async (id, userData) => {
        const result = await apiService.updateUser(id, userData);
        refetch();
        return result;
    }, [refetch]);

    const deleteUser = useCallback(async (id) => {
        const result = await apiService.deleteUser(id);
        refetch();
        return result;
    }, [refetch]);

    return {
        users,
        loading,
        error,
        refetch,
        createUser,
        updateUser,
        deleteUser
    };
};

// Hook for routes
export const useRoutes = () => {
    const { data: routes, loading, error, refetch } = useFetch(() => apiService.getRoutes());
    
    const createRoute = useCallback(async (routeData) => {
        const result = await apiService.createRoute(routeData);
        refetch();
        return result;
    }, [refetch]);

    const updateRoute = useCallback(async (id, routeData) => {
        const result = await apiService.updateRoute(id, routeData);
        refetch();
        return result;
    }, [refetch]);

    const deleteRoute = useCallback(async (id) => {
        const result = await apiService.deleteRoute(id);
        refetch();
        return result;
    }, [refetch]);

    const approveRoute = useCallback(async (id) => {
        const result = await apiService.approveRoute(id);
        refetch();
        return result;
    }, [refetch]);

    return {
        routes,
        loading,
        error,
        refetch,
        createRoute,
        updateRoute,
        deleteRoute,
        approveRoute
    };
};

// Hook for cargo
export const useCargo = () => {
    const { data: cargo, loading, error, refetch } = useFetch(() => apiService.getCargo());
    
    const createCargo = useCallback(async (cargoData) => {
        const result = await apiService.createCargo(cargoData);
        refetch();
        return result;
    }, [refetch]);

    const updateCargo = useCallback(async (id, cargoData) => {
        const result = await apiService.updateCargo(id, cargoData);
        refetch();
        return result;
    }, [refetch]);

    const deleteCargo = useCallback(async (id) => {
        const result = await apiService.deleteCargo(id);
        refetch();
        return result;
    }, [refetch]);

    const assignCargo = useCallback(async (id, assignmentData) => {
        const result = await apiService.assignCargo(id, assignmentData);
        refetch();
        return result;
    }, [refetch]);

    const unassignCargo = useCallback(async (id) => {
        const result = await apiService.unassignCargo(id);
        refetch();
        return result;
    }, [refetch]);

    return {
        cargo,
        loading,
        error,
        refetch,
        createCargo,
        updateCargo,
        deleteCargo,
        assignCargo,
        unassignCargo
    };
};

// Hook for branches
export const useBranches = () => {
    const { data: branches, loading, error, refetch } = useFetch(() => apiService.getBranches());
    
    const createBranch = useCallback(async (branchData) => {
        const result = await apiService.createBranch(branchData);
        refetch();
        return result;
    }, [refetch]);

    const updateBranch = useCallback(async (id, branchData) => {
        const result = await apiService.updateBranch(id, branchData);
        refetch();
        return result;
    }, [refetch]);

    const deleteBranch = useCallback(async (id) => {
        const result = await apiService.deleteBranch(id);
        refetch();
        return result;
    }, [refetch]);

    return {
        branches,
        loading,
        error,
        refetch,
        createBranch,
        updateBranch,
        deleteBranch
    };
};

// Hook for real-time truck tracking
export const useTruckTracking = () => {
    const { data: onlineTrucks, loading, error, refetch } = useFetch(() => apiService.getOnlineTrucks());
    
    const getTruckLocation = useCallback(async (id) => {
        return await apiService.getTruckLocation(id);
    }, []);

    return {
        onlineTrucks,
        loading,
        error,
        refetch,
        getTruckLocation
    };
};

// Hook for requests
export const useRequests = () => {
    const { data: requests, loading, error, refetch } = useFetch(() => apiService.getRequests());
    
    const createRequest = useCallback(async (requestData) => {
        const result = await apiService.createRequest(requestData);
        refetch();
        return result;
    }, [refetch]);

    const acceptRequest = useCallback(async (id) => {
        const result = await apiService.acceptRequest(id);
        refetch();
        return result;
    }, [refetch]);

    const terminateRequest = useCallback(async (id) => {
        const result = await apiService.terminateRequest(id);
        refetch();
        return result;
    }, [refetch]);

    return {
        requests,
        loading,
        error,
        refetch,
        createRequest,
        acceptRequest,
        terminateRequest
    };
};

