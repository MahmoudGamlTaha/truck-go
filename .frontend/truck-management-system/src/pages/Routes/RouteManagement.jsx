import React, { useState } from 'react';
import { Route, Plus, Search, MapPin, Clock, Truck, User, Calendar, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '../../contexts/AuthContext';

export const RouteManagement = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Mock routes data
  const [routes, setRoutes] = useState([
    {
      id: 1,
      name: 'Downtown Delivery Circuit',
      origin: 'Main Depot',
      destination: 'Downtown Business District',
      distance: '45 km',
      estimated_duration: '2h 30m',
      status: 'active',
      truck_id: 1,
      truck_license: 'TRK-001',
      driver_id: 3,
      driver_name: 'Mike Driver',
      start_time: '2024-08-26T08:00:00',
      end_time: '2024-08-26T10:30:00',
      cargo_count: 3,
      priority: 'high',
      notes: 'Multiple stops in business district',
      waypoints: ['Warehouse A', 'Office Complex B', 'Shopping Center C']
    },
    {
      id: 2,
      name: 'North Branch Supply Run',
      origin: 'Main Depot',
      destination: 'North Branch Warehouse',
      distance: '78 km',
      estimated_duration: '1h 45m',
      status: 'completed',
      truck_id: 2,
      truck_license: 'TRK-002',
      driver_id: 4,
      driver_name: 'Sarah Wilson',
      start_time: '2024-08-25T14:00:00',
      end_time: '2024-08-25T15:45:00',
      cargo_count: 1,
      priority: 'medium',
      notes: 'Regular supply delivery',
      waypoints: ['Highway Rest Stop']
    },
    {
      id: 3,
      name: 'City Center Loop',
      origin: 'North Branch',
      destination: 'City Center',
      distance: '32 km',
      estimated_duration: '1h 15m',
      status: 'planned',
      truck_id: 5,
      truck_license: 'TRK-005',
      driver_id: null,
      driver_name: null,
      start_time: '2024-08-27T09:00:00',
      end_time: '2024-08-27T10:15:00',
      cargo_count: 2,
      priority: 'medium',
      notes: 'Awaiting driver assignment',
      waypoints: ['Mall Entrance', 'Office Tower']
    },
    {
      id: 4,
      name: 'Emergency Medical Supply',
      origin: 'Main Depot',
      destination: 'City Hospital',
      distance: '15 km',
      estimated_duration: '45m',
      status: 'in_progress',
      truck_id: 1,
      truck_license: 'TRK-001',
      driver_id: 3,
      driver_name: 'Mike Driver',
      start_time: '2024-08-26T11:00:00',
      end_time: '2024-08-26T11:45:00',
      cargo_count: 1,
      priority: 'urgent',
      notes: 'Priority medical supplies delivery',
      waypoints: []
    }
  ]);

  const [newRoute, setNewRoute] = useState({
    name: '',
    origin: '',
    destination: '',
    distance: '',
    estimated_duration: '',
    truck_id: '',
    driver_id: '',
    start_time: '',
    priority: 'medium',
    notes: '',
    waypoints: ''
  });

  // Filter routes based on search and filters
  const filteredRoutes = routes.filter(route => {
    const matchesSearch = 
      route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (route.driver_name && route.driver_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || route.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleAddRoute = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const route = {
        id: routes.length + 1,
        ...newRoute,
        status: 'planned',
        end_time: null, // Calculate based on start_time + duration
        cargo_count: 0,
        truck_license: newRoute.truck_id ? `TRK-00${newRoute.truck_id}` : null,
        driver_name: newRoute.driver_id ? 'Assigned Driver' : null,
        waypoints: newRoute.waypoints ? newRoute.waypoints.split(',').map(w => w.trim()) : []
      };
      
      setRoutes([...routes, route]);
      setNewRoute({
        name: '',
        origin: '',
        destination: '',
        distance: '',
        estimated_duration: '',
        truck_id: '',
        driver_id: '',
        start_time: '',
        priority: 'medium',
        notes: '',
        waypoints: ''
      });
      setShowAddRoute(false);
      setMessage('Route added successfully!');
    } catch (error) {
      setMessage('Failed to add route');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (routeId, newStatus) => {
    setRoutes(routes.map(route => 
      route.id === routeId 
        ? { ...route, status: newStatus }
        : route
    ));
    setMessage('Route status updated successfully!');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />Active</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'planned':
        return <Badge className="bg-gray-100 text-gray-800"><Calendar className="h-3 w-3 mr-1" />Planned</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800"><Truck className="h-3 w-3 mr-1" />In Progress</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Urgent</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-blue-100 text-blue-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const stats = {
    total: routes.length,
    active: routes.filter(r => r.status === 'active').length,
    completed: routes.filter(r => r.status === 'completed').length,
    planned: routes.filter(r => r.status === 'planned').length,
    in_progress: routes.filter(r => r.status === 'in_progress').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Route Planning</h1>
          <p className="text-muted-foreground">Plan and manage delivery routes and schedules</p>
        </div>
        <Dialog open={showAddRoute} onOpenChange={setShowAddRoute}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Route
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Route</DialogTitle>
              <DialogDescription>Plan a new delivery route</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddRoute} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="routeName">Route Name</Label>
                <Input
                  id="routeName"
                  value={newRoute.name}
                  onChange={(e) => setNewRoute(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Downtown Delivery Circuit"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Origin</Label>
                  <Input
                    id="origin"
                    value={newRoute.origin}
                    onChange={(e) => setNewRoute(prev => ({ ...prev, origin: e.target.value }))}
                    placeholder="Starting location"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    value={newRoute.destination}
                    onChange={(e) => setNewRoute(prev => ({ ...prev, destination: e.target.value }))}
                    placeholder="End location"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance</Label>
                  <Input
                    id="distance"
                    value={newRoute.distance}
                    onChange={(e) => setNewRoute(prev => ({ ...prev, distance: e.target.value }))}
                    placeholder="e.g., 45 km"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Estimated Duration</Label>
                  <Input
                    id="duration"
                    value={newRoute.estimated_duration}
                    onChange={(e) => setNewRoute(prev => ({ ...prev, estimated_duration: e.target.value }))}
                    placeholder="e.g., 2h 30m"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="truck">Assign Truck</Label>
                  <Select value={newRoute.truck_id} onValueChange={(value) => setNewRoute(prev => ({ ...prev, truck_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select truck" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">TRK-001 (Volvo FH16)</SelectItem>
                      <SelectItem value="2">TRK-002 (Mercedes Actros)</SelectItem>
                      <SelectItem value="5">TRK-005 (MAN TGX)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driver">Assign Driver</Label>
                  <Select value={newRoute.driver_id} onValueChange={(value) => setNewRoute(prev => ({ ...prev, driver_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">Mike Driver</SelectItem>
                      <SelectItem value="4">Sarah Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={newRoute.start_time}
                    onChange={(e) => setNewRoute(prev => ({ ...prev, start_time: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newRoute.priority} onValueChange={(value) => setNewRoute(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="waypoints">Waypoints (Optional)</Label>
                <Input
                  id="waypoints"
                  value={newRoute.waypoints}
                  onChange={(e) => setNewRoute(prev => ({ ...prev, waypoints: e.target.value }))}
                  placeholder="Comma-separated stops: Stop A, Stop B, Stop C"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={newRoute.notes}
                  onChange={(e) => setNewRoute(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional route information"
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Route'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddRoute(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Route Statistics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Route className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Routes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{stats.active}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">{stats.in_progress}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <div>
                <div className="text-2xl font-bold">{stats.planned}</div>
                <div className="text-sm text-muted-foreground">Planned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{stats.completed}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search routes by name, origin, destination, or driver..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Routes List */}
      <Card>
        <CardHeader>
          <CardTitle>Routes ({filteredRoutes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRoutes.map((route) => (
              <div key={route.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <Route className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{route.name}</h3>
                        <p className="text-muted-foreground">{route.origin} → {route.destination}</p>
                      </div>
                      <div className="flex space-x-2">
                        {getStatusBadge(route.status)}
                        {getPriorityBadge(route.priority)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>Distance: {route.distance}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Duration: {route.estimated_duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span>{route.truck_license || 'No truck assigned'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{route.driver_name || 'No driver assigned'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <span>Start: {new Date(route.start_time).toLocaleString()}</span>
                      {route.end_time && (
                        <span>End: {new Date(route.end_time).toLocaleString()}</span>
                      )}
                      <span>Cargo: {route.cargo_count} items</span>
                    </div>

                    {route.waypoints && route.waypoints.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium">Waypoints: </span>
                        <span className="text-muted-foreground">{route.waypoints.join(' → ')}</span>
                      </div>
                    )}

                    {route.notes && (
                      <p className="text-sm text-muted-foreground italic">{route.notes}</p>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Select value={route.status} onValueChange={(value) => handleStatusChange(route.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

