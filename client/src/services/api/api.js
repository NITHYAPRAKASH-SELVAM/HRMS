import axios from 'axios';

class API {
  constructor() {
    axios.defaults.baseURL = 'http://localhost:5000';
    axios.defaults.headers.post['Content-Type'] = 'application/json';
  }

  // Auth
  signUp = (role, data) => axios.post(`/api/user/signup/${role}`, data);
  logIn = (role, data) => axios.post(`/api/user/login/${role}`, data);

  // Companies
  getCompanies = () =>
    axios.get('/api/companies', {
      headers: { 'Auth-Token': localStorage.getItem('token') },
    });

  getCompany = id =>
    axios.get(`/api/companies/${id}`, {
      headers: { 'Auth-Token': localStorage.getItem('token') },
    });

  deleteCompany = id =>
    axios.delete(`/api/companies/${id}`, {
      headers: { 'Auth-Token': localStorage.getItem('token') },
    });

  // Students
  getStudents = () =>
    axios.get('/api/students', {
      headers: { 'Auth-Token': localStorage.getItem('token') },
    });

  getStudent = id =>
    axios.get(`/api/students/${id}`, {
      headers: { 'Auth-Token': localStorage.getItem('token') },
    });

  deleteStudent = id =>
    axios.delete(`/api/students/${id}`, {
      headers: { 'Auth-Token': localStorage.getItem('token') },
    });

  // Jobs
  getJobs = () =>
    axios.get('/api/jobs', {
      headers: { 'Auth-Token': localStorage.getItem('token') },
    });

  getJob = id =>
    axios.get(`/api/jobs/${id}`, {
      headers: { 'Auth-Token': localStorage.getItem('token') },
    });

  postJob = data =>
    axios.post('/api/jobs', data, {
      headers: { 'Auth-Token': localStorage.getItem('token') },
    });

  applyToJob = (id, data) =>
    axios.patch(`/api/jobs/${id}/apply`, data, {
      headers: { 'Auth-Token': localStorage.getItem('token') },
    });
    
  updateApplicantStatus = (jobId, studentId, status) =>
    axios.patch(
      `/api/jobs/${jobId}/status`,
      { studentId, status },
      {
        headers: { 'Auth-Token': localStorage.getItem('token') },
      }
    );
  getAppliedJobs = () =>
    axios.get('/api/jobs/applied/me', {
            headers: { 'Auth-Token': localStorage.getItem('token') },
      }
    );
  

  deleteJob = id =>
    axios.delete(`/api/jobs/${id}`, {
      headers: { 'Auth-Token': localStorage.getItem('token') },
    });

  // Profile
  getProfile = () =>
    axios.get('/api/profile', {
      headers: { 'Auth-Token': localStorage.getItem('token') },
    });

  getProfileById = id =>
    axios.get(`/api/profile/${id}`, {
      headers: { 'Auth-Token': localStorage.getItem('token') },
    });

  updateProfile = data => {
    console.log('API call: PATCH /api/profile');
    return axios.patch('/api/profile', data, {
      headers: { 'Auth-Token': localStorage.getItem('token') },
    });
  };
}

export default API;
