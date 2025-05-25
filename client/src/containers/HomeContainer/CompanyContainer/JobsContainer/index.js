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
    const { data: jobs } = await api.getJobs();

    const jobsWithApplicants = await Promise.all(
      jobs.map(async (job) => {
        const { _id: jobId, applicants = [] } = job;

        // Skip ranking if no applicants
        if (!applicants.length) {
          console.log(`Skipping ranking for job ${jobId} — no applicants`);
          return { ...job, applicants: [] };
        }

        // Fetch scores
        let scores = {};
        try {
          const { data: rankingData } = await api.getRankedApplicants(jobId);
          scores = rankingData?.scores || {};
        } catch (err) {
          console.warn(`Ranking fetch failed for job ${jobId}:`, err.message);
        }

        // Populate applicants with profiles and scores
        const populatedApplicants = await Promise.all(
          applicants.map(async (applicant) => {
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

        return { ...job, applicants: populatedApplicants.filter(Boolean) };
      })
    );
    console.log("✅ Jobs with applicants:", jobsWithApplicants);
    this.setState({ jobs: jobsWithApplicants });
  } catch (error) {
    console.error('Error fetching jobs:', error.message);
  }
};


  handleDelete = async (e) => {
    const { api } = this.props;
    const jobId = e.target.dataset.id;

    this.setState({ isProcessing: true, selectedJobId: jobId });

    try {
      await api.deleteJob(jobId);
      await this.getJobsWithApplicantsAndScores();
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
      await this.getJobsWithApplicantsAndScores();
    } catch (error) {
      console.error(`Status update failed:`, error.message);
    }
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
