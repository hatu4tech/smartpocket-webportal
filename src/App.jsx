import React from 'react';
import { useAuth } from './hooks/useAuth';
import AdminDashboard from './Components/dashboard/AdminDashboard.jsx';
import SchoolsManagement from './Components/dashboard/demo.jsx';
import { DashboardLayout } from './Components/layout/DashboardLayout.jsx';
import SchoolDashboard from './Components/dashboard/SchoolDashboard';
import LoginPage from './Components/auth/LoginPage';
import { Shield, AlertCircle } from 'lucide-react';

const App = () => {
  const { user, loading } = useAuth();

    console.log('App user:', user);
  console.log('App loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Smart Pocket...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  switch (user.role) {
    case 'admin':
      return <SchoolsManagement />;
    case 'school':
      return <SchoolDashboard />;
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">Your account role is not supported in this portal.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
  }
};

export default App;
