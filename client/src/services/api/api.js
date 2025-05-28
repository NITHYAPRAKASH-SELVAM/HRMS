import axios from 'axios';

class API {
  constructor() {
    axios.defaults.baseURL = 'http://localhost:5000';
    axios.defaults.headers.post['Content-Type'] = 'application/json';
  }

  // Helper to get auth header
  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Auth
  signUp = (role, data) => axios.post(`/api/user/signup/${role}`, data);
  logIn = (role, data) => axios.post(`/api/user/login/${role}`, data);

  // Companies
  getCompanies = () =>
    axios.get('/api/companies', { headers: this.getAuthHeader() });

  getCompany = id =>
    axios.get(`/api/companies/${id}`, { headers: this.getAuthHeader() });

  deleteCompany = id =>
    axios.delete(`/api/companies/${id}`, { headers: this.getAuthHeader() });

  // Students
  getStudents = () =>
    axios.get('/api/students', { headers: this.getAuthHeader() });

  getStudent = id =>
    axios.get(`/api/students/${id}`, { headers: this.getAuthHeader() });

  deleteStudent = id =>
    axios.delete(`/api/students/${id}`, { headers: this.getAuthHeader() });

  // Jobs
  getJobs = () => axios.get('/api/jobs', { headers: this.getAuthHeader() });

  getJob = id => axios.get(`/api/jobs/${id}`, { headers: this.getAuthHeader() });

  postJob = data =>
    axios.post('/api/jobs', data, { headers: this.getAuthHeader() });

  applyToJob = (id, data) =>
    axios.patch(`/api/jobs/${id}/apply`, data, { headers: this.getAuthHeader() });

  updateApplicantStatus = (jobId, studentId, status) =>
    axios.patch(
      `/api/jobs/${jobId}/status`,
      { studentId, status },
      { headers: this.getAuthHeader() }
    );

  getAppliedJobs = () =>
    axios.get('/api/jobs/applied/me', { headers: this.getAuthHeader() });

  // AI Ranking
  getRankedApplicants = jobId =>
    axios.get(`/api/jobs/${jobId}/ranked-applicants`, {
      headers: this.getAuthHeader(),
    });
  getApplicantScreening=(jobId, studentId) =>
    axios.get(`/api/jobs/${jobId}/${studentId}`, {
      headers: this.getAuthHeader(),
    });

  deleteJob = id =>
    axios.delete(`/api/jobs/${id}`, { headers: this.getAuthHeader() });

  // Profile
  getProfile = () => axios.get('/api/profile', { headers: this.getAuthHeader() });

  getProfileById = id =>
    axios.get(`/api/profile/${id}`, { headers: this.getAuthHeader() });

  updateProfile = data => {
    console.log('API call: PATCH /api/profile');
    return axios.patch('/api/profile', data, { headers: this.getAuthHeader() });
  };

  getStudentById = id => this.getStudent(id);
}

export default API;
