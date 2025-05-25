import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as ROUTES from '../../../../constants/routes';

const Jobs = ({ jobs, handleDelete, isProcessing, selectedJobId, handleStatusUpdate }) => {
  const [eventKey, setEventKey] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [rankedApplicants, setRankedApplicants] = useState({});
  const navigate = useNavigate();

  const handleChange = value => {
    if (value === eventKey) return setEventKey(null);
    setEventKey(value);
  };

  useEffect(() => {
    const fetchRankings = async () => {
      const result = {};
      for (let job of jobs) {
        try {
          const res = await axios.get(`/api/jobs/${job._id}/ranked-applicants`);
          const scored = res.data.map(r => {
            const app = job.applicants.find(a =>
              a.studentId === r.studentId || a.studentId._id === r.studentId
            );
            return { ...app, score: r.score };
          });
          result[job._id] = scored;
        } catch (err) {
          console.error(`Error ranking job ${job._id}:`, err);
          result[job._id] = job.applicants; // fallback
        }
      }
      setRankedApplicants(result);
    };

    if (jobs.length > 0) fetchRankings();
  }, [jobs]);

  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Header as="h2" className="text-center">
          Jobs
        </Card.Header>
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, i) => (
                <Fragment key={i}>
                  <tr>
                    <td>{i + 1}</td>
                    <td>{job.title}</td>
                    <td>{job.description}</td>
                    <td>
                      <Button
                        className="me-2"
                        variant="success"
                        onClick={() => handleChange(i + 1)}
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
                  <tr>
                    <td colSpan={4}>
                      <Accordion activeKey={eventKey}>
                        <Accordion.Collapse eventKey={i + 1}>
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
                            <Table size="sm" hover>
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
                                {(statusFilter
                                  ? (rankedApplicants[job._id] || job.applicants).filter(a => a.status === statusFilter)
                                  : (rankedApplicants[job._id] || job.applicants)
                                )
                                  .sort((a, b) => (b.score || 0) - (a.score || 0))
                                  .map((applicant, j) => (
                                    <tr key={j}>
                                      <td>{j + 1}</td>
                                      <td>{applicant.firstName}</td>
                                      <td>{applicant.lastName}</td>
                                      <td>{applicant.phone}</td>
                                      <td>{applicant.email}</td>
                                      <td>{applicant.status}</td>
                                      <td>{applicant.score ? applicant.score.toFixed(2) : '-'}</td>
                                      <td>
                                        <Button
                                          variant="info"
                                          size="sm"
                                          className="me-2"
                                          onClick={() => navigate(`/profile/${applicant.studentId}`)}
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
