import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withAPI } from '../../../../services/api';
import Jobs from '../../../../components/Home/Student/Jobs';

class JobsContainer extends Component {
  state = {
    jobs: [],
    appliedJobs: {}, // new: store jobId → status
    isProcessing: false,
    selectedJobId: '',
    filterStatus: 'all',
  };

  componentDidMount() {
    this.fetchJobs();
    this.fetchAppliedJobs();
  }

  fetchJobs = async () => {
    const { api } = this.props;
    try {
      const response = await api.getJobs();
      this.setState({ jobs: response.data });
    } catch (error) {
      console.error('Failed to fetch jobs:', error.response?.data?.message || error.message);
    }
  };

  fetchAppliedJobs = async () => {
  const { api, _id } = this.props;
  try {
    const response = await api.getAppliedJobs();

    const jobStatusMap = {};
    response.data.forEach(job => {
      const applicant = job.applicant;

      console.log('📦 Job ID:', job._id, 'Applicant:', applicant); // ✅ Debug

      if (applicant && applicant.studentId?.toString() === _id?.toString()) {
        jobStatusMap[job._id] = applicant.status || 'pending';
      }
    });

    this.setState({ appliedJobs: jobStatusMap });
  } catch (error) {
    console.error('Failed to fetch applied jobs:', error.response?.data?.message || error.message);
  }
};



  handleApply = async (jobId) => {
    const { api, _id } = this.props;
    this.setState({ isProcessing: true, selectedJobId: jobId });
    try {
      await api.applyToJob(jobId, { studentId: _id });
      await this.fetchJobs();
      await this.fetchAppliedJobs(); // refresh statuses here
    } catch (error) {
      console.error('Job application failed:', error.response?.data?.message || error.message);
    } finally {
      this.setState({ isProcessing: false, selectedJobId: '' });
    }
  };

  handleFilterChange = (status) => {
    this.setState({ filterStatus: status });
  };


  render() {
    const { _id } = this.props;
    const { jobs, appliedJobs, isProcessing, selectedJobId, filterStatus } = this.state;

    return (
      <Jobs
        _id={_id}
        jobs={jobs}
        appliedJobs={appliedJobs} // pass down statuses here
        handleApply={this.handleApply}
        isProcessing={isProcessing}
        selectedJobId={selectedJobId}
        filterStatus={filterStatus}
        handleFilterChange={this.handleFilterChange}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  _id: state.user._id,
});

export default compose(
  connect(mapStateToProps),
  withAPI
)(JobsContainer);
