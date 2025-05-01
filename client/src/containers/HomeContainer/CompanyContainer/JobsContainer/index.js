import React, { Component } from 'react';
import { withAPI } from '../../../../services/api';

import Jobs from '../../../../components/Home/Company/Jobs';

class JobsContainer extends Component {
  state = { jobs: [], isProcessing: false, selectedJobId: '' };

  componentDidMount() {
    this.getJobs();
  }

  getJobs = () => {
    const { api } = this.props;
  
    api
      .getJobs()
      .then(response => {
        const { data } = response;
  
        const jobPromises = data.map(async job => {
          const ids = job.applicants;
  
          const profilePromises = ids.map(applicantId => {
            const id = typeof applicantId === 'object' ? applicantId._id : applicantId;
            return api.getProfileById(id).then(res => res.data);
          });
  
          try {
            const applicants = await Promise.all(profilePromises);
            job.applicants = applicants;
          } catch (err) {
            console.error('Error fetching applicants:', err.message);
          }
  
          return job;
        });
  
        Promise.all(jobPromises)
          .then(jobsWithApplicants => {
            this.setState({ jobs: jobsWithApplicants });
          })
          .catch(error => {
            console.error('Error processing jobs:', error.message);
          });
      })
      .catch(error => {
        console.log(error.response?.data?.message || error.message);
      });
  };
  
  handleDelete = e => {
    const { api } = this.props;
    const id = e.target.dataset.id;

    this.setState({ isProcessing: true, selectedJobId: id });

    api
      .deleteJob(id)
      .then(() => this.getJobs())
      .catch(error => console.log(error.response.data.message));
  };

  render() {
    const { jobs, isProcessing, selectedJobId } = this.state;

    return (
      <Jobs
        jobs={jobs}
        handleDelete={this.handleDelete}
        isProcessing={isProcessing}
        selectedJobId={selectedJobId}
      />
    );
  }
}

export default withAPI(JobsContainer);
