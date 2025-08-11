import React, { useState } from 'react';
import { 
  Link, Plus, Search, Edit, Eye, Trash2, Filter, 
  Download, Upload, Users, User, School, AlertCircle,
  ChevronDown, X, Save, CheckCircle, Clock, XCircle
} from 'lucide-react';

const LinksManagement = () => {
  const [links, setLinks] = useState([
    {
      id: 1,
      parentName: 'Jane Doe',
      parentEmail: 'jane.doe@email.com',
      studentName: 'John Doe',
      studentEmail: 'john.doe@email.com',
      school: 'Green Valley High School',
      grade: 'Grade 10',
      relationship: 'Mother',
      status: 'active',
      createdDate: '2024-01-15',
      verifiedDate: '2024-01-16'
    },
    {
      id: 2,
      parentName: 'Jane Doe',
      parentEmail: 'jane.doe@email.com',
      studentName: 'Sarah Doe',
      studentEmail: 'sarah.doe@email.com',
      school: 'Green Valley High School',
      grade: 'Grade 8',
      relationship: 'Mother',
      status: 'active',
      createdDate: '2024-01-15',
      verifiedDate: '2024-01-16'
    },
    {
      id: 3,
      parentName: 'Robert Smith',
      parentEmail: 'robert.smith@email.com',
      studentName: 'Mary Smith',
      studentEmail: 'mary.smith@email.com',
      school: 'Riverside Academy',
      grade: 'Grade 12',
      relationship: 'Father',
      status: 'active',
      createdDate: '2023-09-01',
      verifiedDate: '2023-09-02'
    },
    {
      id: 4,
      parentName: 'Sarah Wilson',
      parentEmail: 'sarah.wilson@email.com',
      studentName: 'David Wilson',
      studentEmail: 'david.wilson@email.com',
      school: 'Green Valley High School',
      grade: 'Grade 9',
      relationship: 'Mother',
      status: 'pending',
      createdDate: '2024-02-20',
      verifiedDate: null
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);

  const schools = ['Green Valley High School', 'Riverside Academy', 'Central Primary School'];
  const statuses = ['active', 'pending', 'inactive'];
  const relationships = ['Father', 'Mother', 'Guardian', 'Grandparent', 'Other'];

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.parentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSchool = !selectedSchool || link.school === selectedSchool;
    const matchesStatus = !selectedStatus || link.status === selectedStatus;
    
    return matchesSearch && matchesSchool && matchesStatus;
  });

  const handleAddLink = (linkData) => {
    const newLink = {
      id: links.length + 1,
      ...linkData,
      status: 'pending',
      createdDate: new Date().toISOString().split('T')[0],
      verifiedDate: null
    };
    setLinks([...links, newLink]);
    setShowAddModal(false);
  };

  const handleEditLink = (linkData) => {
    setLinks(links.map(link => 
      link.id === selectedLink.id ? { ...link, ...linkData } : link
    ));
    setShowEditModal(false);
    setSelectedLink(null);
  };

  const handleDeleteLink = (linkId) => {
    if (window.confirm('Are you sure you want to delete this parent-student link?')) {
      setLinks(links.filter(link => link.id !== linkId));
    }
  };

  const handleVerifyLink = (linkId) => {
    setLinks(links.map(link => 
      link.id === linkId 
        ? { 
            ...link, 
            status: 'active', 
            verifiedDate: new Date().toISOString().split('T')[0] 
          } 
        : link
    ));
  };

  const handleRejectLink = (linkId) => {
    if (window.confirm('Are you sure you want to reject this link?')) {
      setLinks(links.map(link => 
        link.id === linkId ? { ...link, status: 'inactive' } : link
      ));
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parent-Student Links</h1>
          <p className="text-gray-600">Manage relationships between parents and students</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import Links
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Links
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
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
              <p className="text-2xl font-bold text-gray-900">{links.length}</p>
              <p className="text-sm text-gray-600">Total Links</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <School className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(links.map(link => link.school)).size}
              </p>
              <p className="text-sm text-gray-600">Schools Involved</p>
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Schools</option>
              {schools.map(school => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
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

          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
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
                <th className="text-left py-4 px-6 font-medium text-gray-900">Student</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">School & Grade</th>
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
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{link.studentName}</p>
                        <p className="text-sm text-gray-500">{link.studentEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{link.school}</p>
                      <p className="text-sm text-gray-500">{link.grade}</p>
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

      {/* Add Link Modal */}
      {showAddModal && (
        <LinkModal
          title="Create New Link"
          onSave={handleAddLink}
          onClose={() => setShowAddModal(false)}
          schools={schools}
          relationships={relationships}
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
        />
      )}
    </div>
  );
};

// Link Modal Component
const LinkModal = ({ title, link, onSave, onClose, schools, relationships }) => {
  const [formData, setFormData] = useState({
    parentName: link?.parentName || '',
    parentEmail: link?.parentEmail || '',
    studentName: link?.studentName || '',
    studentEmail: link?.studentEmail || '',
    school: link?.school || '',
    grade: link?.grade || '',
    relationship: link?.relationship || ''
  });

  const grades = ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Parent Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">
                Parent Information
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.parentName}
                  onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({...formData, parentEmail: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship *
                </label>
                <select
                  required
                  value={formData.relationship}
                  onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Relationship</option>
                  {relationships.map(relationship => (
                    <option key={relationship} value={relationship}>{relationship}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Student Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">
                Student Information
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.studentEmail}
                  onChange={(e) => setFormData({...formData, studentEmail: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School *
                </label>
                <select
                  required
                  value={formData.school}
                  onChange={(e) => setFormData({...formData, school: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select School</option>
                  {schools.map(school => (
                    <option key={school} value={school}>{school}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade *
                </label>
                <select
                  required
                  value={formData.grade}
                  onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Grade</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { LinksManagement };