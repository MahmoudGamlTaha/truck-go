import React, { useState } from 'react';
import { Truck, Plus, Search, Filter, Edit, Trash2, CheckCircle, XCircle, AlertTriangle, MapPin, User, Calendar, Wrench } from 'lucide-react';
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

export const FleetManagement = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');
  const [showAddTruck, setShowAddTruck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Mock trucks data
  const [trucks, setTrucks] = useState([
    {
      id: 1,
      license_plate: 'TRK-001',
      make: 'Volvo',
      model: 'FH16',
      year: 2022,
      capacity: '40 tons',
      status: 'active',
      driver_id: 3,
      driver_name: 'Mike Driver',
      branch_id: 1,
      branch_name: 'Main Branch',
      last_maintenance: '2024-07-15',
      next_maintenance: '2024-09-15',
      mileage: 45000,
      fuel_efficiency: '8.5 L/100km',
      current_location: 'Downtown Depot',
      notes: 'Recently serviced, excellent condition'
    },
    {
      id: 2,
      license_plate: 'TRK-002',
      make: 'Mercedes',
      model: 'Actros',
      year: 2021,
      capacity: '35 tons',
      status: 'active',
      driver_id: 4,
      driver_name: 'Sarah Wilson',
      branch_id: 2,
      branch_name: 'North Branch',
      last_maintenance: '2024-06-20',
      next_maintenance: '2024-08-20',
      mileage: 52000,
      fuel_efficiency: '9.2 L/100km',
      current_location: 'North Warehouse',
      notes: 'Due for maintenance soon'
    },
    {
      id: 3,
      license_plate: 'TRK-003',
      make: 'Scania',
      model: 'R450',
      year: 2023,
      capacity: '42 tons',
      status: 'maintenance',
      driver_id: null,
      driver_name: null,
      branch_id: 1,
      branch_name: 'Main Branch',
      last_maintenance: '2024-08-20',
      next_maintenance: '2024-10-20',
      mileage: 28000,
      fuel_efficiency: '8.1 L/100km',
      current_location: 'Service Center',
      notes: 'Undergoing scheduled maintenance'
    },
    {
      id: 4,
      license_plate: 'TRK-004',
      make: 'DAF',
      model: 'XF',
      year: 2020,
      capacity: '38 tons',
      status: 'inactive',
      driver_id: null,
      driver_name: null,
      branch_id: 2,
      branch_name: 'North Branch',
      last_maintenance: '2024-05-10',
      next_maintenance: '2024-07-10',
      mileage: 78000,
      fuel_efficiency: '9.8 L/100km',
      current_location: 'Storage Yard',
      notes: 'Awaiting repairs'
    },
    {
      id: 5,
      license_plate: 'TRK-005',
      make: 'MAN',
      model: 'TGX',
      year: 2022,
      capacity: '40 tons',
      status: 'available',
      driver_id: null,
      driver_name: null,
      branch_id: 1,
      branch_name: 'Main Branch',
      last_maintenance: '2024-08-01',
      next_maintenance: '2024-10-01',
      mileage: 35000,
      fuel_efficiency: '8.7 L/100km',
      current_location: 'Main Depot',
      notes: 'Ready for assignment'
    }
  ]);

  const [newTruck, setNewTruck] = useState({
    license_plate: '',
    make: '',
    model: '',
    year: '',
    capacity: '',
    branch_id: '',
    notes: ''
  });

  // Filter trucks based on search and filters
  const filteredTrucks = trucks.filter(truck => {
    const matchesSearch = 
      truck.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      truck.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (truck.driver_name && truck.driver_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || truck.status === filterStatus;
    const matchesBranch = filterBranch === 'all' || truck.branch_id.toString() === filterBranch;

    return matchesSearch && matchesStatus && matchesBranch;
  });

  const handleAddTruck = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const truck = {
        id: trucks.length + 1,
        ...newTruck,
        year: parseInt(newTruck.year),
        status: 'available',
        driver_id: null,
        driver_name: null,
        branch_name: newTruck.branch_id === '1' ? 'Main Branch' : 'North Branch',
        last_maintenance: null,
        next_maintenance: null,
        mileage: 0,
        fuel_efficiency: 'N/A',
        current_location: newTruck.branch_id === '1' ? 'Main Depot' : 'North Warehouse'
      };
      
      setTrucks([...trucks, truck]);
      setNewTruck({
        license_plate: '',
        make: '',
        model: '',
        year: '',
        capacity: '',
        branch_id: '',
        notes: ''
      });
      setShowAddTruck(false);
      setMessage('Truck added successfully!');
    } catch (error) {
      setMessage('Failed to add truck');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (truckId, newStatus) => {
    setTrucks(trucks.map(truck => 
      truck.id === truckId 
        ? { ...truck, status: newStatus }
        : truck
    ));
    setMessage('Truck status updated successfully!');
  };

  const handleDeleteTruck = async (truckId) => {
    if (window.confirm('Are you sure you want to delete this truck?')) {
      setTrucks(trucks.filter(truck => truck.id !== truckId));
      setMessage('Truck deleted successfully!');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'available':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />Available</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800"><Wrench className="h-3 w-3 mr-1" />Maintenance</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getMaintenanceStatus = (nextMaintenance) => {
    if (!nextMaintenance) return null;
    
    const today = new Date();
    const maintenanceDate = new Date(nextMaintenance);
    const daysUntil = Math.ceil((maintenanceDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) {
      return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Overdue</Badge>;
    } else if (daysUntil <= 7) {
      return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="h-3 w-3 mr-1" />Due Soon</Badge>;
    }
    return null;
  };

  const stats = {
    total: trucks.length,
    active: trucks.filter(t => t.status === 'active').length,
    available: trucks.filter(t => t.status === 'available').length,
    maintenance: trucks.filter(t => t.status === 'maintenance').length,
    inactive: trucks.filter(t => t.status === 'inactive').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fleet Management</h1>
          <p className="text-muted-foreground">Manage your truck fleet and vehicle assignments</p>
        </div>
        <Dialog open={showAddTruck} onOpenChange={setShowAddTruck}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Truck
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Truck</DialogTitle>
              <DialogDescription>Register a new truck to your fleet</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddTruck} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate</Label>
                <Input
                  id="licensePlate"
                  value={newTruck.license_plate}
                  onChange={(e) => setNewTruck(prev => ({ ...prev, license_plate: e.target.value }))}
                  placeholder="e.g., TRK-006"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    value={newTruck.make}
                    onChange={(e) => setNewTruck(prev => ({ ...prev, make: e.target.value }))}
                    placeholder="e.g., Volvo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={newTruck.model}
                    onChange={(e) => setNewTruck(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="e.g., FH16"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={newTruck.year}
                    onChange={(e) => setNewTruck(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="2024"
                    min="2000"
                    max="2030"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    value={newTruck.capacity}
                    onChange={(e) => setNewTruck(prev => ({ ...prev, capacity: e.target.value }))}
                    placeholder="e.g., 40 tons"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Select value={newTruck.branch_id} onValueChange={(value) => setNewTruck(prev => ({ ...prev, branch_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Main Branch</SelectItem>
                    <SelectItem value="2">North Branch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={newTruck.notes}
                  onChange={(e) => setNewTruck(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional information about the truck"
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Truck'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddTruck(false)}>
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

      {/* Fleet Statistics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Trucks</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
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
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{stats.available}</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Wrench className="h-4 w-4 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">{stats.maintenance}</div>
                <div className="text-sm text-muted-foreground">Maintenance</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <div>
                <div className="text-2xl font-bold">{stats.inactive}</div>
                <div className="text-sm text-muted-foreground">Inactive</div>
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
                  placeholder="Search trucks by license plate, make, model, or driver..."
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
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterBranch} onValueChange={setFilterBranch}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="1">Main Branch</SelectItem>
                <SelectItem value="2">North Branch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Trucks List */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet ({filteredTrucks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTrucks.map((truck) => (
              <div key={truck.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <Truck className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{truck.license_plate}</h3>
                        <p className="text-muted-foreground">{truck.make} {truck.model} ({truck.year})</p>
                      </div>
                      <div className="flex space-x-2">
                        {getStatusBadge(truck.status)}
                        {getMaintenanceStatus(truck.next_maintenance)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span>Capacity: {truck.capacity}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{truck.current_location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{truck.driver_name || 'Unassigned'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{truck.branch_name}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <span>Mileage: {truck.mileage.toLocaleString()} km</span>
                      <span>Fuel: {truck.fuel_efficiency}</span>
                      {truck.last_maintenance && (
                        <span>Last Service: {new Date(truck.last_maintenance).toLocaleDateString()}</span>
                      )}
                      {truck.next_maintenance && (
                        <span>Next Service: {new Date(truck.next_maintenance).toLocaleDateString()}</span>
                      )}
                    </div>

                    {truck.notes && (
                      <p className="text-sm text-muted-foreground italic">{truck.notes}</p>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Select value={truck.status} onValueChange={(value) => handleStatusChange(truck.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteTruck(truck.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

