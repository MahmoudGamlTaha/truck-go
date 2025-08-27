import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Shield, Clock, Users, MapPin, BarChart3, CheckCircle, Star, ArrowRight, Menu, X, Phone, Mail, MapPin as Location } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: <Truck className="h-8 w-8 text-blue-600" />,
      title: "Fleet Management",
      description: "Comprehensive truck and vehicle management with real-time status tracking, maintenance scheduling, and performance analytics."
    },
    {
      icon: <MapPin className="h-8 w-8 text-green-600" />,
      title: "Route Optimization",
      description: "Smart route planning with GPS tracking, delivery scheduling, and automated dispatch for maximum efficiency."
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Driver Management",
      description: "Complete driver profiles, performance tracking, scheduling, and communication tools for your team."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
      title: "Analytics & Reports",
      description: "Detailed insights on fleet performance, cost analysis, delivery metrics, and business intelligence."
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Security & Compliance",
      description: "Enterprise-grade security, regulatory compliance, and data protection for your logistics operations."
    },
    {
      icon: <Clock className="h-8 w-8 text-indigo-600" />,
      title: "Real-time Tracking",
      description: "Live GPS tracking, delivery updates, and instant notifications for complete visibility."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "Metro Logistics",
      role: "Operations Manager",
      content: "TruckFlow transformed our operations. We've reduced delivery times by 30% and improved customer satisfaction significantly.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      company: "Express Freight Co.",
      role: "Fleet Director",
      content: "The real-time tracking and route optimization features have saved us thousands in fuel costs. Highly recommended!",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      company: "City Transport",
      role: "CEO",
      content: "Professional, reliable, and feature-rich. TruckFlow is exactly what we needed to scale our business efficiently.",
      rating: 5,
      avatar: "ER"
    }
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "$49",
      period: "/month",
      description: "Perfect for small fleets",
      features: [
        "Up to 5 trucks",
        "Basic route planning",
        "Driver management",
        "Email support",
        "Mobile app access"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$149",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "Up to 25 trucks",
        "Advanced route optimization",
        "Real-time tracking",
        "Analytics & reports",
        "Priority support",
        "API access"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$399",
      period: "/month",
      description: "For large operations",
      features: [
        "Unlimited trucks",
        "Custom integrations",
        "Advanced analytics",
        "24/7 phone support",
        "Dedicated account manager",
        "Custom training"
      ],
      popular: false
    }
  ];

  const stats = [
    { number: "10,000+", label: "Trucks Managed" },
    { number: "500+", label: "Happy Customers" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags would be added to the HTML head */}
      
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Truck className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">TruckFlow</span>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Features</a>
                <a href="#pricing" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Pricing</a>
                <a href="#testimonials" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Testimonials</a>
                <a href="#contact" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Contact</a>
                <Button variant="outline" onClick={() => navigate('/login')} className="ml-4">
                  Sign In
                </Button>
                <Button onClick={() => navigate('/register')} className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </div>
            </div>
            
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-blue-600 p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Features</a>
              <a href="#pricing" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Pricing</a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Testimonials</a>
              <a href="#contact" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Contact</a>
              <div className="pt-2 space-y-2">
                <Button variant="outline" onClick={() => navigate('/login')} className="w-full">
                  Sign In
                </Button>
                <Button onClick={() => navigate('/register')} className="w-full bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Streamline Your
              <span className="text-blue-600"> Truck Fleet</span>
              <br />Management
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Complete logistics management platform for modern trucking companies. 
              Track vehicles, optimize routes, manage drivers, and grow your business with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/register')}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/login')}
                className="text-lg px-8 py-3"
              >
                Sign In to Dashboard
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Fleet
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools designed specifically for trucking companies to optimize operations, 
              reduce costs, and improve customer satisfaction.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers say about TruckFlow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your fleet size and needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative hover:shadow-lg transition-shadow duration-300 ${plan.popular ? 'ring-2 ring-blue-600' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-1">{plan.period}</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                    onClick={() => navigate('/register')}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Fleet Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of trucking companies already using TruckFlow to optimize their operations 
            and grow their business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/register')}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
            >
              Start Your Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/login')}
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600">
              Have questions? We're here to help you get started.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Phone className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
              <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM EST</p>
            </div>
            
            <div className="text-center">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600">support@truckflow.com</p>
              <p className="text-sm text-gray-500">24/7 response time</p>
            </div>
            
            <div className="text-center">
              <Location className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Office</h3>
              <p className="text-gray-600">123 Logistics Ave</p>
              <p className="text-gray-600">Transport City, TC 12345</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Truck className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-2xl font-bold">TruckFlow</span>
              </div>
              <p className="text-gray-400">
                The complete fleet management solution for modern trucking companies.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TruckFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

