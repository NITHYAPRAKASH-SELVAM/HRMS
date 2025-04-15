// Keep existing imports
import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import * as ROUTES from '../../../../constants/routes';

const Edit = ({
  firstName,
  lastName,
  phone,
  objective,
  skills,
  certifications,
  handleChange,
  handleSubmit,
  isProcessing,
  error,
  dismissAlert,
}) => {
  const navigate = useNavigate();

  return (
    <Container className="col-md-6">
      <Card className="shadow-sm">
        <Card.Header as="h2" className="text-center">Edit Profile</Card.Header>
        <Card.Body>
          <Alert
            variant="danger"
            show={!!error}
            dismissible
            onClose={dismissAlert}
          >
            {error}
          </Alert>
          <Form onSubmit={handleSubmit}>
            {/* Basic fields */}
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                required
                name="firstName"
                value={firstName}
                onChange={handleChange}
                disabled={isProcessing}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                required
                name="lastName"
                value={lastName}
                onChange={handleChange}
                disabled={isProcessing}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                required
                name="phone"
                value={phone}
                onChange={handleChange}
                disabled={isProcessing}
              />
            </Form.Group>

            {/* Resume Fields */}
            <Form.Group className="mb-3">
              <Form.Label>Objective</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="objective"
                value={objective}
                onChange={handleChange}
                disabled={isProcessing}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Skills (comma-separated)</Form.Label>
              <Form.Control
                name="skills"
                value={skills}
                onChange={handleChange}
                disabled={isProcessing}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Certifications (comma-separated)</Form.Label>
              <Form.Control
                name="certifications"
                value={certifications}
                onChange={handleChange}
                disabled={isProcessing}
              />
            </Form.Group>

            <Button variant="success" type="submit" disabled={isProcessing} className="me-2">
              {isProcessing ? 'Updating...' : 'Update'}
            </Button>
            <Button
              variant="light"
              onClick={() => navigate(ROUTES.PROFILE)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

Edit.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  objective: PropTypes.string,
  skills: PropTypes.string,
  certifications: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  error: PropTypes.string,
  dismissAlert: PropTypes.func.isRequired,
};

export default Edit;
