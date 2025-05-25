import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Card,
  Table,
  Button,
  Accordion,
  Form,
  Badge,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as ROUTES from '../../../../constants/routes';

const Jobs = ({ jobs, handleDelete, isProcessing, selectedJobId, handleStatusUpdate }) => {
  const [openJobIndex, setOpenJobIndex] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [rankedApplicants, setRankedApplicants] = useState({});
  const navigate = useNavigate();
  const fitThreshold = 0.5;

  const handleToggle = index => {
    setOpenJobIndex(index === openJobIndex ? null : index);
    setStatusFilter(''); // Reset filter on toggle
  };

  useEffect(() => {
    const fetchRankings = async () => {
      const result = {};

      await Promise.all(
        jobs.map(async job => {
          try {
            const res = await axios.get(`/api/jobs/${job._id}/ranked-applicants`);
            const scored = res.data.map(r => {
              const app = job.applicants.find(a =>
                (a.studentId?._id || a.studentId) === r.studentId
              );
              return app ? { ...app, score: r.score } : null;
            }).filter(Boolean);
            result[job._id] = scored;
          } catch (err) {
            console.error(`Error ranking job ${job._id}:`, err);
            result[job._id] = job.applicants;
          }
        })
      );

      setRankedApplicants(result);
    };

    if (jobs.length > 0) fetchRankings();
  }, [jobs]);

  const renderFitBadge = score => {
    if (score == null) return null;
    return score >= fitThreshold ? (
      <Badge bg="success" className="ms-2">Fit</Badge>
    ) : (
      <Badge bg="secondary" className="ms-2">Unfit</Badge>
    );
  };

  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Header as="h2" className="text-center">Jobs</Card.Header>
        <Card.Body>
          <Button
            className="mb-4"
            variant="success"
            onClick={() => navigate(ROUTES.JOBS_NEW)}
          >
            Post New Job
          </Button>
          <Table bordered>
            <thead>
              <tr>
                <th>No.</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <Fragment key={job._id}>
                  <tr>
                    <td>{index + 1}</td>
                    <td>{job.title}</td>
                    <td>{job.description}</td>
                    <td>
                      <Button
                        className="me-2"
                        variant="primary"
                        onClick={() => handleToggle(index)}
                      >
                        See Applicants
                      </Button>
                      <Button
                        variant="danger"
                        data-id={job._id}
                        onClick={handleDelete}
                        disabled={isProcessing && job._id === selectedJobId}
                      >
                        {isProcessing && job._id === selectedJobId ? 'Deleting...' : 'Delete'}
                      </Button>
                    </td>
                  </tr>
                  {openJobIndex === index && (
                    <tr>
                      <td colSpan={4}>
                        <Accordion activeKey="open">
                          <Accordion.Collapse eventKey="open">
                            <>
                              <Form.Select
                                className="mb-3"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                              >
                                <option value="">Filter by Status</option>
                                <option value="pending">Pending</option>
                                <option value="accept">Accepted</option>
                                <option value="reject">Rejected</option>
                              </Form.Select>
                              <Table size="sm" hover bordered>
                                <thead>
                                  <tr>
                                    <th>No.</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Score</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(rankedApplicants[job._id] || [])
                                    .filter(a => !statusFilter || a.status === statusFilter)
                                    .sort((a, b) => (b.score || 0) - (a.score || 0))
                                    .map((applicant, i) => (
                                      <tr key={applicant._id || i}>
                                        <td>{i + 1}</td>
                                        <td>{applicant.firstName}</td>
                                        <td>{applicant.lastName}</td>
                                        <td>{applicant.phone}</td>
                                        <td>{applicant.email}</td>
                                        <td>{applicant.status}</td>
                                        <td>
                                          {applicant.score != null ? applicant.score.toFixed(2) : '-'}
                                          {renderFitBadge(applicant.score)}
                                        </td>
                                        <td>
                                          <Button
                                            variant="info"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => navigate(`/profile/${applicant.studentId?._id || applicant.studentId}`)}
                                          >
                                            View Profile
                                          </Button>
                                          <Button
                                            variant="success"
                                            size="sm"
                                            className="me-1"
                                            onClick={() => handleStatusUpdate(job._id, applicant.studentId, 'accept')}
                                          >
                                            Accept
                                          </Button>
                                          <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleStatusUpdate(job._id, applicant.studentId, 'reject')}
                                          >
                                            Reject
                                          </Button>
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </Table>
                            </>
                          </Accordion.Collapse>
                        </Accordion>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

Jobs.propTypes = {
  jobs: PropTypes.array.isRequired,
  handleDelete: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  selectedJobId: PropTypes.string.isRequired,
  handleStatusUpdate: PropTypes.func.isRequired,
};

export default Jobs;
