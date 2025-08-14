import React, { useState, useEffect } from 'react';
import { 
  School, Users, DollarSign, ArrowUpRight, UserCheck, TrendingUp, 
  Activity, GraduationCap, User, MapPin, Phone, Mail, Hash, UserPlus, BookOpen, BarChart3
} from 'lucide-react';
import { apiService } from '../../services/api';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalStudents: 0,
    totalBalance: 0,
    totalParents: 0
  });
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schoolDetails, setSchoolDetails] = useState(null);
  const [schoolStudents, setSchoolStudents] = useState([]);
  const [schoolParents, setSchoolParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schoolLoading, setSchoolLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState({
    addStudent: false,
    addParent: false,
    manageSchools: false,
    viewStats: false
  });

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const schoolsResponse = await apiService.getSchools();
      const schoolsList = schoolsResponse.schools || [];
      setSchools(schoolsList);

      let totalStudents = 0;
      let totalParents = 0;
      let totalBalance = 0;

      // Load data for each school
  for (const school of schoolsList) {
    try {
      console.log(`Fetching parents for school: ${school.name} (ID: ${school.id})`);

      const parentsResponse = await apiService.getSchoolParents(school.id);
      console.log(`Parents response for ${school.name}:`, parentsResponse);

      const parentsArray = parentsResponse?.parents || [];
      const count = Array.isArray(parentsArray) ? parentsArray.length : 0;
      console.log(`Counted ${count} parents for ${school.name}`);

      totalParents += count;

      // Students might have the same issue
      const studentsResponse = await apiService.getSchoolStudents(school.id);
      const studentsArray = studentsResponse?.students || [];
      console.log(`Students response for ${school.name}:`, studentsResponse);
      console.log(`Counted ${studentsArray.length} students for ${school.name}`);

      totalStudents += studentsArray.length;
      totalBalance += school.totalBalance || 0;
    } catch (error) {
      console.error(`Error loading data for school ${school.id}:`, error);
  }
}

      setStats({
        totalSchools: schoolsList.length,
        totalStudents,
        totalBalance,
        totalParents
      });

      // Select first school by default
      if (schoolsList.length > 0) {
        await selectSchool(schoolsList[0]);
      }

    } catch (error) {
      console.error('Failed to load overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectSchool = async (school) => {
  if (selectedSchool?.id === school.id) return; 
  
  try {
    setSchoolLoading(true);
    setSelectedSchool(school);
    
    // Load school details
    const schoolDetail = await apiService.getSchool(school.id);
    setSchoolDetails(schoolDetail);

    // Load students for selected school
    const studentsResponse = await apiService.getSchoolStudents(school.id);
    const studentsArray = studentsResponse?.students || [];
    setSchoolStudents(Array.isArray(studentsArray) ? studentsArray : []);

    // Load parents for selected school
    const parentsResponse = await apiService.getSchoolParents(school.id);
    const parentsArray = parentsResponse?.parents || [];
    setSchoolParents(Array.isArray(parentsArray) ? parentsArray : []);

    console.log(
      `Selected ${school.name}: ${studentsArray.length} students, ${parentsArray.length} parents`
    );

  } catch (error) {
    console.error('Failed to load school details:', error);
    setSchoolDetails(school);
    setSchoolStudents([]);
    setSchoolParents([]);
  } finally {
    setSchoolLoading(false);
  }
};


  const handleQuickAction = (action) => {
    console.log('Quick action clicked:', action, 'Selected school:', selectedSchool);
    
    switch (action) {
      case 'addStudent':
        if (selectedSchool) {
          alert(`Navigate to: Add Student for ${selectedSchool.name} (School ID: ${selectedSchool.id})`);
          // In your actual app, use your router:
          // navigate(`/schools/${selectedSchool.id}/students/new`);
        } else {
          alert('Please select a school first');
        }
        break;
      case 'addParent':
        if (selectedSchool) {
          alert(`Navigate to: Register Parent for ${selectedSchool.name} (School ID: ${selectedSchool.id})`);
          // navigate(`/schools/${selectedSchool.id}/parents/new`);
        } else {
          alert('Please select a school first');
        }
        break;
      case 'manageSchools':
        alert('Navigate to: Schools Management Page');
        // navigate('/schools');
        break;
      case 'viewStats':
        if (selectedSchool) {
          alert(`Navigate to: Statistics for ${selectedSchool.name} (School ID: ${selectedSchool.id})`);
          // navigate(`/schools/${selectedSchool.id}/statistics`);
        } else {
          alert('Please select a school first');
        }
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-slate-600 rounded-full animate-spin"></div>
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
            <div className="w-14 h-14 bg-blue-900 rounded-2xl flex items-center justify-center">
              <School className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="mt-6 flex items-center text-sm text-slate-600">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            <span className="font-medium">Active schools</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Total Students</p>
              <p className="text-4xl font-light text-gray-900">{stats.totalStudents.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 bg-blue-900 rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="mt-6 flex items-center text-sm text-slate-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span className="font-medium">Enrolled students</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Total Parents</p>
              <p className="text-4xl font-light text-gray-900">{stats.totalParents.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 bg-blue-900 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="mt-6 flex items-center text-sm text-slate-600">
            <UserCheck className="w-4 h-4 mr-2" />
            <span className="font-medium">Registered parents</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Total Balance</p>
              <p className="text-4xl font-light text-gray-900">K{stats.totalBalance.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 bg-blue-900 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="mt-6 flex items-center text-sm text-slate-600">
            <Activity className="w-4 h-4 mr-2" />
            <span className="font-medium">Financial overview</span>
          </div>
        </div>
      </div>

      {/* School Selection - Mobile Dropdown + Desktop Tabs */}
      {schools.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border-0">
          {/* Mobile Dropdown */}
          <div className="sm:hidden p-4">
            <select
              value={selectedSchool?.id || ''}
              onChange={(e) => {
                const school = schools.find(s => s.id === parseInt(e.target.value));
                if (school) selectSchool(school);
              }}
              className="w-full px-4 py-3 text-base font-medium bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-slate-500 focus:outline-none"
            >
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:block border-b border-gray-100">
            <div className="flex overflow-x-auto scrollbar-hide">
              {schools.map((school) => (
                <button
                  key={school.id}
                  onClick={() => selectSchool(school)}
                  disabled={schoolLoading}
                  className={`flex-shrink-0 px-6 lg:px-8 py-6 text-sm lg:text-base font-medium whitespace-nowrap border-b-2 transition-all duration-200 disabled:opacity-50 ${
                    selectedSchool?.id === school.id
                      ? 'border-slate-600 text-slate-600 bg-slate-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="truncate max-w-32 lg:max-w-none">{school.name}</span>
                    <span className="text-xs text-gray-400 mt-1">
                      {school.code || `ID: ${school.id}`}
                    </span>
                  </div>
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
            <div className="bg-white rounded-2xl shadow-sm p-8 border-0">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {schoolDetails?.name || selectedSchool.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Hash className="w-4 h-4 mr-2" />
                    <span>School Code: {schoolDetails?.code || selectedSchool.code || 'N/A'}</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-blue-800 rounded-2xl flex items-center justify-center">
                  <School className="w-7 h-7 text-white" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                {(schoolDetails?.address || selectedSchool.address) && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3 text-slate-600" />
                    <span>{schoolDetails?.address || selectedSchool.address}</span>
                  </div>
                )}
                {(schoolDetails?.phone || selectedSchool.phone) && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-3 text-slate-600" />
                    <span>{schoolDetails?.phone || selectedSchool.phone}</span>
                  </div>
                )}
                {(schoolDetails?.email || selectedSchool.email) && (
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-3 text-slate-600" />
                    <span>{schoolDetails?.email || selectedSchool.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* School Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-8 border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Students</p>
                    <p className="text-3xl font-light text-gray-900">{schoolStudents.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-800 rounded-2xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-slate-600">
                  <UserCheck className="w-4 h-4 mr-2" />
                  <span className="font-medium">Enrolled</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-8 border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Parents</p>
                    <p className="text-3xl font-light text-gray-900">{schoolParents.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-800 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-slate-600">
                  <UserCheck className="w-4 h-4 mr-2" />
                  <span className="font-medium">Registered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="space-y-8">
            {schoolLoading ? (
              <div className="bg-white rounded-2xl shadow-sm p-8 border-0">
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-gray-200 border-t-slate-600 rounded-full animate-spin"></div>
                </div>
              </div>
            ) : (
              <>
                {/* Recent Students */}
                <div className="bg-white rounded-2xl shadow-sm p-8 border-0">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Recent Students</h3>
                    <UserPlus className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="space-y-4">
                    {schoolStudents.length > 0 ? (
                      schoolStudents.slice(0, 5).map((student, index) => (
                        <div key={student.id || index} className="flex items-center space-x-4 p-2">
                          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                            <User className="w-6 h-6 text-slate-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {student.first_name} {student.last_name}
                            </p>
                            {student.email && (
                              <p className="text-xs text-gray-500 truncate">{student.email}</p>
                            )}
                          </div>
                          {student.created_at && (
                            <div className="text-xs text-gray-400 font-medium">
                              {new Date(student.created_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No students enrolled yet</p>
                    )}
                  </div>
                </div>

                {/* Recent Parents */}
                <div className="bg-white rounded-2xl shadow-sm p-8 border-0">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Recent Parents</h3>
                    <Users className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="space-y-4">
                    {schoolParents.length > 0 ? (
                      schoolParents.slice(0, 5).map((parent, index) => (
                        <div key={parent.id || index} className="flex items-center space-x-4 p-2">
                          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                            <User className="w-6 h-6 text-slate-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {parent.first_name} {parent.last_name}
                            </p>
                            {parent.email && (
                              <p className="text-xs text-gray-500 truncate">{parent.email}</p>
                            )}
                          </div>
                          {parent.created_at && (
                            <div className="text-xs text-gray-400 font-medium">
                              {new Date(parent.created_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No parents registered yet</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border-0">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleQuickAction('addStudent');
                  }}
                  disabled={!selectedSchool}
                  className="w-full flex items-center space-x-4 px-6 py-4 text-left text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-slate-50 hover:border-slate-300 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white cursor-pointer"
                >
                  <UserPlus className="w-5 h-5 text-slate-600 flex-shrink-0" />
                  <span>Add New Student</span>
                </button>
                
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleQuickAction('addParent');
                  }}
                  disabled={!selectedSchool}
                  className="w-full flex items-center space-x-4 px-6 py-4 text-left text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-slate-50 hover:border-slate-300 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white cursor-pointer"
                >
                  <Users className="w-5 h-5 text-slate-600 flex-shrink-0" />
                  <span>Register Parent</span>
                </button>
                
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleQuickAction('manageSchools');
                  }}
                  className="w-full flex items-center space-x-4 px-6 py-4 text-left text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-slate-50 hover:border-slate-300 rounded-2xl transition-all duration-200 cursor-pointer"
                >
                  <School className="w-5 h-5 text-slate-600 flex-shrink-0" />
                  <span>Manage Schools</span>
                </button>
                
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleQuickAction('viewStats');
                  }}
                  disabled={!selectedSchool}
                  className="w-full flex items-center space-x-4 px-6 py-4 text-left text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-slate-50 hover:border-slate-300 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white cursor-pointer"
                >
                  <BarChart3 className="w-5 h-5 text-slate-600 flex-shrink-0" />
                  <span>View Statistics</span>
                </button>
              </div>
              
              {!selectedSchool && (
                <p className="text-xs text-gray-400 mt-4 text-center">
                  Select a school to enable student and parent actions
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;