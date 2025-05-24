import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withAPI } from '../../../../services/api';
import Jobs from '../../../../components/Home/Student/Jobs';

class JobsContainer extends Component {
  state = {
    jobs: [],
    isProcessing: false,
    selectedJobId: '',
    filterStatus: 'all', // Options: 'all', 'pending', 'accept', 'reject'
  };

  componentDidMount() {
    this.fetchJobs();
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

  handleApply = async (jobId) => {
    const { api, _id } = this.props;
    console.log('_id:', _id); // Log the _id prop
    this.setState({ isProcessing: true, selectedJobId: jobId });

    try {
      await api.applyToJob(jobId, { studentId: _id });
      await this.fetchJobs(); // Refresh after successful application
    } catch (error) {
      console.error('Job application failed:', error.response?.data?.message || error.message);
    } finally {
      this.setState({ isProcessing: false, selectedJobId: '' });
    }
  };

  handleFilterChange = (status) => {
    this.setState({ filterStatus: status });
  };

  // No-op since students can't change statuses, but passed for propTypes compatibility
  handleStatusChange = () => {};

  render() {
    const { _id } = this.props;
    const { jobs, isProcessing, selectedJobId, filterStatus } = this.state;

    return (
      <Jobs
        _id={_id}
        jobs={jobs}
        handleApply={this.handleApply}
        handleStatusChange={this.handleStatusChange}
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
