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
    this.getJobs();
  }

  getJobs = () => {
    const { api, _id } = this.props;

    api
      .getJobs()
      .then((response) => {
        const jobs = response.data;

        // Enrich job data to check if student has applied and track their status
        const jobsWithStatus = jobs.map(job => {
          const applicant = job.applicants.find(a =>
            typeof a === 'object'
              ? (a.studentId === _id || a._id === _id)
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

  // ✅ Updated: jobId is passed directly (no DOM event)
  handleApply = (jobId) => {
    const { api, _id } = this.props;

    this.setState({ isProcessing: true, selectedJobId: jobId });

    api
      .applyToJob(jobId, { studentId: _id }) // Make sure your backend uses req.body.studentId
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

  // Optional: placeholder since student won't manage status, but UI expects it
  handleStatusChange = (jobId, studentId, newStatus) => {
    console.log(`Student cannot change status: ${studentId}, ${newStatus}`);
  };

  render() {
    const { _id } = this.props;
    const { jobs, isProcessing, selectedJobId, filterStatus } = this.state;

    // ✅ Filter based on the student's own status on each job
    const filteredJobs =
      filterStatus === 'all'
        ? jobs
        : jobs.filter(job => job.applicantStatus === filterStatus);

    return (
      <Jobs
        _id={_id}
        jobs={filteredJobs}
        handleApply={this.handleApply}
        handleStatusChange={this.handleStatusChange} // won't be used by student, but keeps propTypes happy
        isProcessing={isProcessing}
        selectedJobId={selectedJobId}
        filterStatus={filterStatus}
        handleFilterChange={this.handleFilterChange}
      />
    );
  }
}

const mapStateToProps = state => ({
  _id: state.user._id, // Make sure _id of student is in Redux state
});

export default compose(connect(mapStateToProps), withAPI)(JobsContainer);
