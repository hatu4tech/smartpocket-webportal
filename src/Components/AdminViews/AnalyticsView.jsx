import React, { useState, useEffect } from 'react';
import { 
  School, Users, DollarSign, TrendingUp, Activity
} from 'lucide-react';


const AnalyticsView = () => {
  const [analyticsData, setAnalyticsData] = useState({
    enrollmentTrend: [],
    balanceDistribution: [],
    activeUsers: 0,
    totalTransactions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Simulate analytics data - replace with real API calls
      setTimeout(() => {
        setAnalyticsData({
          enrollmentTrend: [
            { month: 'Jan', students: 1200 },
            { month: 'Feb', students: 1350 },
            { month: 'Mar', students: 1500 },
            { month: 'Apr', students: 1680 },
            { month: 'May', students: 1850 },
            { month: 'Jun', students: 2100 }
          ],
          balanceDistribution: [
            { school: 'Lusaka Primary', balance: 85000 },
            { school: 'Chilanga Secondary', balance: 142000 },
            { school: 'Kabwe High', balance: 67000 },
            { school: 'Ndola International', balance: 195000 }
          ],
          activeUsers: 1790,
          totalTransactions: 15420
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to load analytics:', error);
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
    <div className="space-y-6">
      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.activeUsers.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-3 text-sm text-green-600">
            <span>↗ 12% increase</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalTransactions.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-3 text-sm text-green-600">
            <span>↗ 18% increase</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Balance</p>
              <p className="text-2xl font-bold text-gray-900">K122,250</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            <span>→ Stable</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900">15.3%</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-3 text-sm text-green-600">
            <span>↗ Above target</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Enrollment Trend</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {analyticsData.enrollmentTrend.map((data, index) => {
              const height = (data.students / 2500) * 100;
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="text-xs text-gray-600 mb-2">{data.students}</div>
                  <div 
                    className="bg-green-500 rounded-t w-full transition-all duration-1000"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs text-gray-500 mt-2">{data.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Balance Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">School Balance Distribution</h3>
          <div className="space-y-4">
            {analyticsData.balanceDistribution.map((school, index) => {
              const percentage = (school.balance / 195000) * 100;
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{school.school}</span>
                    <span className="font-medium text-gray-900">K{school.balance.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <School className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New school registered</p>
              <p className="text-xs text-gray-500">Ndola International School joined the platform</p>
            </div>
            <span className="text-xs text-gray-400">2 hours ago</span>
          </div>

          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Student enrollment milestone</p>
              <p className="text-xs text-gray-500">Reached 2,000+ total students across all schools</p>
            </div>
            <span className="text-xs text-gray-400">1 day ago</span>
          </div>

          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Monthly balance update</p>
              <p className="text-xs text-gray-500">All school balances have been reconciled</p>
            </div>
            <span className="text-xs text-gray-400">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export {AnalyticsView};