import React, { useState } from 'react';
import { CreditCard, Check, AlertTriangle, Calendar, Users, Truck, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '../../contexts/AuthContext';
import { SubscriptionPlan, SubscriptionFeatures } from '../../types';

export const SubscriptionManagement = () => {
  const { user, company, subscription } = useAuth();
  const [loading, setLoading] = useState(false);

  // Mock usage data
  const usage = {
    trucks: 18,
    drivers: 42,
    branches: 3
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
      ]
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
      ]
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
      ]
    }
  ];

  const currentPlan = plans.find(plan => plan.id === subscription?.plan);
  const features = subscription?.features || {};

  const getUsagePercentage = (used, limit) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleUpgrade = async (planId) => {
    setLoading(true);
    // Mock upgrade process
    setTimeout(() => {
      setLoading(false);
      alert(`Upgrade to ${planId} plan initiated. You will be redirected to payment.`);
    }, 1000);
  };

  const isCurrentPlan = (planId) => planId === subscription?.plan;
  const canDowngrade = (planId) => {
    const planOrder = [SubscriptionPlan.BASIC, SubscriptionPlan.PROFESSIONAL, SubscriptionPlan.ENTERPRISE];
    const currentIndex = planOrder.indexOf(subscription?.plan);
    const targetIndex = planOrder.indexOf(planId);
    return targetIndex < currentIndex;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscription Management</h1>
        <p className="text-muted-foreground">Manage your subscription plan and billing</p>
      </div>

      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Current Subscription</span>
          </CardTitle>
          <CardDescription>Your active plan and usage details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold capitalize">{subscription?.plan} Plan</h3>
              <p className="text-muted-foreground">
                Active since {new Date(subscription?.start_date).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{currentPlan?.price}</div>
              <div className="text-sm text-muted-foreground">{currentPlan?.period}</div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Trucks Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4" />
                  <span className="text-sm font-medium">Trucks</span>
                </div>
                <span className={`text-sm font-medium ${getUsageColor(getUsagePercentage(usage.trucks, features.maxTrucks))}`}>
                  {usage.trucks} / {features.maxTrucks === -1 ? '∞' : features.maxTrucks}
                </span>
              </div>
              {features.maxTrucks !== -1 && (
                <Progress 
                  value={getUsagePercentage(usage.trucks, features.maxTrucks)} 
                  className="h-2"
                />
              )}
            </div>

            {/* Drivers Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Drivers</span>
                </div>
                <span className={`text-sm font-medium ${getUsageColor(getUsagePercentage(usage.drivers, features.maxDrivers))}`}>
                  {usage.drivers} / {features.maxDrivers === -1 ? '∞' : features.maxDrivers}
                </span>
              </div>
              {features.maxDrivers !== -1 && (
                <Progress 
                  value={getUsagePercentage(usage.drivers, features.maxDrivers)} 
                  className="h-2"
                />
              )}
            </div>

            {/* Branches Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4" />
                  <span className="text-sm font-medium">Branches</span>
                </div>
                <span className={`text-sm font-medium ${getUsageColor(getUsagePercentage(usage.branches, features.maxBranches))}`}>
                  {usage.branches} / {features.maxBranches === -1 ? '∞' : features.maxBranches}
                </span>
              </div>
              {features.maxBranches !== -1 && (
                <Progress 
                  value={getUsagePercentage(usage.branches, features.maxBranches)} 
                  className="h-2"
                />
              )}
            </div>
          </div>

          {/* Usage Warnings */}
          {(getUsagePercentage(usage.trucks, features.maxTrucks) >= 90 ||
            getUsagePercentage(usage.drivers, features.maxDrivers) >= 90 ||
            getUsagePercentage(usage.branches, features.maxBranches) >= 90) && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You're approaching your plan limits. Consider upgrading to avoid service interruption.
              </AlertDescription>
            </Alert>
          )}

          {/* Next Billing */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Next billing date: {new Date(subscription?.end_date).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${isCurrentPlan(plan.id) ? 'ring-2 ring-primary' : ''}`}>
              {isCurrentPlan(plan.id) && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Current Plan
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-center">
                  <div className="text-lg font-semibold">{plan.name}</div>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardTitle>
                <CardDescription className="text-center">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={isCurrentPlan(plan.id) ? "secondary" : "default"}
                  disabled={isCurrentPlan(plan.id) || loading}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {isCurrentPlan(plan.id) 
                    ? 'Current Plan' 
                    : canDowngrade(plan.id)
                    ? 'Downgrade'
                    : 'Upgrade'
                  }
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Your recent billing transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: '2024-01-01', amount: '$79.00', status: 'Paid', plan: 'Professional' },
              { date: '2023-12-01', amount: '$79.00', status: 'Paid', plan: 'Professional' },
              { date: '2023-11-01', amount: '$79.00', status: 'Paid', plan: 'Professional' },
            ].map((invoice, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{invoice.plan} Plan</p>
                  <p className="text-sm text-muted-foreground">{invoice.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{invoice.amount}</p>
                  <Badge variant="secondary">{invoice.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

