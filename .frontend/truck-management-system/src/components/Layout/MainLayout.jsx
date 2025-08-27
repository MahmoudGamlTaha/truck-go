import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, subscription } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top header */}
        <header className="bg-card border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="hidden md:flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trucks, drivers, routes..."
                  className="w-64"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Subscription badge */}
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">Plan:</span>
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${subscription?.plan === 'enterprise' 
                    ? 'bg-purple-100 text-purple-800' 
                    : subscription?.plan === 'professional'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                  }
                `}>
                  {subscription?.plan?.charAt(0).toUpperCase() + subscription?.plan?.slice(1)}
                </span>
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>

              {/* User avatar */}
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">
                  {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

