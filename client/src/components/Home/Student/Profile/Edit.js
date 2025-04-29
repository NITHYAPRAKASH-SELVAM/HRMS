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

  const handleListChange = (e, listName, index, field = null) => {
    const updatedList = [...formData[listName]];
    if (field) {
      updatedList[index] = { ...updatedList[index], [field]: e.target.value };
    } else {
      updatedList[index] = e.target.value;
    }
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
          <Alert variant="danger" show={!!error} dismissible onClose={dismissAlert}>
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
                    onChange={(e) => handleListChange(e, 'skills', index)}
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
                    onChange={(e) => handleListChange(e, 'certifications', index)}
                    disabled={isProcessing}
                    className="me-2"
                  />
                  <Button variant="danger" onClick={() => removeListItem('certifications', index)} disabled={isProcessing}>Remove</Button>
                </div>
              ))}
              <Button variant="primary" onClick={() => addListItem('certifications', '')} disabled={isProcessing}>Add Certification</Button>
            </Form.Group>

            {/* Experience */}
            <Form.Group className="mb-3">
              <Form.Label>Experience</Form.Label>
              {formData.experience.map((exp, index) => (
                <div key={index} className="mb-3 border rounded p-3">
                  <Form.Control
                    className="mb-2"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => handleListChange(e, 'experience', index, 'company')}
                    disabled={isProcessing}
                  />
                  <Form.Control
                    className="mb-2"
                    placeholder="Title"
                    value={exp.title}
                    onChange={(e) => handleListChange(e, 'experience', index, 'title')}
                    disabled={isProcessing}
                  />
                  <Form.Control
                    className="mb-2"
                    placeholder="From"
                    value={exp.from}
                    onChange={(e) => handleListChange(e, 'experience', index, 'from')}
                    disabled={isProcessing}
                  />
                  <Form.Control
                    className="mb-2"
                    placeholder="To"
                    value={exp.to}
                    onChange={(e) => handleListChange(e, 'experience', index, 'to')}
                    disabled={isProcessing}
                  />
                  <Form.Control
                    className="mb-2"
                    placeholder="Description"
                    value={exp.description}
                    onChange={(e) => handleListChange(e, 'experience', index, 'description')}
                    disabled={isProcessing}
                  />
                  <Button variant="danger" onClick={() => removeListItem('experience', index)} disabled={isProcessing}>Remove</Button>
                </div>
              ))}
              <Button variant="primary" onClick={() => addListItem('experience', { company: '', title: '', from: '', to: '', description: '' })} disabled={isProcessing}>Add Experience</Button>
            </Form.Group>

            {/* Education */}
            <Form.Group className="mb-3">
              <Form.Label>Education</Form.Label>
              {formData.education.map((edu, index) => (
                <div key={index} className="mb-3 border rounded p-3">
                  <Form.Control
                    className="mb-2"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => handleListChange(e, 'education', index, 'degree')}
                    disabled={isProcessing}
                  />
                  <Form.Control
                    className="mb-2"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => handleListChange(e, 'education', index, 'institution')}
                    disabled={isProcessing}
                  />
                  <Form.Control
                    className="mb-2"
                    placeholder="Year"
                    value={edu.year}
                    onChange={(e) => handleListChange(e, 'education', index, 'year')}
                    disabled={isProcessing}
                  />
                  <Form.Control
                    className="mb-2"
                    placeholder="Grade"
                    value={edu.grade}
                    onChange={(e) => handleListChange(e, 'education', index, 'grade')}
                    disabled={isProcessing}
                  />
                  <Button variant="danger" onClick={() => removeListItem('education', index)} disabled={isProcessing}>Remove</Button>
                </div>
              ))}
              <Button variant="primary" onClick={() => addListItem('education', { degree: '', institution: '', year: '', grade: '' })} disabled={isProcessing}>Add Education</Button>
            </Form.Group>

            {/* Projects */}
            <Form.Group className="mb-3">
              <Form.Label>Projects</Form.Label>
              {formData.projects.map((proj, index) => (
                <div key={index} className="mb-3 border rounded p-3">
                  <Form.Control
                    className="mb-2"
                    placeholder="Title"
                    value={proj.title}
                    onChange={(e) => handleListChange(e, 'projects', index, 'title')}
                    disabled={isProcessing}
                  />
                  <Form.Control
                    className="mb-2"
                    placeholder="Description"
                    value={proj.description}
                    onChange={(e) => handleListChange(e, 'projects', index, 'description')}
                    disabled={isProcessing}
                  />
                  {/* Technologies inside project */}
                  <Form.Control
                    className="mb-2"
                    placeholder="Technologies (comma separated)"
                    value={proj.technologies ? proj.technologies.join(', ') : ''}
                    onChange={(e) => {
                      const techArray = e.target.value.split(',').map(item => item.trim());
                      handleListChange({ target: { value: techArray } }, 'projects', index, 'technologies');
                    }}
                    disabled={isProcessing}
                  />
                  <Form.Control
                    className="mb-2"
                    placeholder="Link"
                    value={proj.link}
                    onChange={(e) => handleListChange(e, 'projects', index, 'link')}
                    disabled={isProcessing}
                  />
                  <Button variant="danger" onClick={() => removeListItem('projects', index)} disabled={isProcessing}>Remove</Button>
                </div>
              ))}
              <Button variant="primary" onClick={() => addListItem('projects', { title: '', description: '', technologies: [], link: '' })} disabled={isProcessing}>Add Project</Button>
            </Form.Group>

            {/* References */}
            <Form.Group className="mb-3">
              <Form.Label>References</Form.Label>
              {formData.references.map((ref, index) => (
                <div key={index} className="mb-3 border rounded p-3">
                  <Form.Control
                    className="mb-2"
                    placeholder="Name"
                    value={ref.name}
                    onChange={(e) => handleListChange(e, 'references', index, 'name')}
                    disabled={isProcessing}
                  />
                  <Form.Control
                    className="mb-2"
                    placeholder="Position"
                    value={ref.position}
                    onChange={(e) => handleListChange(e, 'references', index, 'position')}
                    disabled={isProcessing}
                  />
                  <Form.Control
                    className="mb-2"
                    placeholder="Company"
                    value={ref.company}
                    onChange={(e) => handleListChange(e, 'references', index, 'company')}
                    disabled={isProcessing}
                  />
                  <Form.Control
                    className="mb-2"
                    placeholder="Contact"
                    value={ref.contact}
                    onChange={(e) => handleListChange(e, 'references', index, 'contact')}
                    disabled={isProcessing}
                  />
                  <Button variant="danger" onClick={() => removeListItem('references', index)} disabled={isProcessing}>Remove</Button>
                </div>
              ))}
              <Button variant="primary" onClick={() => addListItem('references', { name: '', position: '', company: '', contact: '' })} disabled={isProcessing}>Add Reference</Button>
            </Form.Group>

            {/* Submit / Cancel */}
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
  skills: PropTypes.arrayOf(PropTypes.string),
  certifications: PropTypes.arrayOf(PropTypes.string),
  experience: PropTypes.arrayOf(PropTypes.shape({
    company: PropTypes.string,
    title: PropTypes.string,
    from: PropTypes.string,
    to: PropTypes.string,
    description: PropTypes.string,
  })),
  education: PropTypes.arrayOf(PropTypes.shape({
    degree: PropTypes.string,
    institution: PropTypes.string,
    year: PropTypes.string,
    grade: PropTypes.string,
  })),
  projects: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    technologies: PropTypes.arrayOf(PropTypes.string),
    link: PropTypes.string,
  })),
  references: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    position: PropTypes.string,
    company: PropTypes.string,
    contact: PropTypes.string,
  })),
  handleSubmit: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  error: PropTypes.string,
  dismissAlert: PropTypes.func.isRequired,
};

export default Edit;
