import React, { useState, useEffect } from 'react';
import { 
  Link, Plus, Search, Edit, Eye, Trash2, Filter, 
  Download, Upload, Users, User, School, AlertCircle,
  ChevronDown, X, Save, CheckCircle, Clock, XCircle,
  UserPlus, UserMinus, GitBranch, FileText, FileSpreadsheet,
  Calendar, BarChart3, FileDown
} from 'lucide-react';

// Mock API functions - replace these with your actual API calls
const mockAPI = {
  async getSchools() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, name: 'Green Valley High School', location: 'Downtown' },
      { id: 2, name: 'Riverside Academy', location: 'Riverside District' },
      { id: 3, name: 'Central Primary School', location: 'Central District' }
    ];
  },

  async getLinks() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        parentId: 'p1',
        parentName: 'Jane Doe',
        parentEmail: 'jane.doe@email.com',
        students: [
          {
            id: 's1',
            name: 'John Doe',
            email: 'john.doe@email.com',
            schoolId: 1,
            schoolName: 'Green Valley High School',
            grade: 'Grade 10'
          },
          {
            id: 's2',
            name: 'Sarah Doe',
            email: 'sarah.doe@email.com',
            schoolId: 1,
            schoolName: 'Green Valley High School',
            grade: 'Grade 8'
          }
        ],
        relationship: 'Mother',
        status: 'active',
        createdDate: '2024-01-15',
        verifiedDate: '2024-01-16'
      },
      {
        id: 2,
        parentId: 'p2',
        parentName: 'Robert Smith',
        parentEmail: 'robert.smith@email.com',
        students: [
          {
            id: 's3',
            name: 'Mary Smith',
            email: 'mary.smith@email.com',
            schoolId: 2,
            schoolName: 'Riverside Academy',
            grade: 'Grade 12'
          }
        ],
        relationship: 'Father',
        status: 'active',
        createdDate: '2023-09-01',
        verifiedDate: '2023-09-02'
      },
      {
        id: 3,
        parentId: 'p3',
        parentName: 'Sarah Wilson',
        parentEmail: 'sarah.wilson@email.com',
        students: [
          {
            id: 's4',
            name: 'David Wilson',
            email: 'david.wilson@email.com',
            schoolId: 1,
            schoolName: 'Green Valley High School',
            grade: 'Grade 9'
          }
        ],
        relationship: 'Mother',
        status: 'pending',
        createdDate: '2024-02-20',
        verifiedDate: null
      }
    ];
  },

  async getAllStudents() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { id: 's1', name: 'John Doe', email: 'john.doe@email.com', schoolId: 1, grade: 'Grade 10' },
      { id: 's2', name: 'Sarah Doe', email: 'sarah.doe@email.com', schoolId: 1, grade: 'Grade 8' },
      { id: 's3', name: 'Mary Smith', email: 'mary.smith@email.com', schoolId: 2, grade: 'Grade 12' },
      { id: 's4', name: 'David Wilson', email: 'david.wilson@email.com', schoolId: 1, grade: 'Grade 9' },
      { id: 's5', name: 'Emma Johnson', email: 'emma.j@email.com', schoolId: 1, grade: 'Grade 11' },
      { id: 's6', name: 'Michael Brown', email: 'michael.b@email.com', schoolId: 3, grade: 'Grade 7' }
    ];
  },

  async createLink(linkData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, id: Date.now() };
  },

  async updateLink(id, linkData) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { success: true };
  },

  async deleteLink(id) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { success: true };
  },

  async linkStudent(parentId, studentId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  async unlinkStudent(parentId, studentId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};

const LinksManagement = () => {
  const [schools, setSchools] = useState([]);
  const [links, setLinks] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const relationships = ['Father', 'Mother', 'Guardian', 'Grandparent', 'Other'];
  const statuses = ['active', 'pending', 'inactive'];

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [schoolsData, linksData, studentsData] = await Promise.all([
          mockAPI.getSchools(),
          mockAPI.getLinks(),
          mockAPI.getAllStudents()
        ]);
        setSchools(schoolsData);
        setLinks(linksData);
        setAllStudents(studentsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.parentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.students.some(student => 
                           student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesSchool = !selectedSchool || 
                         link.students.some(student => student.schoolId === parseInt(selectedSchool));
    
    const matchesStatus = !selectedStatus || link.status === selectedStatus;
    
    return matchesSearch && matchesSchool && matchesStatus;
  });

  const handleAddLink = async (linkData) => {
    try {
      const result = await mockAPI.createLink(linkData);
      if (result.success) {
        // Reload links
        const linksData = await mockAPI.getLinks();
        setLinks(linksData);
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error creating link:', error);
    }
  };

  const handleEditLink = async (linkData) => {
    try {
      const result = await mockAPI.updateLink(selectedLink.id, linkData);
      if (result.success) {
        const linksData = await mockAPI.getLinks();
        setLinks(linksData);
        setShowEditModal(false);
        setSelectedLink(null);
      }
    } catch (error) {
      console.error('Error updating link:', error);
    }
  };

  const handleDeleteLink = async (linkId) => {
    if (window.confirm('Are you sure you want to delete this parent-student link?')) {
      try {
        const result = await mockAPI.deleteLink(linkId);
        if (result.success) {
          setLinks(links.filter(link => link.id !== linkId));
        }
      } catch (error) {
        console.error('Error deleting link:', error);
      }
    }
  };

  const handleUnlinkStudent = async (parentId, studentId) => {
    if (window.confirm('Are you sure you want to unlink this student from the parent?')) {
      try {
        const result = await mockAPI.unlinkStudent(parentId, studentId);
        if (result.success) {
          const linksData = await mockAPI.getLinks();
          setLinks(linksData);
        }
      } catch (error) {
        console.error('Error unlinking student:', error);
      }
    }
  };

  const handleLinkStudent = async (parentId, studentId) => {
    try {
      const result = await mockAPI.linkStudent(parentId, studentId);
      if (result.success) {
        const linksData = await mockAPI.getLinks();
        setLinks(linksData);
        setShowLinkModal(false);
        setSelectedLink(null);
      }
    } catch (error) {
      console.error('Error linking student:', error);
    }
  };

  const handleVerifyLink = async (linkId) => {
    const updatedLink = links.find(link => link.id === linkId);
    if (updatedLink) {
      await handleEditLink({ 
        ...updatedLink, 
        status: 'active', 
        verifiedDate: new Date().toISOString().split('T')[0] 
      });
    }
  };

  const handleRejectLink = async (linkId) => {
    if (window.confirm('Are you sure you want to reject this link?')) {
      const updatedLink = links.find(link => link.id === linkId);
      if (updatedLink) {
        await handleEditLink({ ...updatedLink, status: 'inactive' });
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTotalStudents = () => {
    return links.reduce((total, link) => total + link.students.length, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parent-Student Links</h1>
          <p className="text-gray-600">Manage relationships between parents and students across schools</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border text-blue-700 border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import Links
          </button>
          <button 
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 border text-blue-700 border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Links
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Link
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {links.filter(link => link.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Active Links</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {links.filter(link => link.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Pending Verification</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{getTotalStudents()}</p>
              <p className="text-sm text-gray-600">Total Student Links</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <School className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{schools.length}</p>
              <p className="text-sm text-gray-600">Schools</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search parents or students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-blue-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full px-4 py-2 text-blue-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Schools</option>
              {schools.map(school => (
                <option key={school.id} value={school.id}>{school.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 text-blue-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          <button className="px-4 py-2 border text-blue-700 border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Links Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Parent</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Students</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Relationship</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Created</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLinks.map((link) => (
                <tr key={link.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{link.parentName}</p>
                        <p className="text-sm text-gray-500">{link.parentEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      {link.students.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                              <p className="text-xs text-gray-500">{student.schoolName} - {student.grade}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleUnlinkStudent(link.parentId, student.id)}
                            className="p-1 hover:bg-red-100 rounded transition-colors"
                            title="Unlink Student"
                          >
                            <UserMinus className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setSelectedLink(link);
                          setShowLinkModal(true);
                        }}
                        className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                      >
                        <UserPlus className="w-4 h-4" />
                        Link Another Student
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      {link.relationship}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(link.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        link.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : link.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {link.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm text-gray-900">{link.createdDate}</p>
                      {link.verifiedDate && (
                        <p className="text-xs text-gray-500">Verified: {link.verifiedDate}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {link.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleVerifyLink(link.id)}
                            className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                            title="Verify Link"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </button>
                          <button 
                            onClick={() => handleRejectLink(link.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            title="Reject Link"
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      )}
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedLink(link);
                          setShowEditModal(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLinks.length === 0 && (
          <div className="text-center py-12">
            <Link className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No parent-student links found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Export Data</h2>
            <p className="text-gray-600">Download your parent-student links data in various formats</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <FileDown className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CSV Export */}
          <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">CSV Export</h3>
                <p className="text-sm text-gray-500">Excel compatible format</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Export all parent-student links with complete details in CSV format for Excel or other spreadsheet applications.
            </p>
            <button 
              onClick={() => setShowExportModal(true)}
              className="w-full px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export as CSV
            </button>
          </div>

          {/* PDF Report */}
          <div className="border border-gray-200 rounded-lg p-4 hover:border-red-300 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">PDF Report</h3>
                <p className="text-sm text-gray-500">Formatted summary report</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Generate a comprehensive PDF report with statistics, charts, and detailed parent-student link information.
            </p>
            <button 
              onClick={() => setShowExportModal(true)}
              className="w-full px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Generate PDF
            </button>
          </div>

          {/* Analytics Export */}
          <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Analytics Data</h3>
                <p className="text-sm text-gray-500">Data for analysis</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Export detailed analytics data including relationship patterns, school distributions, and verification timelines.
            </p>
            <button 
              onClick={() => setShowExportModal(true)}
              className="w-full px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Analytics
            </button>
          </div>
        </div>

        {/* Export Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{filteredLinks.length}</p>
              <p className="text-sm text-gray-600">Total Links</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{getTotalStudents()}</p>
              <p className="text-sm text-gray-600">Student Connections</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{schools.length}</p>
              <p className="text-sm text-gray-600">Schools Involved</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {new Date().toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">Export Date</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Link Modal */}
      {showAddModal && (
        <LinkModal
          title="Create New Link"
          onSave={handleAddLink}
          onClose={() => setShowAddModal(false)}
          schools={schools}
          relationships={relationships}
          allStudents={allStudents}
        />
      )}

      {/* Edit Link Modal */}
      {showEditModal && selectedLink && (
        <LinkModal
          title="Edit Link"
          link={selectedLink}
          onSave={handleEditLink}
          onClose={() => {
            setShowEditModal(false);
            setSelectedLink(null);
          }}
          schools={schools}
          relationships={relationships}
          allStudents={allStudents}
        />
      )}

      {/* Link Student Modal */}
      {showLinkModal && selectedLink && (
        <LinkStudentModal
          parent={selectedLink}
          allStudents={allStudents}
          onLink={handleLinkStudent}
          onClose={() => {
            setShowLinkModal(false);
            setSelectedLink(null);
          }}
        />
      )}

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          links={filteredLinks}
          schools={schools}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};

// Export Modal Component
const ExportModal = ({ links, schools, onClose }) => {
  const [exportType, setExportType] = useState('csv');
  const [includeFilters, setIncludeFilters] = useState(true);
  const [dateRange, setDateRange] = useState('all');
  const [selectedFields, setSelectedFields] = useState({
    parentInfo: true,
    studentInfo: true,
    schoolInfo: true,
    relationshipInfo: true,
    statusInfo: true,
    dateInfo: true
  });

  const handleExport = () => {
    const exportData = prepareExportData();
    
    switch (exportType) {
      case 'csv':
        downloadCSV(exportData);
        break;
      case 'pdf':
        generatePDF(exportData);
        break;
      case 'analytics':
        downloadAnalyticsData(exportData);
        break;
      default:
        break;
    }
    
    onClose();
  };

  const prepareExportData = () => {
    return links.map(link => {
      const exportRow = {};
      
      if (selectedFields.parentInfo) {
        exportRow['Parent Name'] = link.parentName;
        exportRow['Parent Email'] = link.parentEmail;
      }
      
      if (selectedFields.relationshipInfo) {
        exportRow['Relationship'] = link.relationship;
      }
      
      if (selectedFields.studentInfo) {
        exportRow['Students'] = link.students.map(s => s.name).join(', ');
        exportRow['Student Emails'] = link.students.map(s => s.email).join(', ');
        exportRow['Grades'] = link.students.map(s => s.grade).join(', ');
      }
      
      if (selectedFields.schoolInfo) {
        exportRow['Schools'] = [...new Set(link.students.map(s => s.schoolName))].join(', ');
      }
      
      if (selectedFields.statusInfo) {
        exportRow['Status'] = link.status;
      }
      
      if (selectedFields.dateInfo) {
        exportRow['Created Date'] = link.createdDate;
        exportRow['Verified Date'] = link.verifiedDate || 'Not verified';
      }
      
      return exportRow;
    });
  };

  const downloadCSV = (data) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parent-student-links-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const generatePDF = (data) => {
    // This would typically integrate with a PDF library like jsPDF
    alert('PDF generation would be implemented with a PDF library like jsPDF');
  };

  const downloadAnalyticsData = (data) => {
    const analytics = {
      summary: {
        totalLinks: links.length,
        activeLinks: links.filter(l => l.status === 'active').length,
        pendingLinks: links.filter(l => l.status === 'pending').length,
        totalStudents: links.reduce((total, link) => total + link.students.length, 0),
        schoolDistribution: schools.map(school => ({
          schoolName: school.name,
          linkCount: links.filter(link => 
            link.students.some(student => student.schoolId === school.id)
          ).length
        })),
        relationshipDistribution: {}
      },
      detailedData: data,
      exportDate: new Date().toISOString(),
      filters: includeFilters ? { dateRange } : null
    };
    
    const blob = new Blob([JSON.stringify(analytics, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parent-student-links-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">Export Parent-Student Links</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Export Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
            <div className="grid grid-cols-1 gap-3">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="exportType"
                  value="csv"
                  checked={exportType === 'csv'}
                  onChange={(e) => setExportType(e.target.value)}
                  className="mr-3"
                />
                <FileSpreadsheet className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">CSV File</p>
                  <p className="text-sm text-gray-500">Excel compatible spreadsheet format</p>
                </div>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="exportType"
                  value="pdf"
                  checked={exportType === 'pdf'}
                  onChange={(e) => setExportType(e.target.value)}
                  className="mr-3"
                />
                <FileText className="w-5 h-5 text-red-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">PDF Report</p>
                  <p className="text-sm text-gray-500">Formatted document with charts and statistics</p>
                </div>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="exportType"
                  value="analytics"
                  checked={exportType === 'analytics'}
                  onChange={(e) => setExportType(e.target.value)}
                  className="mr-3"
                />
                <BarChart3 className="w-5 h-5 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Analytics Data</p>
                  <p className="text-sm text-gray-500">JSON format with detailed statistics</p>
                </div>
              </label>
            </div>
          </div>

          {/* Field Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Include Fields</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries({
                parentInfo: 'Parent Information',
                studentInfo: 'Student Details',
                schoolInfo: 'School Information',
                relationshipInfo: 'Relationship Type',
                statusInfo: 'Status & Verification',
                dateInfo: 'Dates & Timeline'
              }).map(([key, label]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedFields[key]}
                    onChange={(e) => setSelectedFields({
                      ...selectedFields,
                      [key]: e.target.checked
                    })}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Additional Options</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeFilters}
                  onChange={(e) => setIncludeFilters(e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Include current filter settings in export</span>
              </label>
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Export Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Records to export:</span>
                <span className="font-medium text-blue-900 ml-2">{links.length}</span>
              </div>
              <div>
                <span className="text-blue-700">Format:</span>
                <span className="font-medium text-blue-900 ml-2 capitalize">{exportType}</span>
              </div>
              <div>
                <span className="text-blue-700">Fields included:</span>
                <span className="font-medium text-blue-900 ml-2">
                  {Object.values(selectedFields).filter(Boolean).length} of 6
                </span>
              </div>
              <div>
                <span className="text-blue-700">Export date:</span>
                <span className="font-medium text-blue-900 ml-2">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={Object.values(selectedFields).every(val => !val)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
};



// Link Student Modal Component
const LinkStudentModal = ({ parent, allStudents, onLink, onClose }) => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter out students already linked to this parent
  const linkedStudentIds = parent.students.map(s => s.id);
  const availableStudents = allStudents.filter(student => 
    !linkedStudentIds.includes(student.id) &&
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedStudent) {
      onLink(parent.parentId, selectedStudent);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">
            Link Student to {parent.parentName}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Students
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search for students to link..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-blue-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              {availableStudents.length > 0 ? (
                availableStudents.map((student) => (
                  <div
                    key={student.id}
                    className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedStudent === student.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedStudent(student.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          selectedStudent === student.id ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <Users className={`w-4 h-4 ${
                            selectedStudent === student.id ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                          <p className="text-xs text-gray-500">{student.grade}</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="student"
                        value={student.id}
                        checked={selectedStudent === student.id}
                        onChange={() => setSelectedStudent(student.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p>No available students found</p>
                  <p className="text-sm">All students may already be linked to this parent</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedStudent}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <GitBranch className="w-4 h-4" />
                Link Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export {LinksManagement};