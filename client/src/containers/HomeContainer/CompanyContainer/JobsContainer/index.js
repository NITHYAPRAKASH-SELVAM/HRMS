import React, { Component } from 'react';
import { withAPI } from '../../../../services/api';
import withRouter from '../../../../services/withRouter';

import Jobs from '../../../../components/Home/Company/Jobs';

class JobsContainer extends Component {
  state = {
    jobs: [],
    isProcessing: false,
    selectedJobId: '',
    filterStatus: '',
    openJobIndex: null,
    applicantsByJobId: {}, // store applicants and scores per job here
  };

  componentDidMount() {
    this.loadJobs();
  }

  loadJobs = async () => {
    const { api } = this.props;
    try {
      const { data: jobs } = await api.getJobs();
      this.setState({ jobs });
    } catch (error) {
      console.error('Error fetching jobs:', error.message);
    }
  };

  normalizeStudentId = (studentId) => {
    if (typeof studentId === 'object' && studentId !== null) {
      return Object.values(studentId).join('');
    }
    return typeof studentId === 'string' ? studentId : '';
  };

  fetchApplicantsForJob = async (job) => {
    const { api } = this.props;
    const jobId = job._id;

    if (!job.applicants || job.applicants.length === 0) {
      this.setState(state => ({
        applicantsByJobId: {
          ...state.applicantsByJobId,
          [jobId]: [],
        },
      }));
      return;
    }

    try {
      // Fetch ranked applicants scores
      const { data: rankingData } = await api.getRankedApplicants(jobId);
      const scores = rankingData?.scores || {};

      // Fetch full profiles for applicants
      const populatedApplicants = await Promise.all(
        job.applicants.map(async (applicant) => {
          const rawStudentId = this.normalizeStudentId(applicant.studentId);
          if (!rawStudentId) return null;

          try {
            const { data: profile } = await api.getProfileById(rawStudentId);
            return {
              ...profile,
              studentId: rawStudentId,
              status: applicant.status,
              score: scores[rawStudentId] ?? null,
            };
          } catch (err) {
            console.error(`Profile fetch error for ${rawStudentId}:`, err.message);
            return null;
          }
        })
      );

      this.setState(state => ({
        applicantsByJobId: {
          ...state.applicantsByJobId,
          [jobId]: populatedApplicants.filter(Boolean),
        },
      }));
    } catch (err) {
      console.warn(`Ranking or applicants fetch failed for job ${jobId}:`, err.message);
      this.setState(state => ({
        applicantsByJobId: {
          ...state.applicantsByJobId,
          [jobId]: job.applicants, // fallback, raw applicants without profiles/scores
        },
      }));
    }
  };

  handleToggle = async (index) => {
    const { jobs, openJobIndex } = this.state;
    const newIndex = index === openJobIndex ? null : index;

    if (newIndex !== null) {
      // Fetch applicants only if not already fetched for that job
      const jobId = jobs[newIndex]._id;
      if (!this.state.applicantsByJobId[jobId]) {
        await this.fetchApplicantsForJob(jobs[newIndex]);
      }
    }

    this.setState({ openJobIndex: newIndex, filterStatus: '' }); // reset filter on toggle
  };

  handleDelete = async (e) => {
    const { api } = this.props;
    const jobId = e.target.dataset.id;

    this.setState({ isProcessing: true, selectedJobId: jobId });

    try {
      await api.deleteJob(jobId);
      await this.loadJobs();

      // Also remove cached applicants for deleted job
      this.setState(state => {
        const newApplicants = { ...state.applicantsByJobId };
        delete newApplicants[jobId];
        return { applicantsByJobId: newApplicants };
      });
    } catch (error) {
      console.error(error.response?.data?.message || 'Failed to delete job');
    } finally {
      this.setState({ isProcessing: false });
    }
  };

  handleStatusUpdate = async (jobId, studentId, status) => {
    const { api } = this.props;
    try {
      await api.updateApplicantStatus(jobId, studentId, status);
      // Refresh applicants data for this job after update
      const job = this.state.jobs.find(j => j._id === jobId);
      if (job) await this.fetchApplicantsForJob(job);
    } catch (error) {
      console.error(`Status update failed:`, error.message);
    }
  };

  handleStatusFilterChange = (status) => {
    this.setState({ filterStatus: status });
  };

  handleViewProfile = (studentId) => {
    this.props.navigate(`/profile/${studentId}`);
  };

  render() {
    const {
      jobs,
      isProcessing,
      selectedJobId,
      filterStatus,
      openJobIndex,
      applicantsByJobId,
    } = this.state;

    // Pass applicants for the open job only
    const jobsWithApplicants = jobs.map(job => ({
      ...job,
      applicants: applicantsByJobId[job._id] || [],
    }));

    return (
      <Jobs
        jobs={jobsWithApplicants}
        isProcessing={isProcessing}
        selectedJobId={selectedJobId}
        filterStatus={filterStatus}
        handleStatusFilterChange={this.handleStatusFilterChange}
        handleDelete={this.handleDelete}
        handleStatusUpdate={this.handleStatusUpdate}
        handleViewProfile={this.handleViewProfile}
        handleToggle={this.handleToggle}
        openJobIndex={openJobIndex}
      />
    );
  }
}

export default withRouter(withAPI(JobsContainer));
