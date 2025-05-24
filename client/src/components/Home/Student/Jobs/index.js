import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Jobs = ({
  _id,
  jobs,
  appliedJobs,       // <-- now comes from props only
  handleApply,
  isProcessing,
  selectedJobId,
  filterStatus,
  handleFilterChange,
}) => {
  const handleJobApply = (jobId) => {
    if (!appliedJobs[jobId]) {
      handleApply(jobId); // backend patch call handled in container
    }
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
  appliedJobs: PropTypes.object.isRequired,        // must be passed from container
  handleApply: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  selectedJobId: PropTypes.string.isRequired,
  filterStatus: PropTypes.string.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
};

export default Jobs;
