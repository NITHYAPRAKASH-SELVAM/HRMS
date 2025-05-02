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
        <Card.Header as="h2" className="text-center">
          Jobs
        </Card.Header>
        <Card.Body>
          {/* Filter Control */}
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
              {jobs.map((job, i) => (
                <React.Fragment key={i}>
                  <tr>
                    <td>{i + 1}</td>
                    <td>{job.title}</td>
                    <td>{job.description}</td>
                    <td>
                      {/* Student Apply Button */}
                      {job.applicants.some(applicant => applicant.studentId === _id) ? (
                        <Button variant="success" disabled>
                          Applied
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          data-id={job._id}
                          onClick={handleApply}
                          disabled={isProcessing && job._id === selectedJobId}
                        >
                          {isProcessing && job._id === selectedJobId ? 'Applying...' : 'Apply'}
                        </Button>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={4}>
                      <Accordion>
                        <Accordion.Collapse eventKey={i + 1}>
                          <Table size="sm" hover>
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
                        </Accordion.Collapse>
                      </Accordion>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
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
