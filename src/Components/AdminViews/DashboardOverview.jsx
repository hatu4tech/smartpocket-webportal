import React, { useState, useEffect } from 'react';
import { 
  School, Users, DollarSign, ArrowUpRight, UserCheck,TrendingUp, Activity
} from 'lucide-react';   
import { apiService } from '../../services/api';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalStudents: 0,
    totalBalance: 0,
    activeParents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

 const loadStats = async () => {
  try {
    const response = await apiService.getSchools();
    // Unwrap the schools array from response.data
    const schools = response.data || [];

    const totalStudents = schools.reduce((sum, school) => sum + (school.studentCount || 0), 0);
    const totalBalance = schools.reduce((sum, school) => sum + (school.totalBalance || 0), 0);
    const activeParents = schools.reduce((sum, school) => sum + (school.parentCount || 0), 0);

    setStats({
      totalSchools: schools.length,
      totalStudents,
      totalBalance,
      activeParents
    });
  } catch (error) {
    console.error('Failed to load stats:', error);
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Schools</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalSchools}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <School className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-green-600">
          <ArrowUpRight className="w-4 h-4 mr-1" />
          <span>Active and growing</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Students</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-green-600">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>Enrollment growing</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Balance</p>
            <p className="text-3xl font-bold text-gray-900">K{stats.totalBalance.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-gray-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-gray-600">
          <Activity className="w-4 h-4 mr-1" />
          <span>Financial health</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Parents</p>
            <p className="text-3xl font-bold text-gray-900">{stats.activeParents.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-green-600">
          <Users className="w-4 h-4 mr-1" />
          <span>Engaged community</span>
        </div>
      </div>
    </div>
  );
};

export { DashboardOverview };
