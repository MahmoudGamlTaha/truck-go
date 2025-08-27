import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  AlertTriangle, 
  Truck, 
  Route,
  Signal,
  Battery,
  Fuel,
  Thermometer,
  Shield,
  MessageCircle,
  RefreshCw,
  Filter,
  Search,
  Eye,
  Phone,
  Navigation2,
  Zap
} from 'lucide-react';

const RealTimeTracking = () => {
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock real-time truck data
  const [trucks, setTrucks] = useState([
    {
      id: 1,
      licensePlate: 'ABC-123',
      driver: 'John Smith',
      status: 'in_transit',
      location: {
        lat: 40.7128,
        lng: -74.0060,
        address: '123 Main St, New York, NY'
      },
      route: 'Route A - NYC to Boston',
      progress: 65,
      speed: 55,
      fuel: 78,
      temperature: 22,
      battery: 95,
      signal: 'strong',
      eta: '2:30 PM',
      lastUpdate: '2 min ago',
      alerts: [
        { type: 'warning', message: 'Speed limit exceeded', time: '5 min ago' }
      ],
      cargo: 'Electronics - High Value',
      geofence: 'within'
    },
    {
      id: 2,
      licensePlate: 'XYZ-789',
      driver: 'Sarah Johnson',
      status: 'idle',
      location: {
        lat: 42.3601,
        lng: -71.0589,
        address: '456 Oak Ave, Boston, MA'
      },
      route: 'Route B - Boston to Philadelphia',
      progress: 0,
      speed: 0,
      fuel: 45,
      temperature: 18,
      battery: 88,
      signal: 'good',
      eta: 'Not started',
      lastUpdate: '1 min ago',
      alerts: [
        { type: 'info', message: 'Low fuel warning', time: '10 min ago' }
      ],
      cargo: 'Food Products - Refrigerated',
      geofence: 'within'
    },
    {
      id: 3,
      licensePlate: 'DEF-456',
      driver: 'Mike Wilson',
      status: 'loading',
      location: {
        lat: 39.9526,
        lng: -75.1652,
        address: '789 Pine St, Philadelphia, PA'
      },
      route: 'Route C - Philadelphia to Washington',
      progress: 0,
      speed: 0,
      fuel: 92,
      temperature: 20,
      battery: 76,
      signal: 'excellent',
      eta: '4:00 PM',
      lastUpdate: '30 sec ago',
      alerts: [],
      cargo: 'Medical Supplies - Urgent',
      geofence: 'within'
    },
    {
      id: 4,
      licensePlate: 'GHI-321',
      driver: 'Lisa Brown',
      status: 'offline',
      location: {
        lat: 38.9072,
        lng: -77.0369,
        address: '321 Elm St, Washington, DC'
      },
      route: 'Route D - Washington to Atlanta',
      progress: 0,
      speed: 0,
      fuel: 0,
      temperature: 0,
      battery: 0,
      signal: 'none',
      eta: 'Unknown',
      lastUpdate: '2 hours ago',
      alerts: [
        { type: 'error', message: 'Vehicle offline', time: '2 hours ago' }
      ],
      cargo: 'Construction Materials',
      geofence: 'unknown'
    }
  ]);

  const statusConfig = {
    in_transit: { label: 'In Transit', color: 'bg-green-500', icon: Navigation },
    idle: { label: 'Idle', color: 'bg-yellow-500', icon: Clock },
    loading: { label: 'Loading', color: 'bg-blue-500', icon: Truck },
    offline: { label: 'Offline', color: 'bg-red-500', icon: AlertTriangle }
  };

  const signalConfig = {
    excellent: { label: 'Excellent', color: 'text-green-600', bars: 4 },
    strong: { label: 'Strong', color: 'text-green-500', bars: 3 },
    good: { label: 'Good', color: 'text-yellow-500', bars: 2 },
    weak: { label: 'Weak', color: 'text-orange-500', bars: 1 },
    none: { label: 'No Signal', color: 'text-red-500', bars: 0 }
  };

  const filteredTrucks = trucks.filter(truck => {
    const matchesSearch = truck.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         truck.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         truck.route.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || truck.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate data updates
      setTrucks(prevTrucks => 
        prevTrucks.map(truck => ({
          ...truck,
          lastUpdate: truck.status === 'offline' ? truck.lastUpdate : 'Just now',
          progress: truck.status === 'in_transit' ? Math.min(100, truck.progress + Math.random() * 2) : truck.progress,
          speed: truck.status === 'in_transit' ? 45 + Math.random() * 20 : 0
        }))
      );
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // Simulate manual refresh
  };

  const handleContactDriver = (truck) => {
    alert(`Contacting ${truck.driver} (${truck.licensePlate})`);
  };

  const handleViewRoute = (truck) => {
    setSelectedTruck(truck);
  };

  const getAlertCount = (type) => {
    return trucks.reduce((count, truck) => {
      return count + truck.alerts.filter(alert => alert.type === type).length;
    }, 0);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Real-time Tracking</h1>
          <p className="text-gray-600 mt-1">Monitor your fleet in real-time</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Trucks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {trucks.filter(t => t.status !== 'offline').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-gray-900">
                  {trucks.filter(t => t.status === 'in_transit').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Navigation className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alerts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getAlertCount('warning') + getAlertCount('error')}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Speed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(trucks.filter(t => t.status === 'in_transit').reduce((sum, t) => sum + t.speed, 0) / trucks.filter(t => t.status === 'in_transit').length || 0)} mph
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Truck List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Fleet Status</CardTitle>
                <div className="flex space-x-2">
                  <Select value={refreshInterval.toString()} onValueChange={(value) => setRefreshInterval(parseInt(value))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 sec</SelectItem>
                      <SelectItem value="30">30 sec</SelectItem>
                      <SelectItem value="60">1 min</SelectItem>
                      <SelectItem value="300">5 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Search and Filter */}
              <div className="flex space-x-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search trucks, drivers, routes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="idle">Idle</SelectItem>
                    <SelectItem value="loading">Loading</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTrucks.map((truck) => {
                  const StatusIcon = statusConfig[truck.status].icon;
                  return (
                    <div key={truck.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="flex items-center space-x-2">
                              <StatusIcon className="h-5 w-5 text-gray-600" />
                              <span className="font-semibold text-lg">{truck.licensePlate}</span>
                            </div>
                            <Badge className={`${statusConfig[truck.status].color} text-white`}>
                              {statusConfig[truck.status].label}
                            </Badge>
                            {truck.alerts.length > 0 && (
                              <Badge variant="destructive">
                                {truck.alerts.length} Alert{truck.alerts.length > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Driver: <span className="font-medium text-gray-900">{truck.driver}</span></p>
                              <p className="text-gray-600">Route: <span className="font-medium text-gray-900">{truck.route}</span></p>
                              <p className="text-gray-600">Cargo: <span className="font-medium text-gray-900">{truck.cargo}</span></p>
                            </div>
                            <div>
                              <p className="text-gray-600">Location: <span className="font-medium text-gray-900">{truck.location.address}</span></p>
                              <p className="text-gray-600">ETA: <span className="font-medium text-gray-900">{truck.eta}</span></p>
                              <p className="text-gray-600">Last Update: <span className="font-medium text-gray-900">{truck.lastUpdate}</span></p>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          {truck.status === 'in_transit' && (
                            <div className="mt-3">
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Route Progress</span>
                                <span>{Math.round(truck.progress)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${truck.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {/* Vehicle Stats */}
                          <div className="flex items-center space-x-6 mt-3 text-sm">
                            <div className="flex items-center space-x-1">
                              <Navigation2 className="h-4 w-4 text-gray-500" />
                              <span>{truck.speed} mph</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Fuel className="h-4 w-4 text-gray-500" />
                              <span>{truck.fuel}%</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Thermometer className="h-4 w-4 text-gray-500" />
                              <span>{truck.temperature}°C</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Battery className="h-4 w-4 text-gray-500" />
                              <span>{truck.battery}%</span>
                            </div>
                            <div className={`flex items-center space-x-1 ${signalConfig[truck.signal].color}`}>
                              <Signal className="h-4 w-4" />
                              <span>{signalConfig[truck.signal].label}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-2 ml-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewRoute(truck)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleContactDriver(truck)}
                            disabled={truck.status === 'offline'}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>

                      {/* Alerts */}
                      {truck.alerts.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="space-y-1">
                            {truck.alerts.map((alert, index) => (
                              <div key={index} className={`flex items-center space-x-2 text-sm ${
                                alert.type === 'error' ? 'text-red-600' : 
                                alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                              }`}>
                                <AlertTriangle className="h-4 w-4" />
                                <span>{alert.message}</span>
                                <span className="text-gray-500">({alert.time})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map and Details */}
        <div className="space-y-6">
          {/* Map Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Live Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Interactive Map</p>
                  <p className="text-sm text-gray-400">Real-time truck locations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Truck Details */}
          {selectedTruck && (
            <Card>
              <CardHeader>
                <CardTitle>Truck Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg">{selectedTruck.licensePlate}</h4>
                    <p className="text-gray-600">{selectedTruck.driver}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={`${statusConfig[selectedTruck.status].color} text-white`}>
                        {statusConfig[selectedTruck.status].label}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Speed:</span>
                      <span>{selectedTruck.speed} mph</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fuel:</span>
                      <span>{selectedTruck.fuel}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temperature:</span>
                      <span>{selectedTruck.temperature}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Battery:</span>
                      <span>{selectedTruck.battery}%</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="w-full" onClick={() => handleContactDriver(selectedTruck)}>
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Driver
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Emergency Alert
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Route className="h-4 w-4 mr-2" />
                  Route Optimization
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Broadcast Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RealTimeTracking;

