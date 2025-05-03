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
    filterStatus: 'all', // all, pending, accept, reject
  };

  componentDidMount() {
    this.getJobs();
  }

  getJobs = () => {
    const { api, _id } = this.props;

    api
      .getJobs()
      .then((response) => {
        const jobs = response.data;

        const jobsWithStatus = jobs.map(job => {
          const applicant = job.applicants.find(a =>
            typeof a === 'object'
              ? a.studentId === _id || a._id === _id
              : a === _id
          );

          return {
            ...job,
            applicantStatus: applicant?.status || null,
            hasApplied: !!applicant,
          };
        });

        this.setState({ jobs: jobsWithStatus });
      })
      .catch(error => {
        console.log(error.response?.data?.message || error.message);
      });
  };

  handleApply = e => {
    const { api, _id } = this.props;
    const id = e.target.dataset.id;

    this.setState({ isProcessing: true, selectedJobId: id });

    api
      .applyToJob(id, { studentId: _id }) // ✅ Pass studentId
      .then(() => this.getJobs())
      .catch(error => {
        console.log(error.response?.data?.message || error.message);
      })
      .finally(() => {
        this.setState({ isProcessing: false, selectedJobId: '' });
      });
  };

  handleFilterChange = status => {
    this.setState({ filterStatus: status });
  };

  // ✅ OPTIONAL: handleStatusChange to satisfy prop requirement
  handleStatusChange = (jobId, status) => {
    // No-op or console log for now if not implemented
    console.log(`Status changed for ${jobId}: ${status}`);
  };

  render() {
    const { _id } = this.props;
    const { jobs, isProcessing, selectedJobId, filterStatus } = this.state;

    const filteredJobs =
      filterStatus === 'all'
        ? jobs
        : jobs.filter(job => job.applicantStatus === filterStatus);

    return (
      <Jobs
        _id={_id}
        jobs={filteredJobs}
        handleApply={this.handleApply}
        handleStatusChange={this.handleStatusChange} // ✅ Added to fix prop warning
        isProcessing={isProcessing}
        selectedJobId={selectedJobId}
        handleFilterChange={this.handleFilterChange}
        filterStatus={filterStatus}
      />
    );
  }
}

const mapStateToProps = state => ({
  _id: state.user._id,
});

export default compose(connect(mapStateToProps), withAPI)(JobsContainer);
