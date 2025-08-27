// User and Authentication Types
export const UserRole = {
  ADMIN: 'admin',
  ASSIGNEE: 'assignee',
  DRIVER: 'driver',
  VISITOR: 'visitor'
};

export const TruckStatus = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  IN_USE: 'in_use',
  MAINTENANCE: 'maintenance'
};

export const RouteStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const VisitStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const RequestType = {
  TRUCK_ASSIGNMENT: 'truck_assignment',
  MAINTENANCE: 'maintenance',
  LEAVE: 'leave',
  OTHER: 'other'
};

export const RequestStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  TERMINATED: 'terminated'
};

export const CargoType = {
  GENERAL: 'general',
  FRAGILE: 'fragile',
  HAZARDOUS: 'hazardous',
  PERISHABLE: 'perishable',
  LIQUID: 'liquid',
  OVERSIZED: 'oversized'
};

export const CargoPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const CargoStatus = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Subscription Plans
export const SubscriptionPlan = {
  BASIC: 'basic',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise'
};

export const SubscriptionFeatures = {
  [SubscriptionPlan.BASIC]: {
    maxTrucks: 5,
    maxDrivers: 10,
    maxBranches: 1,
    realTimeTracking: false,
    advancedReports: false,
    apiAccess: false
  },
  [SubscriptionPlan.PROFESSIONAL]: {
    maxTrucks: 25,
    maxDrivers: 50,
    maxBranches: 5,
    realTimeTracking: true,
    advancedReports: true,
    apiAccess: false
  },
  [SubscriptionPlan.ENTERPRISE]: {
    maxTrucks: -1, // unlimited
    maxDrivers: -1, // unlimited
    maxBranches: -1, // unlimited
    realTimeTracking: true,
    advancedReports: true,
    apiAccess: true
  }
};

// Helper functions for type checking
export const isAdmin = (user) => user?.role === UserRole.ADMIN;
export const isAssignee = (user) => user?.role === UserRole.ASSIGNEE;
export const isDriver = (user) => user?.role === UserRole.DRIVER;

export const canManageUsers = (user) => isAdmin(user) || isAssignee(user);
export const canManageTrucks = (user) => isAdmin(user) || isAssignee(user);
export const canViewReports = (user) => isAdmin(user) || isAssignee(user);

// Navigation structure based on user roles
export const getNavigationItems = (user, subscription) => {
  const baseItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/app/dashboard' }
  ];

  if (isDriver(user)) {
    return [
      ...baseItems,
      { id: 'my-truck', label: 'My Truck', icon: 'Truck', path: '/app/my-truck' },
      { id: 'routes', label: 'My Routes', icon: 'Route', path: '/app/routes' },
      { id: 'cargo', label: 'My Cargo', icon: 'Package', path: '/app/cargo' },
      { id: 'profile', label: 'Profile', icon: 'User', path: '/app/profile' }
    ];
  }

  if (isAssignee(user) || isAdmin(user)) {
    const items = [
      ...baseItems,
      { id: 'fleet', label: 'Fleet Management', icon: 'Truck', path: '/app/fleet' },
      { id: 'drivers', label: 'Driver Management', icon: 'Users', path: '/app/drivers' },
      { id: 'routes', label: 'Route Planning', icon: 'Route', path: '/app/routes' },
      { id: 'cargo', label: 'Cargo Management', icon: 'Package', path: '/app/cargo' },
      { id: 'requests', label: 'Requests', icon: 'FileText', path: '/app/requests' }
    ];

    if (subscription?.plan !== SubscriptionPlan.BASIC) {
      items.push({ id: 'tracking', label: 'Live Tracking', icon: 'MapPin', path: '/app/tracking' });
    }

    if (subscription?.plan === SubscriptionPlan.ENTERPRISE || subscription?.plan === SubscriptionPlan.PROFESSIONAL) {
      items.push({ id: 'reports', label: 'Reports', icon: 'BarChart3', path: '/app/reports' });
    }

    if (isAdmin(user)) {
      items.push(
        { id: 'company', label: 'Company Settings', icon: 'Building', path: '/app/company' },
        { id: 'subscription', label: 'Subscription', icon: 'CreditCard', path: '/app/subscription' }
      );
    }

    return items;
  }

  return baseItems;
};

