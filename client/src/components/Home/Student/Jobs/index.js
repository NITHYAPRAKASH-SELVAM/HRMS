import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';

const Jobs = ({
  _id,
  jobs,
  handleApply,
  handleStatusChange,
  isProcessing,
  selectedJobId,
  filterStatus,
  handleFilterChange
}) => {
  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Header as="h2" className="text-center">Jobs</Card.Header>
        <Card.Body>
          {/* Filter */}
          <Form.Group className="mb-3" controlId="filterStatus">
            <Form.Label><strong>Filter by Status:</strong></Form.Label>
            <Form.Select
              value={filterStatus}
              onChange={e => handleFilterChange(e.target.value)}
              style={{ maxWidth: '300px' }}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="accept">Accepted</option>
              <option value="reject">Rejected</option>
            </Form.Select>
          </Form.Group>

          <Accordion>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, i) => {
                  const hasApplied = job.applicants.some(app => app.studentId === _id);
                  const appliedApplicant = job.applicants.find(app => app.studentId === _id);
                  const isSelected = isProcessing && job._id === selectedJobId;

                  return (
                    <React.Fragment key={i}>
                      <tr>
                        <td>{i + 1}</td>
                        <td>{job.title}</td>
                        <td>{job.description}</td>
                        <td>
                          {hasApplied ? (
                            <Button variant="success" disabled>Applied</Button>
                          ) : (
                            <Button
                              variant="primary"
                              onClick={() => handleApply({ target: { dataset: { id: job._id } } })}
                              disabled={isSelected}
                            >
                              {isSelected ? 'Applying...' : 'Apply'}
                            </Button>
                          )}
                        </td>
                      </tr>

                      {/* Show applicant details if user applied */}
                      {hasApplied && (
                        <tr>
                          <td colSpan={4}>
                            <Accordion.Collapse eventKey={`${i}`}>
                              <div>
                                <h6 className="mb-2 text-muted">Applicant Status: <strong>{appliedApplicant?.status}</strong></h6>
                                <Table size="sm" hover bordered>
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
                                    {job.applicants.map((applicant, index) => (
                                      <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{applicant.firstName}</td>
                                        <td>{applicant.lastName}</td>
                                        <td>{applicant.status}</td>
                                        <td>
                                          {applicant.status === 'pending' && (
                                            <>
                                              <Button
                                                variant="success"
                                                onClick={() =>
                                                  handleStatusChange(job._id, applicant.studentId, 'accept')
                                                }
                                                className="me-2"
                                              >
                                                Accept
                                              </Button>
                                              <Button
                                                variant="danger"
                                                onClick={() =>
                                                  handleStatusChange(job._id, applicant.studentId, 'reject')
                                                }
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
                              </div>
                            </Accordion.Collapse>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </Table>
          </Accordion>
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
