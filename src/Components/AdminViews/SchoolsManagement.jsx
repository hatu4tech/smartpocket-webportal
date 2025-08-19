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

// Fixed Parent Form Component - matches backend User model
const ParentForm = ({ parent, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    firstName: parent?.firstName || parent?.first_name || '',
    lastName: parent?.lastName || parent?.last_name || '',
    email: parent?.email || '',
    phone: parent?.phone || '',
    // Handle the name field from backend response
    displayName: parent?.displayName || parent?.name || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Transform data to match what backend expects
    const submitData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      displayName: formData.displayName || `${formData.firstName} ${formData.lastName}`.trim(),
      role: 'parent' // Ensure role is set for new parents
    };
    onSubmit(submitData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => handleChange('displayName', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            placeholder="Will auto-generate from first and last name if empty"
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


const StudentForm = ({ student, onSubmit, onCancel, isLoading }) => {
  
  /**
   * Helper function to format an ISO 8601 timestamp for use in a date input field.
   * HTML date inputs require 'YYYY-MM-DD' format, so we strip out time and timezone.
   *
   * @param {string} isoString - ISO 8601 date string from backend
   * @returns {string} formatted date string compatible with <input type="date" />
   */
  const formatDateForInput = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Initialize local state for form fields.
  // Prefills from `student` if provided (edit mode) or empty for create mode.
  const [formData, setFormData] = useState({
    firstName: student?.firstName || student?.first_name || '',
    lastName: student?.lastName || student?.last_name || '',
    email: student?.email || '', 
    grade: student?.grade || '',
    studentId: student?.studentId || student?.student_id || '',
    dateOfBirth: formatDateForInput(student?.dateOfBirth || student?.date_of_birth),
    phone: student?.phone || '',
    displayName: student?.displayName || student?.name || ''
  });

 
  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email || `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@temp.com`,
      phone: formData.phone || undefined,
      displayName: formData.displayName || `${formData.firstName} ${formData.lastName}`.trim(),
      role: 'student' 
    };

    // Include student-specific fields only if user has entered them
    if (formData.grade) submitData.grade = formData.grade;
    if (formData.studentId) submitData.studentId = formData.studentId;
    if (formData.dateOfBirth) {
       submitData.dateOfBirth = new Date(formData.dateOfBirth).toISOString();
    }
    // Trigger parent-provided callback to handle API submission
    onSubmit(submitData);
  };

  /**
   * Updates local form state when an input field changes.
   * Generic handler that updates any field in formData by key.
   *
   * @param {string} field - name of the form field to update
   * @param {string} value - new value for the field
   */
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Render form
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Grid layout: 2-column on medium screens, single column on small */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            required
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            required
          />
        </div>

        {/* Student ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
          <input
            type="text"
            value={formData.studentId}
            onChange={(e) => handleChange('studentId', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>

        {/* Grade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
          <input
            type="text"
            value={formData.grade}
            onChange={(e) => handleChange('grade', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>

        {/* Date of Birth */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>

        {/* Display Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => handleChange('displayName', e.target.value)}
            className="w-full px-4 py-3 border text-gray-600 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            placeholder="Will auto-generate from first and last name if empty"
          />
        </div>
      </div>

      {/* Form action buttons */}
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
  
  // Store comprehensive stats for schools and parents
  const [schoolStats, setSchoolStats] = useState({});
  const [parentStats, setParentStats] = useState({});
  
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

  // Load comprehensive school stats (both parents and students)
  useEffect(() => {
    const loadSchoolStats = async () => {
      if (schools.length > 0) {
        const stats = {};
        await Promise.all(
          schools.map(async (school) => {
            try {
              // Get both parents and students data for each school
              const [parentData, allStudentsData] = await Promise.all([
                apiService.getSchoolParents(school.id),
                apiService.getSchoolStudents(school.id)
              ]);
              
              const parentCount = Array.isArray(parentData) ? parentData.length : (parentData.parents?.length || 0);
              const studentCount = Array.isArray(allStudentsData) ? allStudentsData.length : (allStudentsData.students?.length || 0);
              
              stats[school.id] = { 
                parentCount, 
                studentCount 
              };
            } catch (error) {
              console.error(`Failed to load stats for school ${school.id}:`, error);
              stats[school.id] = { 
                parentCount: 0, 
                studentCount: 0 
              };
            }
          })
        );
        setSchoolStats(stats);
      }
    };
    
    loadSchoolStats();
  }, [schools]);

  // Load parent stats when parents are loaded
  useEffect(() => {
    const loadParentStats = async () => {
      if (parents.length > 0 && selectedSchool) {
        const stats = {};
        await Promise.all(
          parents.map(async (parent) => {
            try {
              const studentData = await apiService.getParentStudentsInSchool(selectedSchool.id, parent.id);
              const studentCount = Array.isArray(studentData) ? studentData.length : (studentData.students?.length || 0);
              stats[parent.id] = { studentCount };
            } catch (error) {
              console.error(`Failed to load stats for parent ${parent.id}:`, error);
              stats[parent.id] = { studentCount: 0 };
            }
          })
        );
        setParentStats(stats);
      }
    };
    
    loadParentStats();
  }, [parents, selectedSchool]);

  // Navigation path for breadcrumbs
  const getNavigationPath = () => {
    const path = [{ name: 'Schools', id: 'schools' }];
    
    if (selectedSchool) {
      path.push({ name: selectedSchool.name, id: `school-${selectedSchool.id}` });
      
      if (currentView === 'parents') {
        path.push({ name: 'Parents', id: `parents-${selectedSchool.id}` });
      }
      
      if (selectedParent) {
        path.push({ name: selectedParent.name || selectedParent.displayName || `${selectedParent.firstName} ${selectedParent.lastName}`, id: `parent-${selectedParent.id}` });
        
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
    setSearchTerm(''); // Clear search when navigating
    loadParents(school.id);
  };

  const handleParentSelect = (parent) => {
    setSelectedParent(parent);
    setCurrentView('students');
    setSearchTerm(''); // Clear search when navigating
    loadStudents(selectedSchool.id, parent.id);
  };

  // Fixed CRUD handlers
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

    // Convert camelCase -> snake_case to match backend expectation
    const snakeCaseData = {
      first_name: parentData.firstName,
      last_name: parentData.lastName,
      email: parentData.email,
      phone: parentData.phone,
      display_name: parentData.displayName || `${parentData.firstName} ${parentData.lastName}`.trim(),
      school_id: selectedSchool.id, 
    };

    if (editingItem) {
      await apiService.updateSchoolParent(selectedSchool.id, editingItem.id, snakeCaseData);
    } else {
      await apiService.createSchoolParent(selectedSchool.id, snakeCaseData);
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
      // For creation, call the student creation endpoint
      const createData = {
        ...studentData,
        parentId: selectedParent.id, // optional, will link automatically
      };
      console.log('Creating student with payload:', createData);

      await apiService.createSchoolStudent(selectedSchool.id, createData);
    }
      
      setShowStudentModal(false);
      setEditingItem(null);
      await loadStudents(selectedSchool.id, selectedParent.id);
      
      // Refresh parent stats after student changes
      if (selectedSchool && parents.length > 0) {
        const stats = {};
        await Promise.all(
          parents.map(async (parent) => {
            try {
              const studentData = await apiService.getParentStudentsInSchool(selectedSchool.id, parent.id);
              const studentCount = Array.isArray(studentData) ? studentData.length : (studentData.students?.length || 0);
              stats[parent.id] = { studentCount };
            } catch (error) {
              console.error(`Failed to refresh stats for parent ${parent.id}:`, error);
              stats[parent.id] = { studentCount: 0 };
            }
          })
        );
        setParentStats(stats);
      }
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
          // For students, we need to remove the relationship with the parent
          await apiService.removeStudentFromParent(selectedParent.id, id);
          await loadStudents(selectedSchool.id, selectedParent.id);
          
          // Refresh parent stats after student deletion
          if (selectedSchool && parents.length > 0) {
            const stats = {};
            await Promise.all(
              parents.map(async (parent) => {
                try {
                  const studentData = await apiService.getParentStudentsInSchool(selectedSchool.id, parent.id);
                  const studentCount = Array.isArray(studentData) ? studentData.length : (studentData.students?.length || 0);
                  stats[parent.id] = { studentCount };
                } catch (error) {
                  console.error(`Failed to refresh stats for parent ${parent.id}:`, error);
                  stats[parent.id] = { studentCount: 0 };
                }
              })
            );
            setParentStats(stats);
          }
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
    return data.filter(item => {
      const searchFields = [
        item.name,
        item.firstName,
        item.lastName,
        item.displayName,
        item.email,
        item.code,
        item.phone,
        item.address,
        item.studentId,
        item.student_id,
        item.grade
      ].filter(Boolean); // Remove null/undefined values
      
      return searchFields.some(field => 
        field.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
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
              {school.code && (
                <div className="text-sm text-gray-500">{school.code}</div>
              )}
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
                <span className="truncate max-w-xs">{school.email}</span>
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
            <span className="truncate max-w-xs">{school.address}</span>
          </div>
        ) : (
          <span className="text-gray-400">Not specified</span>
        )
      },
      {
        key: 'stats',
        header: 'Statistics',
        render: (school) => {
          const stats = schoolStats[school.id] || { parentCount: 0, studentCount: 0 };
          return (
            <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-1 lg:space-y-0">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-1" />
                {stats.parentCount} parent{stats.parentCount !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <GraduationCap className="w-4 h-4 mr-1" />
                {stats.studentCount} student{stats.studentCount !== 1 ? 's' : ''}
              </div>
            </div>
          );
        }
      },
      {
        key: 'status',
        header: 'Status',
        render: (school) => (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            school.is_active !== false
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {school.is_active !== false ? 'Active' : 'Inactive'}
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

    // Calculate total stats for all schools
    const totalStats = Object.values(schoolStats).reduce(
      (acc, stats) => ({
        parentCount: acc.parentCount + stats.parentCount,
        studentCount: acc.studentCount + stats.studentCount
      }),
      { parentCount: 0, studentCount: 0 }
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schools Management</h1>
            <p className="text-gray-600 mt-1">Manage all schools in your system</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
              <span>{schools.length} school{schools.length !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span>{totalStats.parentCount} total parent{totalStats.parentCount !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span>{totalStats.studentCount} total student{totalStats.studentCount !== 1 ? 's' : ''}</span>
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

  // Fixed Parents List View
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
              <div className="font-medium text-gray-900">
                {parent.displayName || parent.name || `${parent.firstName || ''} ${parent.lastName || ''}`.trim()}
              </div>
              {parent.email && (
                <div className="text-sm text-gray-500">{parent.email}</div>
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
                <span className="truncate max-w-xs">{parent.email}</span>
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
        key: 'students',
        header: 'Students',
        render: (parent) => {
          const stats = parentStats[parent.id] || { studentCount: 0 };
          return (
            <div className="flex items-center text-sm text-gray-600">
              <GraduationCap className="w-4 h-4 mr-1" />
              {stats.studentCount} student{stats.studentCount !== 1 ? 's' : ''}
            </div>
          );
        }
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

    // Calculate total students for all parents in this school
    const totalStudents = Object.values(parentStats).reduce(
      (acc, stats) => acc + stats.studentCount,
      0
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center">
            <button
              onClick={() => {
                setCurrentView('schools');
                setSelectedSchool(null);
                setSelectedParent(null);
                setSearchTerm('');
              }}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Parents - {selectedSchool?.name}</h1>
              <p className="text-gray-600 mt-1">Manage parents for this school</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                <span>{parents.length} parent{parents.length !== 1 ? 's' : ''}</span>
                <span>•</span>
                <span>{totalStudents} total student{totalStudents !== 1 ? 's' : ''}</span>
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

  // Fixed Students List View
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
              <div className="font-medium text-gray-900">
                {student.displayName || student.name || `${student.firstName || ''} ${student.lastName || ''}`.trim()}
              </div>
              {(student.studentId || student.student_id) && (
                <div className="text-sm text-gray-500">ID: {student.studentId || student.student_id}</div>
              )}
            </div>
          </div>
        )
      },
      {
        key: 'grade',
        header: 'Grade',
        render: (student) => student.grade ? (
          <span className="inline-flex px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
            {student.grade}
          </span>
        ) : (
          <span className="text-gray-400">Not specified</span>
        )
      },
      {
        key: 'contact',
        header: 'Contact',
        render: (student) => (
          <div className="space-y-1">
            {student.email && (
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-3 h-3 mr-2" />
                <span className="truncate max-w-xs">{student.email}</span>
              </div>
            )}
            {student.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-3 h-3 mr-2" />
                {student.phone}
              </div>
            )}
          </div>
        )
      },
      {
        key: 'details',
        header: 'Details',
        render: (student) => (
          <div className="space-y-1">
            {(student.dateOfBirth || student.date_of_birth) && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(student.dateOfBirth || student.date_of_birth).toLocaleDateString()}
              </div>
            )}
          </div>
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
                setSearchTerm('');
              }}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Students - {selectedParent?.displayName || selectedParent?.name || `${selectedParent?.firstName || ''} ${selectedParent?.lastName || ''}`.trim()}
              </h1>
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