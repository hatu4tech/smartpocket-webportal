import React, { useState, useEffect } from 'react';
import { 
  School, Users, DollarSign, ArrowUpRight, UserCheck, TrendingUp, 
  Activity, Calendar, BookOpen, Award, Clock, BarChart3, PieChart,
  UserPlus, GraduationCap, AlertCircle, CheckCircle, User, MapPin,
  Phone, Mail, Hash
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';
import { apiService } from '../../services/api';

const DashboardOverview  = () => {
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalStudents: 0,
    totalBalance: 0,
    activeParents: 0
  });
  const [schoolDashboards, setSchoolDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [detailedStats, setDetailedStats] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      const schoolsResponse = await apiService.getSchools();
      const schools = schoolsResponse.schools || [];

      const totalStudents = schools.reduce((sum, school) => sum + (school.studentCount || 0), 0);
      const totalBalance = schools.reduce((sum, school) => sum + (school.totalBalance || 0), 0);
      const activeParents = schools.reduce((sum, school) => sum + (school.parentCount || 0), 0);

      setStats({
        totalSchools: schools.length,
        totalStudents,
        totalBalance,
        activeParents
      });

      // Load detailed dashboard data for each school
      const dashboardPromises = schools.map(async (school) => {
        try {
          const dashboardResponse = await apiService.getSchoolDashboard(school.id);

          console.log(`Loaded dashboard for school ${school.id}:`, dashboardResponse.data);
          return {
            schoolId: school.id,
            schoolName: school.name,
            ...dashboardResponse.data
          };
        } catch (error) {
          console.error(`Failed to load dashboard for school ${school.id}:`, error);
          return {
            schoolId: school.id,
            schoolName: school.name,
            statistics: { total_students: 0, total_parents: 0, active_classes: 0 },
            recent_students: [],
            recent_parents: [],
            monthly_stats: []
          };
        }
      });

      const dashboards = await Promise.all(dashboardPromises);
      setSchoolDashboards(dashboards);
      
      if (dashboards.length > 0) {
        setSelectedSchool(dashboards[0]);
        setDetailedStats(dashboards[0].statistics);
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolSelect = (dashboard) => {
    setSelectedSchool(dashboard);
    setDetailedStats(dashboard.statistics);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gray-50 min-h-screen p-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-8 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Total Schools</p>
              <p className="text-4xl font-light text-gray-900">{stats.totalSchools}</p>
            </div>
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center">
              <School className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="mt-6 flex items-center text-sm text-blue-600">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            <span className="font-medium">Active and growing</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Total Students</p>
              <p className="text-4xl font-light text-gray-900">{stats.totalStudents.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="mt-6 flex items-center text-sm text-blue-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span className="font-medium">Enrollment growing</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Total Balance</p>
              <p className="text-4xl font-light text-gray-900">K{stats.totalBalance.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="mt-6 flex items-center text-sm text-blue-600">
            <Activity className="w-4 h-4 mr-2" />
            <span className="font-medium">Financial health</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Active Parents</p>
              <p className="text-4xl font-light text-gray-900">{stats.activeParents.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center">
              <UserCheck className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="mt-6 flex items-center text-sm text-blue-600">
            <Users className="w-4 h-4 mr-2" />
            <span className="font-medium">Engaged community</span>
          </div>
        </div>
      </div>

      {/* School Selection Tabs */}
      {schoolDashboards.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border-0">
          <div className="border-b border-gray-100">
            <div className="flex overflow-x-auto">
              {schoolDashboards.map((dashboard) => (
                <button
                  key={dashboard.schoolId}
                  onClick={() => handleSchoolSelect(dashboard)}
                  className={`px-8 py-6 text-base font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
                    selectedSchool?.schoolId === dashboard.schoolId
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {dashboard.schoolName}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detailed School Dashboard */}
      {selectedSchool && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - School Info & Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* School Information Card */}
            {selectedSchool.school && (
              <div className="bg-white rounded-2xl shadow-sm p-8 border-0">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{selectedSchool.school.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Hash className="w-4 h-4 mr-2" />
                      <span>School Code: {selectedSchool.school.code || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center">
                    <School className="w-7 h-7 text-white" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                    <span>{selectedSchool.school.address}</span>
                  </div>
                  {selectedSchool.school.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-5 h-5 mr-3 text-blue-600" />
                      <span>{selectedSchool.school.phone}</span>
                    </div>
                  )}
                  {selectedSchool.school.email && (
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-5 h-5 mr-3 text-blue-600" />
                      <span>{selectedSchool.school.email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* School Statistics */}
            {detailedStats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-8 border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Students</p>
                      <p className="text-3xl font-light text-gray-900">{detailedStats.total_students || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-blue-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="font-medium">Enrolled</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-8 border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Parents</p>
                      <p className="text-3xl font-light text-gray-900">{detailedStats.total_parents || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-blue-600">
                    <UserCheck className="w-4 h-4 mr-2" />
                    <span className="font-medium">Active</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-8 border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Classes</p>
                      <p className="text-3xl font-light text-gray-900">{detailedStats.active_classes || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-blue-600">
                    <Activity className="w-4 h-4 mr-2" />
                    <span className="font-medium">Running</span>
                  </div>
                </div>
              </div>
            )}

            {/* Monthly Statistics Chart */}
            {selectedSchool.monthly_stats && selectedSchool.monthly_stats.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-8 border-0">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-semibold text-gray-900">Monthly Growth</h3>
                  <BarChart3 className="w-6 h-6 text-gray-400" />
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedSchool.monthly_stats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#6b7280"
                        fontSize={12}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#6b7280" 
                        fontSize={12}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #f3f4f6',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="new_students" 
                        stroke="#3120CF" 
                        strokeWidth={3}
                        name="New Students"
                        dot={{ fill: '#3120CF', strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, fill: '#3120CF' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="new_parents" 
                        stroke="#6b7280" 
                        strokeWidth={3}
                        name="New Parents"
                        strokeDasharray="8 8"
                        dot={{ fill: '#6b7280', strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, fill: '#6b7280' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Recent Activity */}
          <div className="space-y-8">
            {/* Recent Students */}
            {selectedSchool.recent_students && selectedSchool.recent_students.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-8 border-0">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Students</h3>
                  <UserPlus className="w-6 h-6 text-blue-600" />
                </div>
                <div className="space-y-4">
                  {selectedSchool.recent_students.slice(0, 5).map((student, index) => (
                    <div key={student.id || index} className="flex items-center space-x-4 p-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {student.first_name} {student.last_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{student.email}</p>
                      </div>
                      <div className="text-xs text-gray-400 font-medium">
                        {new Date(student.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Parents */}
            {selectedSchool.recent_parents && selectedSchool.recent_parents.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-8 border-0">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Parents</h3>
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="space-y-4">
                  {selectedSchool.recent_parents.slice(0, 5).map((parent, index) => (
                    <div key={parent.id || index} className="flex items-center space-x-4 p-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {parent.first_name} {parent.last_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{parent.email}</p>
                      </div>
                      <div className="text-xs text-gray-400 font-medium">
                        {new Date(parent.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border-0">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-4 px-6 py-4 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-2xl transition-all duration-200">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  <span>Add New Student</span>
                </button>
                <button className="w-full flex items-center space-x-4 px-6 py-4 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-2xl transition-all duration-200">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Register Parent</span>
                </button>
                <button className="w-full flex items-center space-x-4 px-6 py-4 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-2xl transition-all duration-200">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span>Manage Classes</span>
                </button>
                <button className="w-full flex items-center space-x-4 px-6 py-4 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-2xl transition-all duration-200">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>View Reports</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;