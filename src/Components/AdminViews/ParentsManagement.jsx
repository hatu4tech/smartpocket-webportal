import React, { useState } from 'react';
import { 
  User, Plus, Search, Edit, Eye, Trash2, Filter, 
  Download, Upload, Users, Mail, Phone, MapPin,
  ChevronDown, X, Save, AlertCircle, Link
} from 'lucide-react';

const ParentsManagement = () => {
  const [parents, setParents] = useState([
    {
      id: 1,
      name: 'Jane Doe',
      email: 'jane.doe@email.com',
      phone: '+260 97 123 4568',
      address: '123 Main Street, Lusaka',
      children: ['John Doe', 'Sarah Doe'],
      schools: ['Green Valley High School'],
      status: 'active',
      registrationDate: '2024-01-10'
    },
    {
      id: 2,
      name: 'Robert Smith',
      email: 'robert.smith@email.com',
      phone: '+260 96 987 6544',
      address: '456 Oak Avenue, Lusaka',
      children: ['Mary Smith'],
      schools: ['Riverside Academy'],
      status: 'active',
      registrationDate: '2023-08-25'
    },
    {
      id: 3,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+260 95 555 1235',
      address: '789 Pine Road, Lusaka',
      children: ['David Wilson', 'Emma Wilson'],
      schools: ['Green Valley High School', 'Central Primary School'],
      status: 'pending',
      registrationDate: '2024-02-15'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);

  const schools = ['Green Valley High School', 'Riverside Academy', 'Central Primary School'];
  const statuses = ['active', 'pending', 'inactive'];

  const filteredParents = parents.filter(parent => {
    const matchesSearch = parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parent.children.some(child => child.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSchool = !selectedSchool || parent.schools.includes(selectedSchool);
    const matchesStatus = !selectedStatus || parent.status === selectedStatus;
    
    return matchesSearch && matchesSchool && matchesStatus;
  });

  const handleAddParent = (parentData) => {
    const newParent = {
      id: parents.length + 1,
      ...parentData,
      status: 'active',
      registrationDate: new Date().toISOString().split('T')[0]
    };
    setParents([...parents, newParent]);
    setShowAddModal(false);
  };

  const handleEditParent = (parentData) => {
    setParents(parents.map(parent => 
      parent.id === selectedParent.id ? { ...parent, ...parentData } : parent
    ));
    setShowEditModal(false);
    setSelectedParent(null);
  };

  const handleDeleteParent = (parentId) => {
    if (window.confirm('Are you sure you want to delete this parent? This will also remove their links to students.')) {
      setParents(parents.filter(parent => parent.id !== parentId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parents Management</h1>
          <p className="text-gray-600">Manage parent accounts and family relationships</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Parent
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search parents or children..."
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

      {/* Parents Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Parent</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Children</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Schools</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Registered</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredParents.map((parent) => (
                <tr key={parent.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{parent.name}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {parent.email}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {parent.phone}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {parent.address}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      {parent.children.map((child, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <Users className="w-3 h-3 text-gray-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{child}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      {parent.schools.map((school, index) => (
                        <span 
                          key={index}
                          className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs mr-1 mb-1"
                        >
                          {school}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      parent.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : parent.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {parent.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-900">{parent.registrationDate}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedParent(parent);
                          setShowEditModal(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Link className="w-4 h-4 text-green-600" />
                      </button>
                      <button 
                        onClick={() => handleDeleteParent(parent.id)}
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

        {filteredParents.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No parents found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Add Parent Modal */}
      {showAddModal && (
        <ParentModal
          title="Add New Parent"
          onSave={handleAddParent}
          onClose={() => setShowAddModal(false)}
          schools={schools}
        />
      )}

      {/* Edit Parent Modal */}
      {showEditModal && selectedParent && (
        <ParentModal
          title="Edit Parent"
          parent={selectedParent}
          onSave={handleEditParent}
          onClose={() => {
            setShowEditModal(false);
            setSelectedParent(null);
          }}
          schools={schools}
        />
      )}
    </div>
  );
};

// Parent Modal Component
const ParentModal = ({ title, parent, onSave, onClose, schools }) => {
  const [formData, setFormData] = useState({
    name: parent?.name || '',
    email: parent?.email || '',
    phone: parent?.phone || '',
    address: parent?.address || '',
    children: parent?.children?.join(', ') || '',
    schools: parent?.schools || []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      children: formData.children.split(',').map(child => child.trim()).filter(child => child),
      schools: formData.schools
    };
    onSave(processedData);
  };

  const toggleSchool = (school) => {
    setFormData(prev => ({
      ...prev,
      schools: prev.schools.includes(school)
        ? prev.schools.filter(s => s !== school)
        : [...prev.schools, school]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parent Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Children Names (comma separated)
            </label>
            <input
              type="text"
              placeholder="John Doe, Jane Doe"
              value={formData.children}
              onChange={(e) => setFormData({...formData, children: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Associated Schools
            </label>
            <div className="space-y-2">
              {schools.map(school => (
                <label key={school} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.schools.includes(school)}
                    onChange={() => toggleSchool(school)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{school}</span>
                </label>
              ))}
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
              Save Parent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { ParentsManagement };