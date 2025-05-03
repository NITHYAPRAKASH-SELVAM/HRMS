import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

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
  const [appliedJobs, setAppliedJobs] = useState({});

  useEffect(() => {
    const newAppliedJobs = {};
    jobs.forEach((job) => {
      const applicant = job.applicants.find(app => app.studentId === _id);
      if (applicant) {
        newAppliedJobs[job._id] = applicant.status || 'pending';
      }
    });
    setAppliedJobs(newAppliedJobs);
  }, [jobs, _id]);

  const handleJobApply = (jobId) => {
    // Update UI immediately
    setAppliedJobs(prev => ({
      ...prev,
      [jobId]: 'pending',
    }));
    handleApply(jobId); // Backend call
  };

  const filteredJobs = jobs.filter((job) => {
    if (filterStatus === 'all') return true;
    const status = appliedJobs[job._id];
    return status === filterStatus;
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
              {filteredJobs.map((job, i) => {
                const appliedStatus = appliedJobs[job._id]; // accept/reject/pending/undefined
                const isSelected = isProcessing && job._id === selectedJobId;

                return (
                  <tr key={job._id}>
                    <td>{i + 1}</td>
                    <td>{job.title}</td>
                    <td>{job.description}</td>
                    <td className="text-capitalize">{appliedStatus || 'Not Applied'}</td>
                    <td>
                      {appliedStatus ? (
                        <Button variant="success" disabled>Applied</Button>
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
              })}
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
