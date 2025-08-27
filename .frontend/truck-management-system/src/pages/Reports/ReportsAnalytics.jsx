import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Truck, 
  Users, 
  Route,
  Package,
  Clock,
  Fuel,
  AlertTriangle,
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target
} from 'lucide-react';

const ReportsAnalytics = () => {
  const [dateRange, setDateRange] = useState('last_30_days');
  const [reportType, setReportType] = useState('overview');

  // Mock data for various reports
  const fleetPerformanceData = [
    { month: 'Jan', deliveries: 145, onTime: 92, delayed: 8, cancelled: 5 },
    { month: 'Feb', deliveries: 168, onTime: 89, delayed: 12, cancelled: 7 },
    { month: 'Mar', deliveries: 192, onTime: 94, delayed: 6, cancelled: 2 },
    { month: 'Apr', deliveries: 178, onTime: 91, delayed: 9, cancelled: 0 },
    { month: 'May', deliveries: 205, onTime: 96, delayed: 4, cancelled: 0 },
    { month: 'Jun', deliveries: 223, onTime: 93, delayed: 7, cancelled: 0 }
  ];

  const costAnalysisData = [
    { month: 'Jan', fuel: 12500, maintenance: 3200, salaries: 18000, insurance: 2800 },
    { month: 'Feb', fuel: 13200, maintenance: 2800, salaries: 18000, insurance: 2800 },
    { month: 'Mar', fuel: 14100, maintenance: 4500, salaries: 19500, insurance: 2800 },
    { month: 'Apr', fuel: 13800, maintenance: 3100, salaries: 19500, insurance: 2800 },
    { month: 'May', fuel: 15200, maintenance: 2900, salaries: 21000, insurance: 2800 },
    { month: 'Jun', fuel: 16100, maintenance: 5200, salaries: 21000, insurance: 2800 }
  ];

  const truckUtilizationData = [
    { name: 'Active', value: 18, color: '#10b981' },
    { name: 'Idle', value: 5, color: '#f59e0b' },
    { name: 'Maintenance', value: 2, color: '#ef4444' }
  ];

  const routeEfficiencyData = [
    { route: 'NYC-Boston', planned: 4.5, actual: 4.2, efficiency: 93 },
    { route: 'Boston-Philly', planned: 5.2, actual: 5.8, efficiency: 90 },
    { route: 'Philly-DC', planned: 3.1, actual: 2.9, efficiency: 107 },
    { route: 'DC-Atlanta', planned: 6.8, actual: 7.2, efficiency: 94 },
    { route: 'Atlanta-Miami', planned: 8.2, actual: 8.0, efficiency: 103 }
  ];

  const driverPerformanceData = [
    { driver: 'John Smith', deliveries: 45, onTime: 98, fuelEff: 7.2, safety: 95 },
    { driver: 'Sarah Johnson', deliveries: 42, onTime: 96, fuelEff: 6.8, safety: 98 },
    { driver: 'Mike Wilson', deliveries: 38, onTime: 94, fuelEff: 7.5, safety: 92 },
    { driver: 'Lisa Brown', deliveries: 35, onTime: 89, fuelEff: 6.9, safety: 96 },
    { driver: 'David Lee', deliveries: 41, onTime: 97, fuelEff: 7.1, safety: 94 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 85000, profit: 12500, margin: 14.7 },
    { month: 'Feb', revenue: 92000, profit: 15200, margin: 16.5 },
    { month: 'Mar', revenue: 108000, profit: 18900, margin: 17.5 },
    { month: 'Apr', revenue: 98000, profit: 16100, margin: 16.4 },
    { month: 'May', revenue: 115000, profit: 21800, margin: 19.0 },
    { month: 'Jun', revenue: 128000, profit: 25600, margin: 20.0 }
  ];

  const kpiData = [
    {
      title: 'Total Revenue',
      value: '$626,000',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Fleet Utilization',
      value: '87%',
      change: '+3.2%',
      trend: 'up',
      icon: Truck,
      color: 'text-blue-600'
    },
    {
      title: 'On-Time Delivery',
      value: '94.2%',
      change: '+1.8%',
      trend: 'up',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      title: 'Fuel Efficiency',
      value: '7.1 MPG',
      change: '-0.3%',
      trend: 'down',
      icon: Fuel,
      color: 'text-orange-600'
    }
  ];

  const generateReport = () => {
    alert(`Generating ${reportType} report for ${dateRange}...`);
  };

  const exportData = (format) => {
    alert(`Exporting data as ${format}...`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your fleet performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 days</SelectItem>
              <SelectItem value="last_30_days">Last 30 days</SelectItem>
              <SelectItem value="last_90_days">Last 90 days</SelectItem>
              <SelectItem value="last_year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateReport}>
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                    <div className={`flex items-center mt-1 ${kpi.color}`}>
                      <TrendIcon className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">{kpi.change}</span>
                    </div>
                  </div>
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                    kpi.trend === 'up' ? 'bg-green-100' : 'bg-orange-100'
                  }`}>
                    <Icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fleet Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Fleet Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={fleetPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="deliveries" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="onTime" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Truck Utilization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="h-5 w-5 mr-2" />
                  Truck Utilization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={truckUtilizationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {truckUtilizationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Revenue & Profit Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'margin' ? `${value}%` : `$${value.toLocaleString()}`,
                    name === 'revenue' ? 'Revenue' : name === 'profit' ? 'Profit' : 'Margin'
                  ]} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                  <Bar dataKey="profit" fill="#10b981" name="Profit" />
                  <Line type="monotone" dataKey="margin" stroke="#f59e0b" strokeWidth={3} name="Margin %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Route Efficiency */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Route className="h-5 w-5 mr-2" />
                  Route Efficiency Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {routeEfficiencyData.map((route, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{route.route}</p>
                        <p className="text-sm text-gray-600">
                          Planned: {route.planned}h | Actual: {route.actual}h
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={route.efficiency >= 100 ? "default" : route.efficiency >= 90 ? "secondary" : "destructive"}>
                          {route.efficiency}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Delivery Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={fleetPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="onTime" fill="#10b981" name="On Time" />
                    <Bar dataKey="delayed" fill="#f59e0b" name="Delayed" />
                    <Bar dataKey="cancelled" fill="#ef4444" name="Cancelled" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Cost Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={costAnalysisData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Area type="monotone" dataKey="fuel" stackId="1" stroke="#ef4444" fill="#ef4444" />
                    <Area type="monotone" dataKey="maintenance" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                    <Area type="monotone" dataKey="salaries" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                    <Area type="monotone" dataKey="insurance" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Profit Margins */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Profit Margin Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Line type="monotone" dataKey="margin" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">$626,000</p>
                  <p className="text-gray-600">Total Revenue</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">$109,100</p>
                  <p className="text-gray-600">Total Profit</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">17.4%</p>
                  <p className="text-gray-600">Average Margin</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fleet Utilization Over Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Fleet Utilization Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={fleetPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="deliveries" stroke="#3b82f6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Operational Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Key Operational Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Delivery Time</span>
                    <span className="font-semibold">4.8 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fleet Availability</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Maintenance Downtime</span>
                    <span className="font-semibold">3.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Route Optimization</span>
                    <span className="font-semibold">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Customer Satisfaction</span>
                    <span className="font-semibold">4.7/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Drivers Tab */}
        <TabsContent value="drivers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Driver Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {driverPerformanceData.map((driver, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg">{driver.driver}</h4>
                      <Badge variant="outline">{driver.deliveries} deliveries</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">On-Time Rate</p>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${driver.onTime}%` }}
                            ></div>
                          </div>
                          <span className="font-medium">{driver.onTime}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600">Fuel Efficiency</p>
                        <p className="font-medium">{driver.fuelEff} MPG</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Safety Score</p>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${driver.safety}%` }}
                            ></div>
                          </div>
                          <span className="font-medium">{driver.safety}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => exportData('PDF')}>
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
            <Button variant="outline" onClick={() => exportData('Excel')}>
              <Download className="h-4 w-4 mr-2" />
              Export as Excel
            </Button>
            <Button variant="outline" onClick={() => exportData('CSV')}>
              <Download className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsAnalytics;

