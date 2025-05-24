import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import API from '../../../../services/api/api';

const api = new API();

const Jobs = ({
  _id,
  jobs,
  handleApply,
  handleStatusChange,
  isProcessing,
  selectedJobId,
  filterStatus,
  handleFilterChange,
}) => {
  const [appliedJobs, setAppliedJobs] = useState({}); // { jobId: status }

  // 🔄 Fetch applied jobs from backend once on mount
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await api.getAppliedJobs();
        const jobStatusMap = {};
        res.data.forEach(job => {
          // All are pending initially unless status is added in job payload
          const applicant = job.applicants?.find(app => app.studentId === _id);
          jobStatusMap[job._id] = applicant?.status || 'pending';
        });
        setAppliedJobs(jobStatusMap);
      } catch (err) {
        console.error('Failed to fetch applied jobs:', err.message);
      }
    };

    fetchAppliedJobs();
  }, [_id]);

  const handleJobApply = (jobId) => {
    setAppliedJobs(prev => ({
      ...prev,
      [jobId]: 'pending',
    }));
    handleApply(jobId); // backend patch call
  };

  // Filter jobs by selected status
  const filteredJobs = jobs.filter((job) => {
    if (filterStatus === 'all') return true;
    return appliedJobs[job._id] === filterStatus;
  });

  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Header as="h2" className="text-center">Jobs</Card.Header>
        <Card.Body>
          <Form.Group className="mb-3" controlId="filterStatus">
            <Form.Label><strong>Filter by Status:</strong></Form.Label>
            <Form.Select
              value={filterStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
              style={{ maxWidth: '300px' }}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="accept">Accepted</option>
              <option value="reject">Rejected</option>
            </Form.Select>
          </Form.Group>

          <Table bordered hover>
            <thead>
              <tr>
                <th>No.</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, i) => {
                  const appliedStatus = appliedJobs[job._id];
                  const isSelected = isProcessing && job._id === selectedJobId;

                  return (
                    <tr key={job._id}>
                      <td>{i + 1}</td>
                      <td>{job.title}</td>
                      <td>{job.description}</td>
                      <td className="text-capitalize">
                        {appliedStatus || 'Not Applied'}
                      </td>
                      <td>
                        {appliedStatus ? (
                          <Button variant="success" disabled>
                            {appliedStatus === 'pending' ? 'Applied' : appliedStatus.charAt(0).toUpperCase() + appliedStatus.slice(1)}
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            onClick={() => handleJobApply(job._id)}
                            disabled={isSelected}
                          >
                            {isSelected ? 'Applying...' : 'Apply'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No jobs found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

Jobs.propTypes = {
  _id: PropTypes.string.isRequired,
  jobs: PropTypes.array.isRequired,
  handleApply: PropTypes.func.isRequired,
  handleStatusChange: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  selectedJobId: PropTypes.string.isRequired,
  filterStatus: PropTypes.string.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
};

export default Jobs;
