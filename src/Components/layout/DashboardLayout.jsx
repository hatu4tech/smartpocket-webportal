import React, { useState } from 'react';
import { 
  School, Users, DollarSign, User, Download, Edit, Eye, Plus,
  ArrowUpRight, Menu, Bell, LogOut, Shield, Home, Settings,
  FileText, Link, BarChart3, UserCheck, Search, ChevronDown,
  Calendar, TrendingUp, Activity, AlertCircle, X, Save
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const DashboardLayout = ({ children, title, actions, activeTab, onTabChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'schools', icon: School, label: 'Schools' },
    { id: 'links', icon: Link, label: 'Parent-Student Links' },
    { id: 'transactions', icon: DollarSign, label: 'Transactions' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white shadow-lg border-r border-gray-200/60 transition-all duration-300 ease-in-out flex flex-col relative z-10`}>
        
        {/* Logo Section */}
        <div className={`${sidebarOpen ? 'p-6' : 'p-4'} border-b border-gray-100/80 bg-gradient-to-r from-gray-50 to-white`}>
          <div className={`flex items-center ${sidebarOpen ? 'gap-4' : 'justify-center'} transition-all duration-300`}>
            <div className={`${sidebarOpen ? 'w-26 h-26' : 'w-13 h-13'} rounded-xl overflow-hidden shadow-md ring-2 ring-gray-100 transition-all duration-300`}>
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {sidebarItems.map((item, index) => (
            <div key={item.id} className="relative">
              <div
                onClick={() => onTabChange?.(item.id)}
                className={`w-full group flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 ease-out cursor-pointer relative ${
                  activeTab === item.id
                    ? 'bg-blue-50/80 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                {/* Subtle active indicator - left border */}
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 bg-blue-600 rounded-full transition-all duration-300 ease-out ${
                  activeTab === item.id ? 'h-6 opacity-100' : 'h-0 opacity-0'
                }`}></div>
                
                {/* Icon container with subtle background */}
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-blue-100/60 text-blue-700' 
                    : 'text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-700'
                }`}>
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                </div>
                
                {sidebarOpen && (
                  <span className={`font-medium text-sm flex-1 text-left truncate transition-all duration-300 ${
                    activeTab === item.id ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    {item.label}
                  </span>
                )}
                
                {!sidebarOpen && (
                  <div className="absolute left-full ml-6 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                    {item.label}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-100/80 bg-gradient-to-r from-gray-50/50 to-white">
          <div className={`flex items-center gap-3 ${!sidebarOpen ? 'justify-center' : ''} group cursor-pointer`}>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md ring-2 ring-white transition-transform duration-200 group-hover:scale-105">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-gray-500 font-medium truncate">{user?.role || 'Super Admin'}</p>
              </div>
            )}
            
            {!sidebarOpen && (
              <div className="absolute left-full ml-6 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                {user?.name || 'Admin User'}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            )}
          </div>
        </div>

        {/* Collapse Toggle */}
        <div className="absolute -right-3 top-8 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            onMouseDown={(e) => e.preventDefault()} // Prevent focus outline
            className="w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
          >
            <div className={`w-2 h-2 border-r-2 border-b-2 border-gray-600 transform transition-transform duration-200 ${
              sidebarOpen ? 'rotate-135' : 'rotate-45'
            }`}></div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100/80 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">{title || 'Dashboard'}</h1>
            </div>

            <div className="flex items-center gap-4">
              {actions && (
                <div className="flex gap-3">{actions}</div>
              )}
              
              <button 
                onMouseDown={(e) => e.preventDefault()}
                className="p-2.5 rounded-xl hover:bg-gray-50 relative transition-colors duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
              >
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>

              <button 
                onClick={logout}
                onMouseDown={(e) => e.preventDefault()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
              >
                <LogOut className="w-4 h-4 text-gray-600 group-hover:text-gray-900 transition-colors" />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium transition-colors">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">
            {children || (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Welcome to the Dashboard</h2>
                <p className="text-gray-600">Select a menu item from the sidebar to get started.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export { DashboardLayout };