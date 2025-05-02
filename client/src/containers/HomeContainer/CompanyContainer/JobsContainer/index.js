import React, { Component } from 'react';
import { withAPI } from '../../../../services/api';
import { withRouter } from '../../../../utils/withRouter'; // optional helper if you're using React Router v6 and class components

import Jobs from '../../../../components/Home/Company/Jobs';

class JobsContainer extends Component {
  state = {
    jobs: [],
    isProcessing: false,
    selectedJobId: '',
    filterStatus: 'all',
  };

  componentDidMount() {
    this.getJobs();
  }

  getJobs = () => {
    const { api } = this.props;

    api
      .getJobs()
      .then(async response => {
        const { data } = response;

        const jobPromises = data.map(async job => {
          const applicants = job.applicants;

          const profilePromises = applicants.map(async applicant => {
            try {
              const res = await api.getProfileById(applicant.studentId);
              return {
                ...res.data,
                status: applicant.status,
                studentId: applicant.studentId,
              };
            } catch (err) {
              console.error('Error fetching applicant:', err.message);
              return null;
            }
          });

          const populatedApplicants = (await Promise.all(profilePromises)).filter(Boolean);
          return { ...job, applicants: populatedApplicants };
        });

        const jobsWithApplicants = await Promise.all(jobPromises);
        this.setState({ jobs: jobsWithApplicants });
      })
      .catch(error => {
        console.error('Error fetching jobs:', error.message);
      });
  };

  handleDelete = e => {
    const { api } = this.props;
    const id = e.target.dataset.id;

    this.setState({ isProcessing: true, selectedJobId: id });

    api
      .deleteJob(id)
      .then(() => this.getJobs())
      .catch(error => console.log(error.response?.data?.message))
      .finally(() => this.setState({ isProcessing: false }));
  };

  handleStatusUpdate = (jobId, studentId, status) => {
    const { api } = this.props;

    api
      .updateApplicantStatus(jobId, studentId, status)
      .then(() => this.getJobs())
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
