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
  };

  componentDidMount() {
    this.getJobsWithApplicantsAndScores();
  }

  normalizeStudentId = (studentId) => {
    if (typeof studentId === 'object' && studentId !== null) {
      return Object.values(studentId).join('');
    }
    return typeof studentId === 'string' ? studentId : '';
  };

  getJobsWithApplicantsAndScores = async () => {
    const { api } = this.props;

    try {
      const response = await api.getJobs();
      const jobs = response.data;

      const jobPromises = jobs.map(async (job) => {
        const { _id: jobId, applicants = [] } = job;

        // Fetch ranking scores for applicants
        let scores = {};
        try {
          const rankingResponse = await api.get(`/jobs/${jobId}/ranked-applicants`);
          scores = rankingResponse.data?.scores || {};
        } catch (err) {
          console.warn(`Ranking fetch failed for job ${jobId}:`, err.message);
        }

        const profilePromises = applicants.map(async (applicant) => {
          const rawStudentId = this.normalizeStudentId(applicant.studentId);
          if (!rawStudentId) return null;

          try {
            const profileRes = await api.getProfileById(rawStudentId);
            return {
              ...profileRes.data,
              studentId: rawStudentId,
              status: applicant.status,
              score: scores[rawStudentId] ?? null,
            };
          } catch (err) {
            console.error(`Error fetching profile for ${rawStudentId}:`, err.message);
            return null;
          }
        });

        const populatedApplicants = (await Promise.all(profilePromises)).filter(Boolean);
        return { ...job, applicants: populatedApplicants };
      });

      const jobsWithApplicants = await Promise.all(jobPromises);
      this.setState({ jobs: jobsWithApplicants });
    } catch (error) {
      console.error('Error fetching jobs:', error.message);
    }
  };

  handleDelete = (e) => {
    const { api } = this.props;
    const id = e.target.dataset.id;

    this.setState({ isProcessing: true, selectedJobId: id });

    api
      .deleteJob(id)
      .then(() => this.getJobsWithApplicantsAndScores())
      .catch(error => console.error(error.response?.data?.message))
      .finally(() => this.setState({ isProcessing: false }));
  };

  handleStatusUpdate = (jobId, studentId, status) => {
    const { api } = this.props;

    api
      .updateApplicantStatus(jobId, studentId, status)
      .then(() => this.getJobsWithApplicantsAndScores())
      .catch(error => {
        console.error('Error updating status:', error.message);
      });
  };

  handleViewProfile = (studentId) => {
    this.props.navigate(`/profile/${studentId}`);
  };

  handleStatusFilterChange = (status) => {
    this.setState({ filterStatus: status });
  };

  render() {
    const { jobs, isProcessing, selectedJobId, filterStatus } = this.state;

    return (
      <Jobs
        jobs={jobs}
        handleDelete={this.handleDelete}
        isProcessing={isProcessing}
        selectedJobId={selectedJobId}
        filterStatus={filterStatus}
        handleStatusFilterChange={this.handleStatusFilterChange}
        handleStatusUpdate={this.handleStatusUpdate}
        handleViewProfile={this.handleViewProfile}
      />
    );
  }
}

export default withRouter(withAPI(JobsContainer));
