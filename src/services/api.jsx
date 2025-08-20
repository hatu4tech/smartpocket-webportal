import { API_BASE_URL } from '../utils/constants';

const getAuthToken = () => {
  return localStorage.getItem('accessToken') || localStorage.getItem('token');
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || response.statusText || 'An error occurred');
  }
  return data;
};

export const apiService = {
  async request(endpoint, options = {}) {
    const token = getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return handleResponse(response);
  },

// Schools API
  async getSchools() {
    return this.request('/schools');
  },

  async getSchool(id) {
    return this.request(`/schools/${id}`);
  },

  async createSchool(schoolData) {
    return this.request('/schools', {
      method: 'POST',
      body: JSON.stringify(schoolData),
    });
  },

  async updateSchool(id, schoolData) {
    return this.request(`/schools/${id}`, {
      method: 'PUT',
      body: JSON.stringify(schoolData),
    });
  },

  async deleteSchool(id) {
    return this.request(`/schools/${id}`, {
      method: 'DELETE',
    });
  },

  // Parents API
  async getSchoolParents(schoolId) {
    return this.request(`/schools/${schoolId}/parents`);
  },

  async getSchoolParent(schoolId, parentId) {
    return this.request(`/schools/${schoolId}/parents/${parentId}`);
  },

  async createSchoolParent(schoolId, parentData) {
    return this.request(`/schools/${schoolId}/parents`, {
      method: 'POST',
      body: JSON.stringify(parentData),
    });
  },

  async updateSchoolParent(schoolId, parentId, parentData) {
    return this.request(`/schools/${schoolId}/parents/${parentId}`, {
      method: 'PUT',
      body: JSON.stringify(parentData),
    });
  },

  async deleteSchoolParent(schoolId, parentId) {
    return this.request(`/schools/${schoolId}/parents/${parentId}`, {
      method: 'DELETE',
    });
  },

  // Students API
  async getSchoolStudents(schoolId) {
    return this.request(`/schools/${schoolId}/students`);
  },

  async getSchoolStudent(schoolId, studentId) {
    return this.request(`/schools/${schoolId}/students/${studentId}`);
  },

  async createSchoolStudent(schoolId, studentData) {
    return this.request(`/schools/${schoolId}/students`, {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  },

  async updateSchoolStudent(schoolId, studentId, studentData) {
    return this.request(`/schools/${schoolId}/students/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  },

  async deleteSchoolStudent(schoolId, studentId) {
    return this.request(`/schools/${schoolId}/students/${studentId}`, {
      method: 'DELETE',
    });
  },

  // Parent-Student relationship
  async getParentStudentsInSchool(schoolId, parentId) {
    return this.request(`/schools/${schoolId}/parents/${parentId}/students`);
  },

  // School statistics
  async getSchoolStats(schoolId) {
    return this.request(`/schools/${schoolId}/stats`);
  },

  async getSchoolDashboard(schoolId) {
    return this.request(`/schools/${schoolId}/dashboard`);
  },


//=================== Parent-Student Relationship Management

  // Get all students linked to a parent
  async getParentStudents(parentId) {
    return this.request(`/parents/${parentId}/students`);
  },

  // Get specific parent-student relationship
  async getParentStudent(parentId, studentId) {
    return this.request(`/parents/${parentId}/students/${studentId}`);
  },

  // Link a student to a parent
  async addStudentToParent(schoolId, parentId, studentData) {
    return this.request(`/schools/${schoolId}/parents/${parentId}/students`, {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  },

  // Unlink a student from a parent
  async removeStudentFromParent(parentId, studentId) {
    return this.request(`/parents/${parentId}/students/${studentId}`, {
      method: 'DELETE',
    });
  },

// USE THIS METHOD FOR SCHOOL CONTEXT 
// Alternative method with explicit school context (if needed)
// async removeStudentFromParentInSchool(schoolId, parentId, studentId) {
//   return this.request(`/schools/${schoolId}/parents/${parentId}/students/${studentId}`, {
//     method: 'DELETE',
//   });
// },

  // Parent management for UI
  async getAllParents(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/parents${queryParams ? '?' + queryParams : ''}`);
  },

  async getParent(parentId) {
    return this.request(`/parents/${parentId}`);
  },

  async searchParents(query) {
    return this.request(`/parents/search?q=${encodeURIComponent(query)}`);
  },

  async filterParents(filters) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/parents/filter?${queryParams}`);
  },

  async getParentInSchool(schoolId, parentId) {
    return this.request(`/school/${schoolId}/parents/${parentId}`);
  },
  
  // Link student to parent (wrapper for better naming)
  async linkStudentToParent(parentId, studentId, relationshipData = {}) {
    return this.addStudentToParent(parentId, { 
      student_id: studentId, 
      ...relationshipData 
    });
  },

  // Unlink student from parent (wrapper for better naming)
  async unlinkStudentFromParent(parentId, studentId) {
    return this.removeStudentFromParent(parentId, studentId);
  }

};
