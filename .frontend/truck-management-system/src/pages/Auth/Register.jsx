import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Eye, EyeOff, Building, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '../../contexts/AuthContext';
import { SubscriptionPlan, SubscriptionFeatures } from '../../types';

export const Register = () => {
  const [step, setStep] = useState(1); // 1: Company Info, 2: Admin User, 3: Subscription
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Company information
  const [companyData, setCompanyData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    license: ''
  });

  // Admin user information
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Subscription information
  const [selectedPlan, setSelectedPlan] = useState(SubscriptionPlan.PROFESSIONAL);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    if (!companyData.name || !companyData.license) {
      setError('Company name and license are required');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (userData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const registrationData = {
        company: companyData,
        user: userData,
        subscription: {
          plan: selectedPlan,
          features: SubscriptionFeatures[selectedPlan]
        }
      };

      const result = await register(registrationData);
      if (result.success) {
        // Redirect to the dashboard, as the user is now authenticated
        navigate('/app/dashboard');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: SubscriptionPlan.BASIC,
      name: 'Basic',
      price: '$29',
      period: '/month',
      description: 'Perfect for small fleets',
      features: [
        'Up to 5 trucks',
        'Up to 10 drivers',
        '1 branch location',
        'Basic reporting',
        'Email support'
      ],
      popular: false
    },
    {
      id: SubscriptionPlan.PROFESSIONAL,
      name: 'Professional',
      price: '$79',
      period: '/month',
      description: 'Ideal for growing businesses',
      features: [
        'Up to 25 trucks',
        'Up to 50 drivers',
        'Up to 5 branches',
        'Real-time tracking',
        'Advanced reports',
        'Priority support'
      ],
      popular: true
    },
    {
      id: SubscriptionPlan.ENTERPRISE,
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      description: 'For large operations',
      features: [
        'Unlimited trucks',
        'Unlimited drivers',
        'Unlimited branches',
        'Real-time tracking',
        'Advanced analytics',
        'API access',
        '24/7 phone support'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Logo and title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Truck className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">TruckFlow</h1>
          <p className="text-gray-600">Create your fleet management account</p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center space-x-4 mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step >= stepNumber 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`
                  w-12 h-1 mx-2
                  ${step > stepNumber ? 'bg-primary' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>

        <Card>
          {/* Step 1: Company Information */}
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Company Information</span>
                </CardTitle>
                <CardDescription>
                  Tell us about your company
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCompanySubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={companyData.name}
                        onChange={(e) => setCompanyData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter company name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="license">License Number *</Label>
                      <Input
                        id="license"
                        value={companyData.license}
                        onChange={(e) => setCompanyData(prev => ({ ...prev, license: e.target.value }))}
                        placeholder="Enter license number"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyAddress">Address</Label>
                    <Input
                      id="companyAddress"
                      value={companyData.address}
                      onChange={(e) => setCompanyData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter company address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyPhone">Phone</Label>
                      <Input
                        id="companyPhone"
                        type="tel"
                        value={companyData.phone}
                        onChange={(e) => setCompanyData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyEmail">Email</Label>
                      <Input
                        id="companyEmail"
                        type="email"
                        value={companyData.email}
                        onChange={(e) => setCompanyData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter company email"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Link to="/login" className="text-primary hover:underline">
                      Already have an account?
                    </Link>
                    <Button type="submit">
                      Next: Admin User
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          )}

          {/* Step 2: Admin User */}
          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>Admin User Account</CardTitle>
                <CardDescription>
                  Create the administrator account for {companyData.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={userData.first_name}
                        onChange={(e) => setUserData(prev => ({ ...prev, first_name: e.target.value }))}
                        placeholder="Enter first name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={userData.last_name}
                        onChange={(e) => setUserData(prev => ({ ...prev, last_name: e.target.value }))}
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userEmail">Email *</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="userPassword">Password *</Label>
                      <div className="relative">
                        <Input
                          id="userPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={userData.password}
                          onChange={(e) => setUserData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Enter password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={userData.confirmPassword}
                        onChange={(e) => setUserData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm password"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button type="submit">
                      Next: Choose Plan
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          )}

          {/* Step 3: Subscription Plan */}
          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Choose Your Plan</span>
                </CardTitle>
                <CardDescription>
                  Select the plan that best fits your fleet size
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFinalSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`
                          relative border rounded-lg p-4 cursor-pointer transition-all
                          ${selectedPlan === plan.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-gray-200 hover:border-gray-300'
                          }
                          ${plan.popular ? 'ring-2 ring-primary' : ''}
                        `}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {plan.popular && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                              Popular
                            </span>
                          </div>
                        )}
                        
                        <div className="text-center">
                          <h3 className="font-semibold text-lg">{plan.name}</h3>
                          <div className="mt-2">
                            <span className="text-2xl font-bold">{plan.price}</span>
                            <span className="text-gray-600">{plan.period}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                        </div>

                        <ul className="mt-4 space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="text-sm flex items-center">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={setAgreedToTerms}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{' '}
                      <a href="#" className="text-primary hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-primary hover:underline">
                        Privacy Policy
                      </a>
                    </Label>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

