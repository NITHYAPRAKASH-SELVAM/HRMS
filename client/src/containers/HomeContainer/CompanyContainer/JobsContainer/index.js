import React, { Component } from 'react';
import Jobs from '../../components/company/jobs/Jobs';
import { connect } from 'react-redux';
import { getCompanyJobs, deleteJob, updateApplicantStatus } from '../../actions/jobActions';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

class JobsContainer extends Component {
  state = {
    isProcessing: false,
    selectedJobId: null,
    openJobIndex: null,
    filterStatus: '',
    rankedApplicantsByJobId: {},
    screeningResults: {},
  };

  componentDidMount() {
    this.props.getCompanyJobs();
  }

  handleDelete = async (jobId) => {
    this.setState({ isProcessing: true });
    await this.props.deleteJob(jobId);
    await this.props.getCompanyJobs();
    this.setState({ isProcessing: false });
  };

  handleStatusUpdate = async (jobId, studentId, newStatus) => {
    this.setState({ isProcessing: true });
    await this.props.updateApplicantStatus(jobId, studentId, newStatus);
    await this.props.getCompanyJobs();
    this.setState({ isProcessing: false });
  };

  handleViewProfile = (studentId) => {
    this.props.history.push(`/view-profile/${studentId}`);
  };

  handleStatusFilterChange = (status) => {
    this.setState({ filterStatus: status });
  };

  fetchRankingAndScreening = async (job) => {
    const { api } = this.props;
    const jobId = job._id;

    try {
      const { data: rankingData } = await api.getRankedApplicants(jobId);
      const rankedDataArray = Array.isArray(rankingData.data) ? rankingData.data : [];
      const screenResultMap = {};
      const applicantsWithScores = [];

      for (const rank of rankedDataArray) {
        const studentId = rank.applicant._id || rank.applicant;

        const applicant = job.applicants.find(app =>
          (app.studentId?._id || app.studentId) === studentId
        );
        if (!applicant) continue;

        try {
          const screenRes = await api.getScreeningResult(jobId, studentId);
          const isFit = screenRes?.data?.fit === true;
          screenResultMap[`${jobId}_${studentId}`] = isFit;
        } catch (screenErr) {
          console.warn(`Screening failed for ${studentId}:`, screenErr.message);
          screenResultMap[`${jobId}_${studentId}`] = false;
        }

        applicantsWithScores.push({
          ...applicant,
          score: rank.score,
        });
      }

      this.setState(prev => ({
        rankedApplicantsByJobId: { ...prev.rankedApplicantsByJobId, [jobId]: applicantsWithScores },
        screeningResults: { ...prev.screeningResults, ...screenResultMap },
      }));
    } catch (err) {
      console.error(`Error fetching ranked applicants for job ${jobId}:`, err.message);
      this.setState(prev => ({
        rankedApplicantsByJobId: { ...prev.rankedApplicantsByJobId, [jobId]: job.applicants },
      }));
    }
  };

  handleToggle = async (index) => {
    const { jobs } = this.props;
    const { openJobIndex } = this.state;
    const newIndex = index === openJobIndex ? null : index;

    if (newIndex !== null) {
      const job = jobs[newIndex];
      if (!this.state.rankedApplicantsByJobId[job._id]) {
        await this.fetchRankingAndScreening(job);
      }
    }

    this.setState({ openJobIndex: newIndex, filterStatus: '' });
  };

  render() {
    const { jobs } = this.props;
    const { isProcessing, selectedJobId, openJobIndex, filterStatus, rankedApplicantsByJobId, screeningResults } = this.state;

    const jobsWithApplicants = jobs.map(job => {
      const rankedApplicants = rankedApplicantsByJobId[job._id] || job.applicants;
      return { ...job, applicants: rankedApplicants };
    });

    return (
      <Jobs
        jobs={jobsWithApplicants}
        isProcessing={isProcessing}
        selectedJobId={selectedJobId}
        handleStatusFilterChange={this.handleStatusFilterChange}
        handleDelete={this.handleDelete}
        handleStatusUpdate={this.handleStatusUpdate}
        handleViewProfile={this.handleViewProfile}
        handleToggle={this.handleToggle}
        openJobIndex={openJobIndex}
        rankedApplicantsByJobId={rankedApplicantsByJobId}
        screeningResults={screeningResults}
      />
    );
  }
}

JobsContainer.propTypes = {
  jobs: PropTypes.array.isRequired,
  getCompanyJobs: PropTypes.func.isRequired,
  deleteJob: PropTypes.func.isRequired,
  updateApplicantStatus: PropTypes.func.isRequired,
  api: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  jobs: state.jobs.companyJobs,
});

export default connect(mapStateToProps, {
  getCompanyJobs,
  deleteJob,
  updateApplicantStatus,
})(withRouter(JobsContainer));
