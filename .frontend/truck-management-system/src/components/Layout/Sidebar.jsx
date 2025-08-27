import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Route, 
  Package, 
  FileText, 
  MapPin, 
  BarChart3, 
  Building, 
  CreditCard, 
  User,
  LogOut,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { getNavigationItems } from '../../types';

const iconMap = {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Package,
  FileText,
  MapPin,
  BarChart3,
  Building,
  CreditCard,
  User
};

export const Sidebar = ({ isOpen, onToggle }) => {
  const { user, company, subscription, logout } = useAuth();
  const location = useLocation();
  
  const navigationItems = getNavigationItems(user, subscription);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen bg-sidebar border-r border-sidebar-border z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        w-64 flex flex-col
      `}>
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-sidebar-foreground">TruckFlow</h1>
              <p className="text-sm text-sidebar-foreground/70">{company?.name}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }
                `}
                onClick={() => {
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info and logout */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-sidebar-foreground/70 capitalize">
                {user?.role}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};

