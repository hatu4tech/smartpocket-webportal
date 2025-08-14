import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  GraduationCap, 
  User, 
  ArrowLeft, 
  Search, 
  X, 
  School, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  MoreHorizontal,
  Filter,
  Download,
  Eye
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { LoginPage } from '../auth/LoginPage';

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-16">
    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Breadcrumb Navigation Component
const Breadcrumb = ({ path, onNavigate }) => (
  <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
    {path.map((item, index) => (
      <React.Fragment key={index}>
        {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
        <button
          onClick={() => onNavigate(index)}
          className={`hover:text-blue-600 transition-colors ${
            index === path.length - 1 ? 'text-gray-900 font-medium' : ''
          }`}
        >
          {item.name}
        </button>
      </React.Fragment>
    ))}
  </nav>
);

// Enhanced Search Component
const SearchAndFilter = ({ 
  searchValue, 
  onSearchChange, 
  placeholder, 
  showFilter = false,
  onFilterClick,
  showExport = false,
  onExportClick 
}) => (
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 border text-black border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
      />
      {searchValue && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
    
    <div className="flex items-center space-x-2">
      {showFilter && (
        <button
          onClick={onFilterClick}
          className="px-3 py-2 border text-black border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filter</span>
        </button>
      )}
      {showExport && (
        <button
          onClick={onExportClick}
          className="px-3 py-2 border text-black border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </button>
      )}
    </div>
  </div>
);

// Modern Modal Component with glassmorphism background
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    xxl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className={`bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}>
        <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Responsive Data Table Component with horizontal scroll
const DataTable = ({ columns, data, loading, emptyState }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-12 text-center">
          {emptyState}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Desktop Table with horizontal scroll */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="min-w-full">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {column.header}
                  </th>
                ))}
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {row.actions}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet Cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className="p-4 space-y-3">
            {columns.map((column, colIndex) => (
              <div key={colIndex}>
                {column.render ? column.render(row) : (
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-500">{column.header}:</span>
                    <span className="text-sm text-gray-900 text-right flex-1 ml-2">{row[column.key]}</span>
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
              {row.actions}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// School Form Component
const SchoolForm = ({ school, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: school?.name || '',
    code: school?.code || '',
    email: school?.email || '',
    phone: school?.phone || '',
    address: school?.address || '',
    description: school?.description || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">School Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">School Code</label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => handleChange('code', e.target.value)}
            className="w-full px-4 py-3 text-gray-600 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows="4"
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : school ? 'Update School' : 'Create School'}
        </button>
      </div>
    </form>
  );
};

// Parent Form Component
const ParentForm = ({ parent, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: parent?.name || '',
    email: parent?.email || '',
    phone: parent?.phone || '',
    address: parent?.address || '',
    occupation: parent?.occupation || '',
    emergency_contact: parent?.emergency_contact || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
          <input
            type="text"
            value={formData.occupation}
            onChange={(e) => handleChange('occupation', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
          <input
            type="text"
            value={formData.emergency_contact}
            onChange={(e) => handleChange('emergency_contact', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : parent ? 'Update Parent' : 'Create Parent'}
        </button>
      </div>
    </form>
  );
};

// Student Form Component
const StudentForm = ({ student, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    grade: student?.grade || '',
    age: student?.age || '',
    date_of_birth: student?.date_of_birth || '',
    gender: student?.gender || '',
    student_id: student?.student_id || '',
    enrollment_date: student?.enrollment_date || '',
    medical_info: student?.medical_info || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
          <input
            type="text"
            value={formData.student_id}
            onChange={(e) => handleChange('student_id', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Grade *</label>
          <input
            type="text"
            value={formData.grade}
            onChange={(e) => handleChange('grade', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => handleChange('date_of_birth', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment Date</label>
          <input
            type="date"
            value={formData.enrollment_date}
            onChange={(e) => handleChange('enrollment_date', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Medical Information</label>
          <textarea
            value={formData.medical_info}
            onChange={(e) => handleChange('medical_info', e.target.value)}
            rows="4"
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            placeholder="Any medical conditions, allergies, or special needs..."
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : student ? 'Update Student' : 'Create Student'}
        </button>
      </div>
    </form>
  );
};

// Action Button Component
const ActionButton = ({ icon: Icon, onClick, className = "", tooltip }) => (
  <button
    onClick={onClick}
    className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
    title={tooltip}
  >
    <Icon className="w-4 h-4" />
  </button>
);

// Main Schools Management Component
const SchoolsManagement = () => {
  const [currentView, setCurrentView] = useState('schools');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);
  const [schools, setSchools] = useState([]);
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Store school stats to fix the parent count issue
  const [schoolStats, setSchoolStats] = useState({});
  
  const { user } = useAuth();
  
  // Modal states
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showParentModal, setShowParentModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadSchools();
  }, []);

   if (!user) {
      return <LoginPage />;
    }

  // Load school stats when schools are loaded
  useEffect(() => {
    const loadSchoolStats = async () => {
      if (schools.length > 0) {
        const stats = {};
        await Promise.all(
          schools.map(async (school) => {
            try {
              const parentData = await apiService.getSchoolParents(school.id);
              const parentCount = Array.isArray(parentData) ? parentData.length : (parentData.parents?.length || 0);
              stats[school.id] = { parentCount };
            } catch (error) {
              console.error(`Failed to load stats for school ${school.id}:`, error);
              stats[school.id] = { parentCount: 0 };
            }
          })
        );
        setSchoolStats(stats);
      }
    };
    
    loadSchoolStats();
  }, [schools]);

  // Navigation path for breadcrumbs
  const getNavigationPath = () => {
    const path = [{ name: 'Schools', id: 'schools' }];
    
    if (selectedSchool) {
      path.push({ name: selectedSchool.name, id: `school-${selectedSchool.id}` });
      
      if (currentView === 'parents') {
        path.push({ name: 'Parents', id: `parents-${selectedSchool.id}` });
      }
      
      if (selectedParent) {
        path.push({ name: selectedParent.name, id: `parent-${selectedParent.id}` });
        
        if (currentView === 'students') {
          path.push({ name: 'Students', id: `students-${selectedParent.id}` });
        }
      }
    }
    
    return path;
  };

  // Navigation handler
  const handleNavigation = (pathIndex) => {
    const path = getNavigationPath();
    const targetItem = path[pathIndex];
    
    if (targetItem.id === 'schools') {
      setCurrentView('schools');
      setSelectedSchool(null);
      setSelectedParent(null);
    } else if (targetItem.id.startsWith('school-')) {
      setCurrentView('parents');
      setSelectedParent(null);
    } else if (targetItem.id.startsWith('parents-')) {
      setCurrentView('parents');
      setSelectedParent(null);
    } else if (targetItem.id.startsWith('parent-')) {
      setCurrentView('students');
    }
  };

  // Data loading functions
  const loadSchools = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getSchools();
      setSchools(Array.isArray(data) ? data : data.schools || []);
    } catch (err) {
      setError('Failed to load schools: ' + err.message);
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  const loadParents = async (schoolId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getSchoolParents(schoolId);
      setParents(Array.isArray(data) ? data : data.parents || []);
    } catch (err) {
      setError('Failed to load parents: ' + err.message);
      setParents([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async (schoolId, parentId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getParentStudentsInSchool(schoolId, parentId);
      setStudents(Array.isArray(data) ? data : data.students || []);
    } catch (err) {
      setError('Failed to load students: ' + err.message);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Event handlers
  const handleSchoolSelect = (school) => {
    setSelectedSchool(school);
    setSelectedParent(null);
    setCurrentView('parents');
    loadParents(school.id);
  };

  const handleParentSelect = (parent) => {
    setSelectedParent(parent);
    setCurrentView('students');
    loadStudents(selectedSchool.id, parent.id);
  };

  // CRUD handlers
  const handleSchoolSubmit = async (schoolData) => {
    try {
      setModalLoading(true);
      
      if (editingItem) {
        await apiService.updateSchool(editingItem.id, schoolData);
      } else {
        await apiService.createSchool(schoolData);
      }
      
      setShowSchoolModal(false);
      setEditingItem(null);
      await loadSchools();
    } catch (err) {
      setError('Failed to save school: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleParentSubmit = async (parentData) => {
    try {
      setModalLoading(true);
      
      if (editingItem) {
        await apiService.updateSchoolParent(selectedSchool.id, editingItem.id, parentData);
      } else {
        await apiService.createSchoolParent(selectedSchool.id, parentData);
      }
      
      setShowParentModal(false);
      setEditingItem(null);
      await loadParents(selectedSchool.id);
    } catch (err) {
      setError('Failed to save parent: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleStudentSubmit = async (studentData) => {
    try {
      setModalLoading(true);
      
      if (editingItem) {
        await apiService.updateSchoolStudent(selectedSchool.id, editingItem.id, studentData);
      } else {
        await apiService.createSchoolStudent(selectedSchool.id, studentData);
      }
      
      setShowStudentModal(false);
      setEditingItem(null);
      await loadStudents(selectedSchool.id, selectedParent.id);
    } catch (err) {
      setError('Failed to save student: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      setLoading(true);
      
      switch (type) {
        case 'school':
          await apiService.deleteSchool(id);
          await loadSchools();
          break;
        case 'parent':
          await apiService.deleteSchoolParent(selectedSchool.id, id);
          await loadParents(selectedSchool.id);
          break;
        case 'student':
          await apiService.deleteSchoolStudent(selectedSchool.id, id);
          await loadStudents(selectedSchool.id, selectedParent.id);
          break;
      }
    } catch (err) {
      setError(`Failed to delete ${type}: ` + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search
  const getFilteredData = (data) => {
    if (!searchTerm) return data;
    return data.filter(item => 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Error display component
  const ErrorMessage = ({ message, onRetry }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <div className="text-red-600 mr-3">⚠️</div>
        <div className="flex-1">
          <p className="text-red-800 font-medium">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-red-600 hover:text-red-800 underline mt-1 text-sm"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Schools List View
  const SchoolsListView = () => {
    const filteredSchools = getFilteredData(schools);

    const columns = [
      {
        key: 'name',
        header: 'School Name',
        render: (school) => (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <School className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{school.name}</div>
              <div className="text-sm text-gray-500">{school.code}</div>
            </div>
          </div>
        )
      },
      {
        key: 'contact',
        header: 'Contact Info',
        render: (school) => (
          <div className="space-y-1">
            {school.email && (
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-3 h-3 mr-2" />
                {school.email}
              </div>
            )}
            {school.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-3 h-3 mr-2" />
                {school.phone}
              </div>
            )}
          </div>
        )
      },
      {
        key: 'address',
        header: 'Location',
        render: (school) => school.address ? (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-3 h-3 mr-2 flex-shrink-0" />
            <span className="truncate">{school.address}</span>
          </div>
        ) : (
          <span className="text-gray-400">Not specified</span>
        )
      },
      {
        key: 'stats',
        header: 'Statistics',
        render: (school) => (
          <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-1 lg:space-y-0">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              {schoolStats[school.id]?.parentCount || 0} parent{(schoolStats[school.id]?.parentCount || 0) !== 1 ? 's' : ''}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <GraduationCap className="w-4 h-4 mr-1" />
              {school.student_count || 0} Students
            </div>
          </div>
        )
      },
      {
        key: 'status',
        header: 'Status',
        render: (school) => (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            school.is_active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {school.is_active ? 'Active' : 'Inactive'}
          </span>
        )
      }
    ];

    const getActions = (school) => [
      <ActionButton
        key="view"
        icon={Eye}
        onClick={() => handleSchoolSelect(school)}
        className="text-blue-600 hover:bg-blue-50"
        tooltip="View Details"
      />,
      <ActionButton
        key="edit"
        icon={Edit2}
        onClick={() => {
          setEditingItem(school);
          setShowSchoolModal(true);
        }}
        className="text-gray-600 hover:bg-gray-50"
        tooltip="Edit School"
      />,
      <ActionButton
        key="delete"
        icon={Trash2}
        onClick={() => handleDelete('school', school.id)}
        className="text-red-600 hover:bg-red-50"
        tooltip="Delete School"
      />
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schools Management</h1>
            <p className="text-gray-600 mt-1">Manage all schools in your system</p>
            <div className="text-sm text-gray-500 mt-2">
              {schools.length} school{schools.length !== 1 ? 's' : ''} total
            </div>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setShowSchoolModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add School
          </button>
        </div>

        {error && <ErrorMessage message={error} onRetry={loadSchools} />}

        <SearchAndFilter
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search schools by name, code, email, or phone..."
          showFilter={true}
          showExport={true}
        />

        <DataTable
          columns={columns}
          data={filteredSchools.map(school => ({
            ...school,
            actions: getActions(school)
          }))}
          loading={loading}
          emptyState={
            <div className="text-center py-8">
              <School className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'No schools match your search criteria.' : 'Get started by creating your first school.'}
              </p>
            </div>
          }
        />
      </div>
    );
  };

  // Parents List View
  const ParentsListView = () => {
    const filteredParents = getFilteredData(parents);

    const columns = [
      {
        key: 'name',
        header: 'Parent Name',
        render: (parent) => (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <User className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{parent.name}</div>
              {parent.occupation && (
                <div className="text-sm text-gray-500">{parent.occupation}</div>
              )}
            </div>
          </div>
        )
      },
      {
        key: 'contact',
        header: 'Contact Info',
        render: (parent) => (
          <div className="space-y-1">
            {parent.email && (
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-3 h-3 mr-2" />
                <span className="truncate">{parent.email}</span>
              </div>
            )}
            {parent.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-3 h-3 mr-2" />
                {parent.phone}
              </div>
            )}
          </div>
        )
      },
      {
        key: 'address',
        header: 'Address',
        render: (parent) => parent.address ? (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-3 h-3 mr-2 flex-shrink-0" />
            <span className="truncate max-w-xs">{parent.address}</span>
          </div>
        ) : (
          <span className="text-gray-400">Not specified</span>
        )
      },
      {
        key: 'students',
        header: 'Students',
        render: (parent) => (
          <div className="flex items-center text-sm text-gray-600">
            <GraduationCap className="w-4 h-4 mr-1" />
            {parent.student_count || 0} students
          </div>
        )
      }
    ];

    const getActions = (parent) => [
      <ActionButton
        key="view"
        icon={Eye}
        onClick={() => handleParentSelect(parent)}
        className="text-blue-600 hover:bg-blue-50"
        tooltip="View Students"
      />,
      <ActionButton
        key="edit"
        icon={Edit2}
        onClick={() => {
          setEditingItem(parent);
          setShowParentModal(true);
        }}
        className="text-gray-600 hover:bg-gray-50"
        tooltip="Edit Parent"
      />,
      <ActionButton
        key="delete"
        icon={Trash2}
        onClick={() => handleDelete('parent', parent.id)}
        className="text-red-600 hover:bg-red-50"
        tooltip="Delete Parent"
      />
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center">
            <button
              onClick={() => {
                setCurrentView('schools');
                setSelectedSchool(null);
                setSelectedParent(null);
              }}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Parents - {selectedSchool?.name}</h1>
              <p className="text-gray-600 mt-1">Manage parents for this school</p>
              <div className="text-sm text-gray-500 mt-2">
                {parents.length} parent{parents.length !== 1 ? 's' : ''} total
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setShowParentModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Parent
          </button>
        </div>

        {error && <ErrorMessage message={error} onRetry={() => loadParents(selectedSchool.id)} />}

        <SearchAndFilter
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search parents by name, email, or phone..."
          showFilter={true}
          showExport={true}
        />

        <DataTable
          columns={columns}
          data={filteredParents.map(parent => ({
            ...parent,
            actions: getActions(parent)
          }))}
          loading={loading}
          emptyState={
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No parents found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'No parents match your search criteria.' : 'Get started by adding parents to this school.'}
              </p>
            </div>
          }
        />
      </div>
    );
  };

  // Students List View
  const StudentsListView = () => {
    const filteredStudents = getFilteredData(students);

    const columns = [
      {
        key: 'name',
        header: 'Student Name',
        render: (student) => (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <GraduationCap className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{student.name}</div>
              {student.student_id && (
                <div className="text-sm text-gray-500">ID: {student.student_id}</div>
              )}
            </div>
          </div>
        )
      },
      {
        key: 'grade',
        header: 'Grade',
        render: (student) => (
          <span className="inline-flex px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
            {student.grade}
          </span>
        )
      },
      {
        key: 'details',
        header: 'Details',
        render: (student) => (
          <div className="space-y-1">
            {student.age && (
              <div className="text-sm text-gray-600">Age: {student.age}</div>
            )}
            {student.gender && (
              <div className="text-sm text-gray-600">Gender: {student.gender}</div>
            )}
            {student.date_of_birth && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(student.date_of_birth).toLocaleDateString()}
              </div>
            )}
          </div>
        )
      },
      {
        key: 'medical',
        header: 'Medical Info',
        render: (student) => student.medical_info ? (
          <div className="max-w-xs">
            <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded truncate">
              {student.medical_info}
            </div>
          </div>
        ) : (
          <span className="text-gray-400">None</span>
        )
      }
    ];

    const getActions = (student) => [
      <ActionButton
        key="edit"
        icon={Edit2}
        onClick={() => {
          setEditingItem(student);
          setShowStudentModal(true);
        }}
        className="text-gray-600 hover:bg-gray-50"
        tooltip="Edit Student"
      />,
      <ActionButton
        key="delete"
        icon={Trash2}
        onClick={() => handleDelete('student', student.id)}
        className="text-red-600 hover:bg-red-50"
        tooltip="Delete Student"
      />
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center">
            <button
              onClick={() => {
                setCurrentView('parents');
                setSelectedParent(null);
              }}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Students - {selectedParent?.name}</h1>
              <p className="text-gray-600 mt-1">Students connected to this parent in {selectedSchool?.name}</p>
              <div className="text-sm text-gray-500 mt-2">
                {students.length} student{students.length !== 1 ? 's' : ''} total
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setShowStudentModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </button>
        </div>

        {error && <ErrorMessage message={error} onRetry={() => loadStudents(selectedSchool.id, selectedParent.id)} />}

        <SearchAndFilter
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search students by name, ID, or grade..."
          showFilter={true}
          showExport={true}
        />

        <DataTable
          columns={columns}
          data={filteredStudents.map(student => ({
            ...student,
            actions: getActions(student)
          }))}
          loading={loading}
          emptyState={
            <div className="text-center py-8">
              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'No students match your search criteria.' : 'Get started by adding students for this parent.'}
              </p>
            </div>
          }
        />
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb path={getNavigationPath()} onNavigate={handleNavigation} />
        
        {currentView === 'schools' && <SchoolsListView />}
        {currentView === 'parents' && <ParentsListView />}
        {currentView === 'students' && <StudentsListView />}

        {/* School Modal */}
        <Modal
          isOpen={showSchoolModal}
          onClose={() => {
            setShowSchoolModal(false);
            setEditingItem(null);
          }}
          title={editingItem ? 'Edit School' : 'Create New School'}
          size="lg"
        >
          <SchoolForm
            school={editingItem}
            onSubmit={handleSchoolSubmit}
            onCancel={() => {
              setShowSchoolModal(false);
              setEditingItem(null);
            }}
            isLoading={modalLoading}
          />
        </Modal>

        {/* Parent Modal */}
        <Modal
          isOpen={showParentModal}
          onClose={() => {
            setShowParentModal(false);
            setEditingItem(null);
          }}
          title={editingItem ? 'Edit Parent' : 'Create New Parent'}
          size="lg"
        >
          <ParentForm
            parent={editingItem}
            onSubmit={handleParentSubmit}
            onCancel={() => {
              setShowParentModal(false);
              setEditingItem(null);
            }}
            isLoading={modalLoading}
          />
        </Modal>

        {/* Student Modal */}
        <Modal
          isOpen={showStudentModal}
          onClose={() => {
            setShowStudentModal(false);
            setEditingItem(null);
          }}
          title={editingItem ? 'Edit Student' : 'Create New Student'}
          size="lg"
        >
          <StudentForm
            student={editingItem}
            onSubmit={handleStudentSubmit}
            onCancel={() => {
              setShowStudentModal(false);
              setEditingItem(null);
            }}
            isLoading={modalLoading}
          />
        </Modal>
      </div>
    </div>
  );
};

export default SchoolsManagement;