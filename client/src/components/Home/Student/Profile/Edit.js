import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import * as ROUTES from '../../../../constants/routes';

const Edit = ({
  firstName: initialFirstName,
  lastName: initialLastName,
  phone: initialPhone,
  objective: initialObjective,
  skills: initialSkills,
  certifications: initialCertifications,
  experience: initialExperience,
  education: initialEducation,
  projects: initialProjects,
  references: initialReferences,
  handleSubmit,
  isProcessing,
  error,
  dismissAlert,
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: initialFirstName,
    lastName: initialLastName,
    phone: initialPhone,
    objective: initialObjective,
    skills: initialSkills || [],
    certifications: initialCertifications || [],
    experience: initialExperience || [],
    education: initialEducation || [],
    projects: initialProjects || [],
    references: initialReferences || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleListChange = (e, listName, index, field) => {
    const updatedList = [...formData[listName]];
    updatedList[index][field] = e.target.value;
    setFormData(prev => ({ ...prev, [listName]: updatedList }));
  };

  const addListItem = (listName, newItem) => {
    setFormData(prev => ({ ...prev, [listName]: [...prev[listName], newItem] }));
  };

  const removeListItem = (listName, index) => {
    const updatedList = [...formData[listName]];
    updatedList.splice(index, 1);
    setFormData(prev => ({ ...prev, [listName]: updatedList }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  return (
    <Container className="col-md-8">
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
          <Form onSubmit={onSubmit}>

            {/* Basic Fields */}
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isProcessing}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                required
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isProcessing}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={isProcessing}
              />
            </Form.Group>

            {/* Objective */}
            <Form.Group className="mb-3">
              <Form.Label>Objective</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="objective"
                value={formData.objective}
                onChange={handleChange}
                disabled={isProcessing}
              />
            </Form.Group>

            {/* Skills */}
            <Form.Group className="mb-3">
              <Form.Label>Skills</Form.Label>
              {formData.skills.map((skill, index) => (
                <div key={index} className="d-flex mb-2">
                  <Form.Control
                    value={skill}
                    onChange={(e) => handleListChange(e, 'skills', index, '')}
                    disabled={isProcessing}
                    className="me-2"
                  />
                  <Button variant="danger" onClick={() => removeListItem('skills', index)} disabled={isProcessing}>Remove</Button>
                </div>
              ))}
              <Button variant="primary" onClick={() => addListItem('skills', '')} disabled={isProcessing}>Add Skill</Button>
            </Form.Group>

            {/* Certifications */}
            <Form.Group className="mb-3">
              <Form.Label>Certifications</Form.Label>
              {formData.certifications.map((cert, index) => (
                <div key={index} className="d-flex mb-2">
                  <Form.Control
                    value={cert}
                    onChange={(e) => handleListChange(e, 'certifications', index, '')}
                    disabled={isProcessing}
                    className="me-2"
                  />
                  <Button variant="danger" onClick={() => removeListItem('certifications', index)} disabled={isProcessing}>Remove</Button>
                </div>
              ))}
              <Button variant="primary" onClick={() => addListItem('certifications', '')} disabled={isProcessing}>Add Certification</Button>
            </Form.Group>

            {/* You can similarly add Experience, Education, Projects, References sections here if needed */}

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
  skills: PropTypes.array,
  certifications: PropTypes.array,
  experience: PropTypes.array,
  education: PropTypes.array,
  projects: PropTypes.array,
  references: PropTypes.array,
  handleSubmit: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  error: PropTypes.string,
  dismissAlert: PropTypes.func.isRequired,
};

export default Edit;
