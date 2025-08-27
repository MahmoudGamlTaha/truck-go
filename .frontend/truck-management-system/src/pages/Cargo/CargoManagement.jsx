import React, { useState } from 'react';
import { Package, Plus, Search, MapPin, Clock, Truck, User, Calendar, CheckCircle, XCircle, AlertTriangle, Weight } from 'lucide-react';
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

export const CargoManagement = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showAddCargo, setShowAddCargo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Mock cargo data
  const [cargo, setCargo] = useState([
    {
      id: 1,
      tracking_number: 'CRG-001-2024',
      description: 'Medical Supplies',
      weight: '250 kg',
      dimensions: '120x80x60 cm',
      value: '$15,000',
      origin: 'Main Depot',
      destination: 'City Hospital',
      status: 'in_transit',
      priority: 'urgent',
      route_id: 4,
      route_name: 'Emergency Medical Supply',
      truck_id: 1,
      truck_license: 'TRK-001',
      driver_name: 'Mike Driver',
      pickup_date: '2024-08-26T11:00:00',
      delivery_date: '2024-08-26T11:45:00',
      customer_name: 'City Hospital',
      customer_phone: '+1 (555) 999-1234',
      special_instructions: 'Handle with extreme care - temperature sensitive',
      fragile: true,
      hazardous: false
    },
    {
      id: 2,
      tracking_number: 'CRG-002-2024',
      description: 'Office Equipment',
      weight: '180 kg',
      dimensions: '100x70x50 cm',
      value: '$8,500',
      origin: 'Main Depot',
      destination: 'Office Complex B',
      status: 'delivered',
      priority: 'medium',
      route_id: 1,
      route_name: 'Downtown Delivery Circuit',
      truck_id: 1,
      truck_license: 'TRK-001',
      driver_name: 'Mike Driver',
      pickup_date: '2024-08-26T08:30:00',
      delivery_date: '2024-08-26T09:15:00',
      customer_name: 'TechCorp Inc.',
      customer_phone: '+1 (555) 888-5678',
      special_instructions: 'Deliver to loading dock',
      fragile: false,
      hazardous: false
    },
    {
      id: 3,
      tracking_number: 'CRG-003-2024',
      description: 'Construction Materials',
      weight: '500 kg',
      dimensions: '200x100x80 cm',
      value: '$3,200',
      origin: 'North Branch',
      destination: 'Construction Site A',
      status: 'pending',
      priority: 'low',
      route_id: null,
      route_name: null,
      truck_id: null,
      truck_license: null,
      driver_name: null,
      pickup_date: '2024-08-27T10:00:00',
      delivery_date: null,
      customer_name: 'BuildCorp Ltd.',
      customer_phone: '+1 (555) 777-9012',
      special_instructions: 'Requires crane for unloading',
      fragile: false,
      hazardous: false
    },
    {
      id: 4,
      tracking_number: 'CRG-004-2024',
      description: 'Electronics',
      weight: '75 kg',
      dimensions: '80x60x40 cm',
      value: '$12,000',
      origin: 'Main Depot',
      destination: 'Shopping Center C',
      status: 'assigned',
      priority: 'high',
      route_id: 1,
      route_name: 'Downtown Delivery Circuit',
      truck_id: 1,
      truck_license: 'TRK-001',
      driver_name: 'Mike Driver',
      pickup_date: '2024-08-26T10:00:00',
      delivery_date: '2024-08-26T10:30:00',
      customer_name: 'ElectroMart',
      customer_phone: '+1 (555) 666-3456',
      special_instructions: 'Fragile - handle with care',
      fragile: true,
      hazardous: false
    },
    {
      id: 5,
      tracking_number: 'CRG-005-2024',
      description: 'Chemical Supplies',
      weight: '300 kg',
      dimensions: '150x90x70 cm',
      value: '$5,800',
      origin: 'Main Depot',
      destination: 'Industrial Zone',
      status: 'cancelled',
      priority: 'medium',
      route_id: null,
      route_name: null,
      truck_id: null,
      truck_license: null,
      driver_name: null,
      pickup_date: '2024-08-25T14:00:00',
      delivery_date: null,
      customer_name: 'ChemCorp Industries',
      customer_phone: '+1 (555) 555-7890',
      special_instructions: 'Hazardous materials - special handling required',
      fragile: false,
      hazardous: true
    }
  ]);

  const [newCargo, setNewCargo] = useState({
    tracking_number: '',
    description: '',
    weight: '',
    dimensions: '',
    value: '',
    origin: '',
    destination: '',
    priority: 'medium',
    customer_name: '',
    customer_phone: '',
    pickup_date: '',
    special_instructions: '',
    fragile: false,
    hazardous: false
  });

  // Filter cargo based on search and filters
  const filteredCargo = cargo.filter(item => {
    const matchesSearch = 
      item.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.driver_name && item.driver_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleAddCargo = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const cargoItem = {
        id: cargo.length + 1,
        ...newCargo,
        tracking_number: `CRG-${String(cargo.length + 1).padStart(3, '0')}-2024`,
        status: 'pending',
        route_id: null,
        route_name: null,
        truck_id: null,
        truck_license: null,
        driver_name: null,
        delivery_date: null
      };
      
      setCargo([...cargo, cargoItem]);
      setNewCargo({
        tracking_number: '',
        description: '',
        weight: '',
        dimensions: '',
        value: '',
        origin: '',
        destination: '',
        priority: 'medium',
        customer_name: '',
        customer_phone: '',
        pickup_date: '',
        special_instructions: '',
        fragile: false,
        hazardous: false
      });
      setShowAddCargo(false);
      setMessage('Cargo added successfully!');
    } catch (error) {
      setMessage('Failed to add cargo');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (cargoId, newStatus) => {
    setCargo(cargo.map(item => 
      item.id === cargoId 
        ? { ...item, status: newStatus }
        : item
    ));
    setMessage('Cargo status updated successfully!');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'assigned':
        return <Badge className="bg-blue-100 text-blue-800"><Truck className="h-3 w-3 mr-1" />Assigned</Badge>;
      case 'in_transit':
        return <Badge className="bg-yellow-100 text-yellow-800"><Package className="h-3 w-3 mr-1" />In Transit</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Delivered</Badge>;
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
    total: cargo.length,
    pending: cargo.filter(c => c.status === 'pending').length,
    assigned: cargo.filter(c => c.status === 'assigned').length,
    in_transit: cargo.filter(c => c.status === 'in_transit').length,
    delivered: cargo.filter(c => c.status === 'delivered').length,
    cancelled: cargo.filter(c => c.status === 'cancelled').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cargo Management</h1>
          <p className="text-muted-foreground">Track and manage cargo shipments and deliveries</p>
        </div>
        <Dialog open={showAddCargo} onOpenChange={setShowAddCargo}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Cargo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Cargo</DialogTitle>
              <DialogDescription>Register a new cargo shipment</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCargo} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newCargo.description}
                  onChange={(e) => setNewCargo(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., Medical Supplies"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    value={newCargo.weight}
                    onChange={(e) => setNewCargo(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="e.g., 250 kg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    value={newCargo.dimensions}
                    onChange={(e) => setNewCargo(prev => ({ ...prev, dimensions: e.target.value }))}
                    placeholder="e.g., 120x80x60 cm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  value={newCargo.value}
                  onChange={(e) => setNewCargo(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="e.g., $15,000"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Origin</Label>
                  <Input
                    id="origin"
                    value={newCargo.origin}
                    onChange={(e) => setNewCargo(prev => ({ ...prev, origin: e.target.value }))}
                    placeholder="Pickup location"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    value={newCargo.destination}
                    onChange={(e) => setNewCargo(prev => ({ ...prev, destination: e.target.value }))}
                    placeholder="Delivery location"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={newCargo.customer_name}
                    onChange={(e) => setNewCargo(prev => ({ ...prev, customer_name: e.target.value }))}
                    placeholder="Customer or company name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Customer Phone</Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={newCargo.customer_phone}
                    onChange={(e) => setNewCargo(prev => ({ ...prev, customer_phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickupDate">Pickup Date</Label>
                  <Input
                    id="pickupDate"
                    type="datetime-local"
                    value={newCargo.pickup_date}
                    onChange={(e) => setNewCargo(prev => ({ ...prev, pickup_date: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newCargo.priority} onValueChange={(value) => setNewCargo(prev => ({ ...prev, priority: value }))}>
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

              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="fragile"
                    checked={newCargo.fragile}
                    onChange={(e) => setNewCargo(prev => ({ ...prev, fragile: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="fragile">Fragile</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hazardous"
                    checked={newCargo.hazardous}
                    onChange={(e) => setNewCargo(prev => ({ ...prev, hazardous: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="hazardous">Hazardous</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                <Textarea
                  id="instructions"
                  value={newCargo.special_instructions}
                  onChange={(e) => setNewCargo(prev => ({ ...prev, special_instructions: e.target.value }))}
                  placeholder="Special handling instructions"
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Cargo'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddCargo(false)}>
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

      {/* Cargo Statistics */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Cargo</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <div>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{stats.assigned}</div>
                <div className="text-sm text-muted-foreground">Assigned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">{stats.in_transit}</div>
                <div className="text-sm text-muted-foreground">In Transit</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{stats.delivered}</div>
                <div className="text-sm text-muted-foreground">Delivered</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <div>
                <div className="text-2xl font-bold">{stats.cancelled}</div>
                <div className="text-sm text-muted-foreground">Cancelled</div>
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
                  placeholder="Search cargo by tracking number, description, or customer..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cargo List */}
      <Card>
        <CardHeader>
          <CardTitle>Cargo ({filteredCargo.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCargo.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{item.tracking_number}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        {getStatusBadge(item.status)}
                        {getPriorityBadge(item.priority)}
                        {item.fragile && <Badge className="bg-yellow-100 text-yellow-800">Fragile</Badge>}
                        {item.hazardous && <Badge className="bg-red-100 text-red-800">Hazardous</Badge>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Weight className="h-4 w-4 text-muted-foreground" />
                        <span>Weight: {item.weight}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>Size: {item.dimensions}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">Value: {item.value}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{item.customer_name}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <span>{item.origin} → {item.destination}</span>
                      <span>Pickup: {new Date(item.pickup_date).toLocaleString()}</span>
                      {item.delivery_date && (
                        <span>Delivery: {new Date(item.delivery_date).toLocaleString()}</span>
                      )}
                    </div>

                    {item.route_name && (
                      <div className="text-sm">
                        <span className="font-medium">Route: </span>
                        <span className="text-muted-foreground">{item.route_name} ({item.truck_license} - {item.driver_name})</span>
                      </div>
                    )}

                    {item.special_instructions && (
                      <p className="text-sm text-muted-foreground italic">{item.special_instructions}</p>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Select value={item.status} onValueChange={(value) => handleStatusChange(item.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="in_transit">In Transit</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
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

