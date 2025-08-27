import React, { useState } from 'react';
import { Building, MapPin, Phone, Mail, FileText, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '../../contexts/AuthContext';

export const CompanySettings = () => {
  const { user, company } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Company information state
  const [companyData, setCompanyData] = useState({
    name: company?.name || '',
    address: company?.address || '',
    phone: company?.phone || '',
    email: company?.email || '',
    license: company?.license || ''
  });

  // Mock branches data
  const [branches, setBranches] = useState([
    {
      id: 1,
      name: 'Main Branch',
      address: '123 Main St, City, State 12345',
      phone: '+1 (555) 123-4567',
      email: 'main@company.com',
      manager: 'Jane Manager',
      is_active: true,
      trucks_count: 12,
      drivers_count: 25
    },
    {
      id: 2,
      name: 'North Branch',
      address: '456 North Ave, City, State 12346',
      phone: '+1 (555) 234-5678',
      email: 'north@company.com',
      manager: 'Bob Supervisor',
      is_active: true,
      trucks_count: 6,
      drivers_count: 17
    }
  ]);

  const [showAddBranch, setShowAddBranch] = useState(false);
  const [newBranch, setNewBranch] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    manager: ''
  });

  const handleCompanyUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Company information updated successfully!');
    } catch (error) {
      setMessage('Failed to update company information');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBranch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const branch = {
        id: branches.length + 1,
        ...newBranch,
        is_active: true,
        trucks_count: 0,
        drivers_count: 0
      };
      
      setBranches([...branches, branch]);
      setNewBranch({ name: '', address: '', phone: '', email: '', manager: '' });
      setShowAddBranch(false);
      setMessage('Branch added successfully!');
    } catch (error) {
      setMessage('Failed to add branch');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBranch = async (branchId) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      setBranches(branches.filter(branch => branch.id !== branchId));
      setMessage('Branch deleted successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Company Settings</h1>
        <p className="text-muted-foreground">Manage your company information and branch locations</p>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Company Information</span>
          </CardTitle>
          <CardDescription>Update your company details and contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCompanyUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={companyData.name}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="license">License Number</Label>
                <Input
                  id="license"
                  value={companyData.license}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, license: e.target.value }))}
                  placeholder="Enter license number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={companyData.address}
                onChange={(e) => setCompanyData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter company address"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={companyData.phone}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={companyData.email}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter company email"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Company Information'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Branch Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Branch Locations</span>
              </CardTitle>
              <CardDescription>Manage your branch offices and locations</CardDescription>
            </div>
            <Button onClick={() => setShowAddBranch(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Branch
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Branch Form */}
          {showAddBranch && (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-lg">Add New Branch</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddBranch} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="branchName">Branch Name</Label>
                      <Input
                        id="branchName"
                        value={newBranch.name}
                        onChange={(e) => setNewBranch(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter branch name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="branchManager">Manager</Label>
                      <Input
                        id="branchManager"
                        value={newBranch.manager}
                        onChange={(e) => setNewBranch(prev => ({ ...prev, manager: e.target.value }))}
                        placeholder="Enter manager name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branchAddress">Address</Label>
                    <Textarea
                      id="branchAddress"
                      value={newBranch.address}
                      onChange={(e) => setNewBranch(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter branch address"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="branchPhone">Phone</Label>
                      <Input
                        id="branchPhone"
                        type="tel"
                        value={newBranch.phone}
                        onChange={(e) => setNewBranch(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="branchEmail">Email</Label>
                      <Input
                        id="branchEmail"
                        type="email"
                        value={newBranch.email}
                        onChange={(e) => setNewBranch(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter branch email"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Adding...' : 'Add Branch'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddBranch(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Existing Branches */}
          <div className="grid gap-4">
            {branches.map((branch) => (
              <Card key={branch.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{branch.name}</h3>
                        <Badge variant={branch.is_active ? "default" : "secondary"}>
                          {branch.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{branch.address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{branch.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{branch.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>Manager: {branch.manager}</span>
                        </div>
                      </div>

                      <div className="flex space-x-4 text-sm">
                        <span className="flex items-center space-x-1">
                          <span className="font-medium">{branch.trucks_count}</span>
                          <span className="text-muted-foreground">trucks</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span className="font-medium">{branch.drivers_count}</span>
                          <span className="text-muted-foreground">drivers</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteBranch(branch.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Company Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Company Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold">2</div>
              <div className="text-sm text-muted-foreground">Active Branches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">18</div>
              <div className="text-sm text-muted-foreground">Total Trucks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">42</div>
              <div className="text-sm text-muted-foreground">Total Drivers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">156</div>
              <div className="text-sm text-muted-foreground">Deliveries This Month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

