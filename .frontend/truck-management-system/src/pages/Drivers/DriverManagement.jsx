import React, { useState } from 'react';
import { Users, Plus, Search, Filter, Edit, Trash2, UserCheck, UserX, Truck, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

export const DriverManagement = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Mock users data
  const [users, setUsers] = useState([
    {
      id: 1,
      email: 'admin@company.com',
      first_name: 'John',
      last_name: 'Admin',
      role: UserRole.ADMIN,
      company_id: 1,
      branch_id: 1,
      branch_name: 'Main Branch',
      truck_id: null,
      truck_license: null,
      is_active: true,
      phone: '+1 (555) 123-4567',
      created_at: '2024-01-15',
      last_login: '2024-08-26'
    },
    {
      id: 2,
      email: 'jane.manager@company.com',
      first_name: 'Jane',
      last_name: 'Manager',
      role: UserRole.ASSIGNEE,
      company_id: 1,
      branch_id: 1,
      branch_name: 'Main Branch',
      truck_id: null,
      truck_license: null,
      is_active: true,
      phone: '+1 (555) 234-5678',
      created_at: '2024-01-20',
      last_login: '2024-08-25'
    },
    {
      id: 3,
      email: 'mike.driver@company.com',
      first_name: 'Mike',
      last_name: 'Driver',
      role: UserRole.DRIVER,
      company_id: 1,
      branch_id: 1,
      branch_name: 'Main Branch',
      truck_id: 1,
      truck_license: 'TRK-001',
      is_active: true,
      phone: '+1 (555) 345-6789',
      created_at: '2024-02-01',
      last_login: '2024-08-26'
    },
    {
      id: 4,
      email: 'sarah.driver@company.com',
      first_name: 'Sarah',
      last_name: 'Wilson',
      role: UserRole.DRIVER,
      company_id: 1,
      branch_id: 2,
      branch_name: 'North Branch',
      truck_id: 2,
      truck_license: 'TRK-002',
      is_active: true,
      phone: '+1 (555) 456-7890',
      created_at: '2024-02-15',
      last_login: '2024-08-24'
    },
    {
      id: 5,
      email: 'bob.supervisor@company.com',
      first_name: 'Bob',
      last_name: 'Supervisor',
      role: UserRole.ASSIGNEE,
      company_id: 1,
      branch_id: 2,
      branch_name: 'North Branch',
      truck_id: null,
      truck_license: null,
      is_active: false,
      phone: '+1 (555) 567-8901',
      created_at: '2024-01-10',
      last_login: '2024-08-20'
    }
  ]);

  const [newUser, setNewUser] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: UserRole.DRIVER,
    branch_id: '',
    truck_id: '',
    phone: ''
  });

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && user.is_active) ||
      (filterStatus === 'inactive' && !user.is_active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = {
        id: users.length + 1,
        ...newUser,
        company_id: 1,
        branch_name: newUser.branch_id === '1' ? 'Main Branch' : 'North Branch',
        truck_license: newUser.truck_id ? `TRK-00${newUser.truck_id}` : null,
        is_active: true,
        created_at: new Date().toISOString().split('T')[0],
        last_login: null
      };
      
      setUsers([...users, user]);
      setNewUser({
        email: '',
        first_name: '',
        last_name: '',
        role: UserRole.DRIVER,
        branch_id: '',
        truck_id: '',
        phone: ''
      });
      setShowAddUser(false);
      setMessage('User added successfully!');
    } catch (error) {
      setMessage('Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, is_active: !user.is_active }
        : user
    ));
    setMessage('User status updated successfully!');
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
      setMessage('User deleted successfully!');
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case UserRole.ADMIN: return 'bg-purple-100 text-purple-800';
      case UserRole.ASSIGNEE: return 'bg-blue-100 text-blue-800';
      case UserRole.DRIVER: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    drivers: users.filter(u => u.role === UserRole.DRIVER).length,
    managers: users.filter(u => u.role === UserRole.ASSIGNEE).length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Driver & User Management</h1>
          <p className="text-muted-foreground">Manage drivers, managers, and user accounts</p>
        </div>
        <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newUser.first_name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, first_name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newUser.last_name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, last_name: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.DRIVER}>Driver</SelectItem>
                    <SelectItem value={UserRole.ASSIGNEE}>Manager</SelectItem>
                    {user?.role === UserRole.ADMIN && (
                      <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Select value={newUser.branch_id} onValueChange={(value) => setNewUser(prev => ({ ...prev, branch_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Main Branch</SelectItem>
                    <SelectItem value="2">North Branch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newUser.role === UserRole.DRIVER && (
                <div className="space-y-2">
                  <Label htmlFor="truck">Assign Truck (Optional)</Label>
                  <Select value={newUser.truck_id} onValueChange={(value) => setNewUser(prev => ({ ...prev, truck_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select truck" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">TRK-003</SelectItem>
                      <SelectItem value="4">TRK-004</SelectItem>
                      <SelectItem value="5">TRK-005</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add User'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddUser(false)}>
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

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{stats.active}</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{stats.drivers}</div>
                <div className="text-sm text-muted-foreground">Drivers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{stats.managers}</div>
                <div className="text-sm text-muted-foreground">Managers</div>
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
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                <SelectItem value={UserRole.ASSIGNEE}>Manager</SelectItem>
                <SelectItem value={UserRole.DRIVER}>Driver</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-foreground">
                      {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{user.first_name} {user.last_name}</h3>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{user.email}</span>
                      </span>
                      {user.phone && (
                        <span className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{user.phone}</span>
                        </span>
                      )}
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{user.branch_name}</span>
                      </span>
                      {user.truck_license && (
                        <span className="flex items-center space-x-1">
                          <Truck className="h-3 w-3" />
                          <span>{user.truck_license}</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Joined: {new Date(user.created_at).toLocaleDateString()} • 
                      Last login: {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleToggleStatus(user.id)}
                  >
                    {user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

