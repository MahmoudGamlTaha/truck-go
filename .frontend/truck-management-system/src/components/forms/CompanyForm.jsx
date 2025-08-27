import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const CompanyForm = ({ onSuccess }) => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    license: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form
      if (!formData.name || !formData.address || !formData.phone || !formData.email) {
        throw new Error('Please fill out all required fields.');
      }

      // In a real app, this would call an API to create the company
      // For now, let's simulate a successful company creation
      const companyService = (await import('../../services/companyService')).companyService;
      const response = await companyService.createCompany(formData);
      
      if (response && response.id) {
        // Update user role from visitor to admin
        await updateProfile({ role: 'admin', company_id: response.id });
        if (onSuccess) {
          onSuccess(response);
        }
      } else {
        throw new Error('Failed to create company. Please try again.');
      }
    } catch (err) {
      console.error('Company creation error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Your Company</CardTitle>
        <CardDescription>
          Welcome to TruckFlow! To continue, please set up your company profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center mb-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Company Name *</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Enter company name" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input 
              id="address" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              placeholder="Enter company address" 
              required 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="Enter phone number" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Enter email address" 
                required 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="license">Business License (Optional)</Label>
            <Input 
              id="license" 
              name="license" 
              value={formData.license} 
              onChange={handleChange} 
              placeholder="Enter business license number" 
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Company'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompanyForm;
