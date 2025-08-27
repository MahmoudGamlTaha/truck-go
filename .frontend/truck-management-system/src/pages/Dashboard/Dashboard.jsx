import React, { useState } from 'react';
import { Truck, Users, Route, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { CompanyForm } from '../../components/forms/CompanyForm';

export const Dashboard = () => {
  const { user, company, subscription, isAdmin, isAssignee, isDriver, isVisitor } = useAuth();
  const [companyCreated, setCompanyCreated] = useState(false);

  // Mock data for dashboard
  const stats = {
    totalTrucks: 18,
    activeTrucks: 15,
    totalDrivers: 42,
    activeRoutes: 8,
    pendingCargo: 23,
    completedDeliveries: 156
  };

  const recentActivity = [
    { id: 1, type: 'truck', message: 'Truck TRK-001 completed route to Downtown', time: '2 hours ago' },
    { id: 2, type: 'driver', message: 'New driver John Smith registered', time: '4 hours ago' },
    { id: 3, type: 'cargo', message: 'Urgent cargo assigned to Truck TRK-003', time: '6 hours ago' },
    { id: 4, type: 'route', message: 'Route "City Center Loop" updated', time: '1 day ago' }
  ];

  const alerts = [
    { id: 1, type: 'warning', message: 'Truck TRK-005 requires maintenance', priority: 'high' },
    { id: 2, type: 'info', message: '3 drivers approaching shift end', priority: 'medium' },
    { id: 3, type: 'warning', message: 'Route delays on Highway 101', priority: 'high' }
  ];

  // If user is a visitor, show the company creation form
  if (isVisitor && !companyCreated) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome to TruckFlow, {user?.first_name}!</h1>
          <p className="text-muted-foreground">One more step to complete your registration</p>
        </div>
        
        <CompanyForm 
          onSuccess={(companyData) => {
            setCompanyCreated(true);
          }}
        />
      </div>
    );
  }
  
  if (isDriver) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.first_name}!</h1>
          <p className="text-muted-foreground">Here's your daily overview</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Truck</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">TRK-003</div>
              <p className="text-xs text-muted-foreground">
                Status: <Badge variant="secondary">Online</Badge>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
              <Route className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                1 in progress, 1 pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deliveries Today</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                3 completed, 2 pending
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Downtown Delivery Route</p>
                  <p className="text-sm text-muted-foreground">5 stops • Est. 4 hours</p>
                </div>
                <Badge>In Progress</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Warehouse Pickup</p>
                  <p className="text-sm text-muted-foreground">2 stops • Est. 2 hours</p>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.first_name}! Here's what's happening with your fleet.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trucks</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTrucks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeTrucks} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drivers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDrivers}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRoutes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingCargo} pending cargo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deliveries</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your fleet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Notifications</CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                    alert.priority === 'high' ? 'text-red-500' : 'text-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                    <Badge variant={alert.priority === 'high' ? 'destructive' : 'secondary'} className="mt-1">
                      {alert.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Info */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Subscription Status</CardTitle>
            <CardDescription>Your current plan and usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium">Current Plan</p>
                <p className="text-2xl font-bold capitalize">{subscription?.plan}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Trucks Used</p>
                <p className="text-2xl font-bold">
                  {stats.totalTrucks} / {subscription?.features?.maxTrucks === -1 ? '∞' : subscription?.features?.maxTrucks}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Drivers Used</p>
                <p className="text-2xl font-bold">
                  {stats.totalDrivers} / {subscription?.features?.maxDrivers === -1 ? '∞' : subscription?.features?.maxDrivers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

