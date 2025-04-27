import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { useNavigate } from 'react-router-dom';
import * as ROUTES from '../../../../constants/routes';

const Profile = ({
  firstName,
  lastName,
  phone,
  objective,
  skills,
  experience,
  education,
  certifications,
  projects,
  references,
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName,
    lastName,
    phone,
    objective,
    skills,
    experience,
    education,
    certifications,
    projects,
    references,
  });

  // View More states
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllExperience, setShowAllExperience] = useState(false);
  const [showAllEducation, setShowAllEducation] = useState(false);
  const [showAllCertifications, setShowAllCertifications] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllReferences, setShowAllReferences] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleListChange = (e, listName, index) => {
    const { name, value } = e.target;
    const updatedList = [...formData[listName]];
    if (listName === "skills" || listName === "certifications") {
      updatedList[index] = value; // Simple string arrays
    } else {
      updatedList[index] = { ...updatedList[index], [name]: value }; // Object arrays
    }
    setFormData({ ...formData, [listName]: updatedList });
  };

  return (
    <Container className="col-md-8">
      <Card className="shadow-sm mb-4">
        <Card.Header as="h2" className="text-center">Profile</Card.Header>
        <Card.Body>
          <Form>
            {/* Basic Fields */}
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                name="phone"
                value={formData.phone}
                onChange={handleChange}
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
              />
            </Form.Group>

            {/* Skills with View More */}
            <Form.Group className="mb-3">
              <Form.Label>Skills</Form.Label>
              <ListGroup>
                {(showAllSkills ? formData.skills : formData.skills?.slice(0, 3))?.map((skill, index) => (
                  <ListGroup.Item key={index}>
                    <Form.Control
                      name="skill"
                      value={skill}
                      onChange={(e) => handleListChange(e, 'skills', index)}
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
              {formData.skills?.length > 3 && (
                <div className="text-center mt-2">
                  <Button variant="link" onClick={() => setShowAllSkills(!showAllSkills)} style={{ textDecoration: 'none' }}>
                    {showAllSkills ? 'View Less' : 'View More'}
                  </Button>
                </div>
              )}
            </Form.Group>

            {/* Experience with View More */}
            <Form.Group className="mb-3">
              <Form.Label>Experience</Form.Label>
              {(showAllExperience ? formData.experience : formData.experience?.slice(0, 2))?.map((exp, index) => (
                <Card key={index} className="mb-2">
                  <Card.Body>
                    <Form.Control
                      name="title"
                      value={exp.title}
                      onChange={(e) => handleListChange(e, 'experience', index)}
                      placeholder="Title"
                    />
                    <Form.Control
                      name="company"
                      value={exp.company}
                      onChange={(e) => handleListChange(e, 'experience', index)}
                      placeholder="Company"
                    />
                    <Form.Control
                      name="from"
                      value={exp.from}
                      onChange={(e) => handleListChange(e, 'experience', index)}
                      placeholder="From"
                    />
                    <Form.Control
                      name="to"
                      value={exp.to}
                      onChange={(e) => handleListChange(e, 'experience', index)}
                      placeholder="To"
                    />
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="description"
                      value={exp.description}
                      onChange={(e) => handleListChange(e, 'experience', index)}
                      placeholder="Description"
                    />
                  </Card.Body>
                </Card>
              ))}
              {formData.experience?.length > 2 && (
                <div className="text-center mt-2">
                  <Button variant="link" onClick={() => setShowAllExperience(!showAllExperience)} style={{ textDecoration: 'none' }}>
                    {showAllExperience ? 'View Less' : 'View More'}
                  </Button>
                </div>
              )}
            </Form.Group>

            {/* Education with View More */}
            <Form.Group className="mb-3">
              <Form.Label>Education</Form.Label>
              {(showAllEducation ? formData.education : formData.education?.slice(0, 2))?.map((edu, index) => (
                <Card key={index} className="mb-2">
                  <Card.Body>
                    <Form.Control
                      name="degree"
                      value={edu.degree}
                      onChange={(e) => handleListChange(e, 'education', index)}
                      placeholder="Degree"
                    />
                    <Form.Control
                      name="institution"
                      value={edu.institution}
                      onChange={(e) => handleListChange(e, 'education', index)}
                      placeholder="Institution"
                    />
                    <Form.Control
                      name="year"
                      value={edu.year}
                      onChange={(e) => handleListChange(e, 'education', index)}
                      placeholder="Year"
                    />
                    <Form.Control
                      name="grade"
                      value={edu.grade}
                      onChange={(e) => handleListChange(e, 'education', index)}
                      placeholder="Grade"
                    />
                  </Card.Body>
                </Card>
              ))}
              {formData.education?.length > 2 && (
                <div className="text-center mt-2">
                  <Button variant="link" onClick={() => setShowAllEducation(!showAllEducation)} style={{ textDecoration: 'none' }}>
                    {showAllEducation ? 'View Less' : 'View More'}
                  </Button>
                </div>
              )}
            </Form.Group>

            {/* Certifications with View More */}
            <Form.Group className="mb-3">
              <Form.Label>Certifications</Form.Label>
              <ListGroup>
                {(showAllCertifications ? formData.certifications : formData.certifications?.slice(0, 3))?.map((cert, index) => (
                  <ListGroup.Item key={index}>
                    <Form.Control
                      name="certification"
                      value={cert}
                      onChange={(e) => handleListChange(e, 'certifications', index)}
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
              {formData.certifications?.length > 3 && (
                <div className="text-center mt-2">
                  <Button variant="link" onClick={() => setShowAllCertifications(!showAllCertifications)} style={{ textDecoration: 'none' }}>
                    {showAllCertifications ? 'View Less' : 'View More'}
                  </Button>
                </div>
              )}
            </Form.Group>

            {/* Projects with View More */}
            <Form.Group className="mb-3">
              <Form.Label>Projects</Form.Label>
              {(showAllProjects ? formData.projects : formData.projects?.slice(0, 2))?.map((project, index) => (
                <Card key={index} className="mb-2">
                  <Card.Body>
                    <Form.Control
                      name="title"
                      value={project.title}
                      onChange={(e) => handleListChange(e, 'projects', index)}
                      placeholder="Project Title"
                    />
                    <Form.Control
                      name="description"
                      value={project.description}
                      onChange={(e) => handleListChange(e, 'projects', index)}
                      placeholder="Description"
                    />
                    <Form.Control
                      name="technologies"
                      value={project.technologies?.join(', ')}
                      onChange={(e) => handleListChange(e, 'projects', index)}
                      placeholder="Technologies (comma separated)"
                    />
                    <Form.Control
                      name="link"
                      value={project.link}
                      onChange={(e) => handleListChange(e, 'projects', index)}
                      placeholder="Link"
                    />
                  </Card.Body>
                </Card>
              ))}
              {formData.projects?.length > 2 && (
                <div className="text-center mt-2">
                  <Button variant="link" onClick={() => setShowAllProjects(!showAllProjects)} style={{ textDecoration: 'none' }}>
                    {showAllProjects ? 'View Less' : 'View More'}
                  </Button>
                </div>
              )}
            </Form.Group>

            {/* References with View More */}
            <Form.Group className="mb-3">
              <Form.Label>References</Form.Label>
              <ListGroup>
                {(showAllReferences ? formData.references : formData.references?.slice(0, 2))?.map((ref, index) => (
                  <ListGroup.Item key={index}>
                    <Form.Control
                      name="name"
                      value={ref.name}
                      onChange={(e) => handleListChange(e, 'references', index)}
                      placeholder="Name"
                    />
                    <Form.Control
                      name="position"
                      value={ref.position}
                      onChange={(e) => handleListChange(e, 'references', index)}
                      placeholder="Position"
                    />
                    <Form.Control
                      name="company"
                      value={ref.company}
                      onChange={(e) => handleListChange(e, 'references', index)}
                      placeholder="Company"
                    />
                    <Form.Control
                      name="contact"
                      value={ref.contact}
                      onChange={(e) => handleListChange(e, 'references', index)}
                      placeholder="Contact"
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
              {formData.references?.length > 2 && (
                <div className="text-center mt-2">
                  <Button variant="link" onClick={() => setShowAllReferences(!showAllReferences)} style={{ textDecoration: 'none' }}>
                    {showAllReferences ? 'View Less' : 'View More'}
                  </Button>
                </div>
              )}
            </Form.Group>

            {/* Save Button */}
            <Button variant="success" onClick={() => navigate(ROUTES.PROFILE_EDIT)}>
              Save
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

Profile.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  phone: PropTypes.string,
  objective: PropTypes.string,
  skills: PropTypes.array,
  experience: PropTypes.array,
  education: PropTypes.array,
  certifications: PropTypes.array,
  projects: PropTypes.array,
  references: PropTypes.array,
};

export default Profile;
