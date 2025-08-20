import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Search, Plus, X, Users, UserCheck, AlertCircle, Loader2, School } from 'lucide-react';

const LinkManagement = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [parentStudents, setParentStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkingStudent, setLinkingStudent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [modalSearchQuery, setModalSearchQuery] = useState('');

  // Load schools on component mount
  useEffect(() => {
    loadSchools();
  }, []);

  // Load parents and students when school changes
  useEffect(() => {
    if (selectedSchool?.id) {
      loadParentsAndStudents();
    }
  }, [selectedSchool]);

  // Reset modal search when modal opens/closes
  useEffect(() => {
    if (!showLinkModal) {
      setModalSearchQuery('');
    }
  }, [showLinkModal]);

  const loadSchools = async () => {
    setLoading(true);
    try {
      const response = await apiService.getSchools();
      const schoolsArray = response.schools || [];
      setSchools(schoolsArray);
      
      if (schoolsArray.length > 0) {
        setSelectedSchool(schoolsArray[0]);
      }
      
      console.log('Loaded schools:', schoolsArray);

    } catch (err) {
      setError('Failed to load schools: ' + err.message);
      console.error('School loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadParentsAndStudents = async () => {
    if (!selectedSchool?.id) return;
    
    setLoading(true);
    try {
      const [parentsData, studentsData] = await Promise.all([
        apiService.getSchoolParents(selectedSchool.id),
        apiService.getSchoolStudents(selectedSchool.id)
      ]);

      setParents(parentsData.parents || []);
      setStudents(studentsData.students || []);
      
      setSelectedParent(null);
      setParentStudents([]);

      console.log('Loaded parents:', parentsData.parents);
      console.log('Loaded students:', studentsData.students); 

    } catch (err) {
      setError('Failed to load data: ' + err.message);
      console.error('Data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadParentStudents = async (parentId) => {
    if (!selectedSchool?.id || !parentId) return;

    try {
      // Try the existing endpoint first
      let data;
      try {
        data = await apiService.getParentStudentsInSchool(selectedSchool.id, parentId);
      } catch (err) {
        console.warn('School-specific endpoint failed, trying direct parent endpoint:', err);
        // Fallback to direct parent endpoint if school-specific one fails
        try {
          data = await apiService.getParentStudents(parentId);
        } catch (fallbackErr) {
          console.error('Both endpoints failed:', fallbackErr);
          throw fallbackErr;
        }
      }
      
      const studentsArray = Array.isArray(data) ? data : data.students || [];
      
      // Filter students to only show those from the selected school
      const schoolStudents = studentsArray.filter(student => 
        students.some(schoolStudent => schoolStudent.id === student.id)
      );
      
      setParentStudents(schoolStudents);

    } catch (err) {
      console.error('Failed to load parent students:', err);
      setParentStudents([]);
      // Don't show error message for this, as it might be expected for parents with no students
    }
  };

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school);
    setError('');
    setSuccess('');
  };

  const handleParentSelect = async (parent) => {
    setSelectedParent(parent);
    setError('');
    setSuccess('');
    await loadParentStudents(parent.id);
  };

  const openLinkModal = () => {
    if (!selectedParent) return;
    
    const linkedStudentIds = parentStudents.map(s => s.id);
    const available = students.filter(s => !linkedStudentIds.includes(s.id));
    setAvailableStudents(available);
    setShowLinkModal(true);
    setModalSearchQuery('');
  };

  const handleLinkStudent = async (studentId) => {
    if (!selectedParent || linkingStudent) return;

    setLinkingStudent(true);
    setError(''); // Clear previous errors

    try {
      // Use apiService to link the student
      await apiService.addStudentToParent(selectedParent.schoolId, selectedParent.id, { student_id: studentId });

      setSuccess('Student linked successfully!');
      setShowLinkModal(false);

      // Refresh the list of linked students
      await loadParentStudents(selectedParent.id);

      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {
      setError('Failed to link student: ' + (err.message || 'Unknown error'));
      console.error('Link student error:', err);
    } finally {
      setLinkingStudent(false);
    }
  };

  const handleUnlinkStudent = async (studentId) => {
    if (!selectedParent) return;
    
    if (!window.confirm('Are you sure you want to unlink this student from the parent?')) {
      return;
    }

    try {
      setError(''); // Clear any previous errors
      
      setSuccess(''); // Clear previous success messages
      console.log('Unlinking student:', studentId, 'from parent:', selectedParent.id);
      await apiService.removeStudentFromParent(selectedParent.id, studentId);
      
      setSuccess('Student unlinked successfully!');
      await loadParentStudents(selectedParent.id);
      
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Unlink student error:', err);
      setError(`Failed to unlink student: ${err.message}`);
    }
  };

  // Filter parents based on search
  const filteredParents = parents.filter(parent =>
    `${parent.first_name} ${parent.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    parent.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    parent.phone?.includes(searchQuery)
  );

  // Filter available students in modal based on search
  const filteredAvailableStudents = availableStudents.filter(student => {
    const searchTerm = modalSearchQuery.toLowerCase();
    return (
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm) ||
      student.email?.toLowerCase().includes(searchTerm) ||
      student.phone?.includes(modalSearchQuery) ||
      student.student_id?.toLowerCase().includes(searchTerm) ||
      student.grade?.toString().includes(modalSearchQuery)
    );
  });

  if (loading && schools.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading schools...</span>
      </div>
    );
  }

  if (schools.length === 0 && !loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center py-16 text-gray-500">
          <School className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No schools found. Please contact your administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Parent-Student Relationship Manager</h2>
        <p className="text-gray-600">Manage relationships between parents and students in the school</p>
      </div>

      {/* School Selection */}
      {schools.length > 1 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select School
          </label>
          <select
            value={selectedSchool?.id || ''}
            onChange={(e) => {
              const school = schools.find(s => s.id === parseInt(e.target.value) || s.id === e.target.value);
              handleSchoolSelect(school);
            }}
            className="w-full max-w-md px-3 text-gray-600 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a school...</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Show current school */}
      {selectedSchool && (
        <div className="mb-4 p-3 bg-gray-100 rounded-md">
          <div className="flex items-center">
            <School className="w-5 h-5 text-gray-600 mr-2" />
            <span className="text-sm text-gray-700">
              Managing: <strong>{selectedSchool.name}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Error and Success Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
          <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
          <UserCheck className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-700">{success}</span>
          <button onClick={() => setSuccess('')} className="ml-auto text-green-500 hover:text-green-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Only show main content if a school is selected */}
      {selectedSchool ? (
        <>
          {loading && parents.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Loading parents and students...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Parents List */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Parents</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search parents by name, email, or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border text-gray-600 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredParents.map((parent) => (
                    <div
                      key={parent.id}
                      onClick={() => handleParentSelect(parent)}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedParent?.id === parent.id
                          ? 'bg-blue-100 border-2 border-blue-300'
                          : 'bg-white border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">
                            {parent.first_name} {parent.last_name}
                          </p>
                          <p className="text-sm text-gray-600">{parent.email}</p>
                          {parent.phone && (
                            <p className="text-sm text-gray-600">{parent.phone}</p>
                          )}
                        </div>
                        <Users className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>

                {filteredParents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {searchQuery ? 'No parents found matching your search' : 'No parents found'}
                  </div>
                )}
              </div>

              {/* Selected Parent's Students */}
              <div className="bg-gray-50 p-4 rounded-lg">
                {selectedParent ? (
                  <>
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {selectedParent.firstName} {selectedParent.lastName}'s Students
                        </h3>
                        <p className="text-sm text-gray-600">
                          {parentStudents.length} student{parentStudents.length !== 1 ? 's' : ''} linked
                        </p>
                      </div>
                      <button
                        onClick={openLinkModal}
                        disabled={linkingStudent}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Link Student
                      </button>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {parentStudents.map((student) => (
                        <div
                          key={student.id}
                          className="p-3 bg-white border border-gray-200 rounded-md flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {student.firstName} {student.lastName}
                            </p>
                            {student.email && (
                              <p className="text-sm text-gray-600">Email: {student.email}</p>
                            )}
                            {student.phone && (
                              <p className="text-sm text-gray-600">phone: {student.phone}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleUnlinkStudent(student.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                            title="Unlink student"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {parentStudents.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No students linked to this parent
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a parent to view and manage their linked students</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <School className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Please select a school to manage parent-student relationships</p>
        </div>
      )}

      {/* Link Student Modal */}
      {showLinkModal && selectedParent && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200/30 bg-white/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  Link Student to {selectedParent.firstName} {selectedParent.lastName}
                </h3>
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                  disabled={linkingStudent}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Search input for modal */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search students by name, ID, grade..."
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border text-gray-600 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                  disabled={linkingStudent}
                />
              </div>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto bg-white/30 backdrop-blur-sm">
              {filteredAvailableStudents.length > 0 ? (
                <div className="space-y-2">
                  {filteredAvailableStudents.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => handleLinkStudent(student.id)}
                      disabled={linkingStudent}
                      className="w-full p-4 border border-white/30 bg-white/60 backdrop-blur-sm rounded-lg hover:bg-white/80 disabled:bg-gray-200/50 disabled:cursor-not-allowed transition-all text-left shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-base">
                            {student.firstName} {student.lastName}
                          </p>
                          <div className="mt-1 space-y-1">
                            {student.grade && (
                              <p className="text-sm font-medium text-gray-700">Grade: {student.grade}</p>
                            )}
                            {student.student_id && (
                              <p className="text-sm text-gray-600">Student ID: {student.student_id}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center ml-3">
                          {linkingStudent ? (
                            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                          ) : (
                            <div className="flex items-center text-blue-600">
                              <Plus className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">Link</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-700">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  {modalSearchQuery ? (
                    <>
                      <p className="font-medium">No students found</p>
                      <p className="text-sm text-gray-600 mt-1">Try adjusting your search terms</p>
                    </>
                  ) : availableStudents.length === 0 ? (
                    <>
                      <p className="font-medium">All students are already linked</p>
                      <p className="text-sm text-gray-600 mt-1">This parent is connected to all available students</p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium">Start typing to search</p>
                      <p className="text-sm text-gray-600 mt-1">{availableStudents.length} students available to link</p>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200/30 bg-white/50">
              <button
                onClick={() => setShowLinkModal(false)}
                disabled={linkingStudent}
                className="w-full px-4 py-2 bg-gray-600/80 backdrop-blur-sm text-white rounded-lg hover:bg-gray-700/80 disabled:bg-gray-400/50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkManagement;