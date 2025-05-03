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
    filterStatus: 'all', // all | pending | accept | reject
  };

  componentDidMount() {
    this.fetchJobs();
  }

  fetchJobs = () => {
    const { api } = this.props;

    api
      .getJobs()
      .then((response) => {
        this.setState({ jobs: response.data });
      })
      .catch((error) => {
        console.error(error.response?.data?.message || error.message);
      });
  };

  handleApply = (jobId) => {
    const { api, _id } = this.props;

    this.setState({ isProcessing: true, selectedJobId: jobId });

    api
      .applyToJob(jobId, { studentId: _id }) // Assumes backend links student to job
      .then(() => this.fetchJobs()) // Refresh job list after applying
      .catch((error) => {
        console.error(error.response?.data?.message || error.message);
      })
      .finally(() => {
        this.setState({ isProcessing: false, selectedJobId: '' });
      });
  };

  handleFilterChange = (status) => {
    this.setState({ filterStatus: status });
  };

  // Student cannot change status, but required by component's propTypes
  handleStatusChange = () => {};

  render() {
    const { _id } = this.props;
    const { jobs, isProcessing, selectedJobId, filterStatus } = this.state;

    return (
      <Jobs
        _id={_id}
        jobs={jobs} // full list, filtering is done inside component
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

export default compose(connect(mapStateToProps), withAPI)(JobsContainer);
