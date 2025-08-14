import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { LoginPage } from '../auth/LoginPage';
import { ParentsManagement } from '../AdminViews/ParentsManagement';
import DashboardOverview from '/src/Components//AdminViews/DashboardOverview.jsx';
import { PlaceholderView } from '../AdminViews/PlaceholderView';
import { LinksManagement } from '../AdminViews/LinksManagement';

// School Dashboard
const SchoolDashboard = () => {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (!user) {
      return <LoginPage />;
    }

    const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'parents':
        return <ParentsManagement />;
      case 'analytics':
        return <PlaceholderView title="Reports & Documents" description="Generate and export comprehensive reports for schools and administration." />;
      case 'links':
        return <LinksManagement />;
      case 'transactions':
        return <PlaceholderView title="Reports & Documents" description="Generate and export comprehensive reports for schools and administration." />;
      case 'reports':
        return <PlaceholderView title="Reports & Documents" description="Generate and export comprehensive reports for schools and administration." />;
      case 'settings':
        return <PlaceholderView title="System Settings" description="Configure platform settings, user permissions, and system preferences." />;
      default:
        return <DashboardOverview />;
    }
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard Overview',
      schools: 'Schools Management',
      students: 'Students Management',
      parents: 'Parents Management',
      links: 'Parent-Student Links',
      transactions: 'Transaction Management',
      analytics: 'Analytics & Insights',
      reports: 'Reports & Documents',
      settings: 'System Settings'
    };
    return titles[activeTab] || 'Dashboard';
  };


   const getPageActions = () => {
      if (activeTab === 'schools') {
        return null; // Actions are handled within SchoolsManagement component
      }
      
      return (
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Data
        </button>
      );
    };
  
    return (
      <DashboardLayout 
        title={getPageTitle()}
        actions={getPageActions()}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {renderContent()}
      </DashboardLayout>
    );

};
export default SchoolDashboard;