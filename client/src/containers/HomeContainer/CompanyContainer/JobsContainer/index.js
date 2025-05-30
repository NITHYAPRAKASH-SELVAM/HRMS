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
    applicantsByJobId: {},
    screeningResults: {},
    rankedApplicants: {},
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
      this.setState((state) => ({
        applicantsByJobId: {
          ...state.applicantsByJobId,
          [jobId]: [],
        },
      }));
      return;
    }

    try {
      // Try LTR ranking first
      const { data: rankingData } = await api.getRankedApplicants(jobId);
      const scores = rankingData?.scores || {};
      console.log(`Fetched LTR scores for job ${jobId}:`, scores);

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

      this.setState((state) => ({
        applicantsByJobId: {
          ...state.applicantsByJobId,
          [jobId]: populatedApplicants.filter(Boolean),
        },
      }));
    } catch (err) {
      console.warn(`LTR ranking failed for job ${jobId}:`, err.message);
      // fallback: use screening (logistic regression) instead
      try {
        const { data: screenData } = await api.getScreenedApplicants(jobId);
        const scoreMap = {};
        screenData.forEach(({ studentId, fit_score }) => {
          scoreMap[this.normalizeStudentId(studentId)] = fit_score;
        });

        const fallbackApplicants = await Promise.all(
          job.applicants.map(async (applicant) => {
            const rawStudentId = this.normalizeStudentId(applicant.studentId);
            if (!rawStudentId) return null;

            try {
              const { data: profile } = await api.getProfileById(rawStudentId);
              return {
                ...profile,
                studentId: rawStudentId,
                status: applicant.status,
                score: scoreMap[rawStudentId] ?? null,
              };
            } catch (err) {
              console.error(`Fallback profile fetch failed for ${rawStudentId}:`, err.message);
              return null;
            }
          })
        );

        this.setState((state) => ({
          applicantsByJobId: {
            ...state.applicantsByJobId,
            [jobId]: fallbackApplicants.filter(Boolean),
          },
        }));
      } catch (fallbackErr) {
        console.error(`Full fallback failed for job ${jobId}:`, fallbackErr.message);
        this.setState((state) => ({
          applicantsByJobId: {
            ...state.applicantsByJobId,
            [jobId]: [],
          },
        }));
      }
    }
  };

  handleToggle = async (index) => {
    const { jobs, openJobIndex, applicantsByJobId } = this.state;
    const newIndex = index === openJobIndex ? null : index;

    if (newIndex !== null) {
      const job = jobs[newIndex];
      const jobId = job._id;

      if (!applicantsByJobId[jobId]) {
        await this.fetchApplicantsForJob(job);
      }

      const applicants = this.state.applicantsByJobId[jobId] || [];

      const screeningMap = {};
      await Promise.all(
        applicants.map(async (applicant) => {
          const studentId = this.normalizeStudentId(applicant.studentId);
          if (!studentId) return;

          try {
            const { api } = this.props;
            const { data: screenData } = await api.getApplicantScreening(jobId, studentId);
            screeningMap[`${jobId}_${studentId}`] = screenData?.fit === true;
          } catch (err) {
            console.warn(`Screening failed for ${studentId}:`, err.message);
            screeningMap[`${jobId}_${studentId}`] = false;
          }
        })
      );

      this.setState((state) => ({
        openJobIndex: newIndex,
        filterStatus: '',
        screeningResults: {
          ...state.screeningResults,
          ...screeningMap,
        },
      }));
    } else {
      this.setState({ openJobIndex: null });
    }
  };

  renderFitBadge = (jobId, studentId) => {
    const key = `${jobId}_${studentId}`;
    const isFit = this.state.screeningResults[key];
    console.log("Screening result (fit score):", isFit);

    if (isFit === true) return <span className="badge bg-success ms-2">Fit</span>;
    if (isFit === false) return <span className="badge bg-secondary ms-2">Unfit</span>;
    return <span className="badge bg-warning ms-2">Checking...</span>;
  };

  handleDelete = async (e) => {
    const { api } = this.props;
    const jobId = e.target.dataset.id;

    this.setState({ isProcessing: true, selectedJobId: jobId });

    try {
      await api.deleteJob(jobId);
      await this.loadJobs();

      this.setState((state) => {
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
      const job = this.state.jobs.find((j) => j._id === jobId);
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

    const jobsWithApplicants = jobs.map((job) => ({
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
        renderFitBadge={this.renderFitBadge}
        screeningResults={this.state.screeningResults}
        rankedApplicants={applicantsByJobId}
      />
    );
  }
}

export default withRouter(withAPI(JobsContainer));
