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
  const [jobList, setJobList] = useState(jobs);

  // Keep local jobList in sync with jobs prop
  useEffect(() => {
    setJobList(jobs);
  }, [jobs]);

  // Handle applying to a job
  const handleJobApply = (jobId) => {
    const updatedJobs = jobList.map((job) => {
      if (job._id === jobId) {
        return {
          ...job,
          applicants: [...job.applicants, { studentId: _id, status: 'pending' }],
        };
      }
      return job;
    });
    setJobList(updatedJobs);
    handleApply(jobId); // Call API
  };

  // Apply filtering based on status
  const filteredJobs = jobList.filter((job) => {
    if (filterStatus === 'all') return true;
    const applicant = job.applicants.find(app => app.studentId === _id);
    return applicant?.status === filterStatus;
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
                const hasApplied = job.applicants.some(app => app.studentId === _id);
                const appliedApplicant = job.applicants.find(app => app.studentId === _id);
                const isSelected = isProcessing && job._id === selectedJobId;

                return (
                  <React.Fragment key={job._id}>
                    <tr>
                      <td>{i + 1}</td>
                      <td>{job.title}</td>
                      <td>{job.description}</td>
                      <td>
                        {hasApplied
                          ? <span className="text-capitalize">{appliedApplicant?.status || 'pending'}</span>
                          : 'Not Applied'}
                      </td>
                      <td>
                        {hasApplied ? (
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

                    {hasApplied && (
                      <tr>
                        <td colSpan={5}>
                          <div className="mb-2">
                            <strong>Status:</strong>{' '}
                            <span className="text-capitalize">{appliedApplicant?.status || 'pending'}</span>
                          </div>

                          <Table size="sm" bordered hover>
                            <thead>
                              <tr>
                                <th>No.</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {job.applicants.map((app, idx) => (
                                <tr key={idx}>
                                  <td>{idx + 1}</td>
                                  <td>{app.firstName || '-'}</td>
                                  <td>{app.lastName || '-'}</td>
                                  <td className="text-capitalize">{app.status}</td>
                                  <td>
                                    {app.status === 'pending' && (
                                      <>
                                        <Button
                                          size="sm"
                                          variant="success"
                                          className="me-2"
                                          onClick={() => handleStatusChange(job._id, app.studentId, 'accept')}
                                        >
                                          Accept
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="danger"
                                          onClick={() => handleStatusChange(job._id, app.studentId, 'reject')}
                                        >
                                          Reject
                                        </Button>
                                      </>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
