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

  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllExperience, setShowAllExperience] = useState(false);
  const [showAllEducation, setShowAllEducation] = useState(false);
  const [showAllCertifications, setShowAllCertifications] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllReferences, setShowAllReferences] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleListChange = (e, listName, index) => {
    const { name, value } = e.target;
    const updatedList = [...formData[listName]];

    if (listName === "skills" || listName === "certifications") {
      updatedList[index] = value;
    } else if (name === "technologies") {
      updatedList[index] = { ...updatedList[index], [name]: value.split(',').map(item => item.trim()) };
    } else {
      updatedList[index] = { ...updatedList[index], [name]: value };
    }
    setFormData((prev) => ({ ...prev, [listName]: updatedList }));
  };

  const handleSave = () => {
    navigate(ROUTES.PROFILE_EDIT, { state: { formData } });
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

            {/* Skills */}
            <Form.Group className="mb-3">
              <Form.Label>Skills</Form.Label>
              <ListGroup>
                {(showAllSkills ? formData.skills : formData.skills?.slice(0, 3))?.map((skill, index) => (
                  <ListGroup.Item key={index}>
                    <Form.Control
                      value={skill}
                      onChange={(e) => handleListChange(e, 'skills', index)}
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
              {formData.skills?.length > 3 && (
                <div className="text-center mt-2">
                  <Button variant="link" className="text-decoration-none" onClick={() => setShowAllSkills(!showAllSkills)}>
                    {showAllSkills ? 'View Less' : 'View More'}
                  </Button>
                </div>
              )}
            </Form.Group>

            {/* Experience */}
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
                      className="mb-2"
                    />
                    <Form.Control
                      name="company"
                      value={exp.company}
                      onChange={(e) => handleListChange(e, 'experience', index)}
                      placeholder="Company"
                      className="mb-2"
                    />
                    <Form.Control
                      name="from"
                      value={exp.from}
                      onChange={(e) => handleListChange(e, 'experience', index)}
                      placeholder="From"
                      className="mb-2"
                    />
                    <Form.Control
                      name="to"
                      value={exp.to}
                      onChange={(e) => handleListChange(e, 'experience', index)}
                      placeholder="To"
                      className="mb-2"
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
                  <Button variant="link" className="text-decoration-none" onClick={() => setShowAllExperience(!showAllExperience)}>
                    {showAllExperience ? 'View Less' : 'View More'}
                  </Button>
                </div>
              )}
            </Form.Group>

            {/* Education */}
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
                      className="mb-2"
                    />
                    <Form.Control
                      name="institution"
                      value={edu.institution}
                      onChange={(e) => handleListChange(e, 'education', index)}
                      placeholder="Institution"
                      className="mb-2"
                    />
                    <Form.Control
                      name="year"
                      value={edu.year}
                      onChange={(e) => handleListChange(e, 'education', index)}
                      placeholder="Year"
                      className="mb-2"
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
                  <Button variant="link" className="text-decoration-none" onClick={() => setShowAllEducation(!showAllEducation)}>
                    {showAllEducation ? 'View Less' : 'View More'}
                  </Button>
                </div>
              )}
            </Form.Group>

            {/* Certifications */}
            <Form.Group className="mb-3">
              <Form.Label>Certifications</Form.Label>
              <ListGroup>
                {(showAllCertifications ? formData.certifications : formData.certifications?.slice(0, 3))?.map((cert, index) => (
                  <ListGroup.Item key={index}>
                    <Form.Control
                      value={cert}
                      onChange={(e) => handleListChange(e, 'certifications', index)}
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
              {formData.certifications?.length > 3 && (
                <div className="text-center mt-2">
                  <Button variant="link" className="text-decoration-none" onClick={() => setShowAllCertifications(!showAllCertifications)}>
                    {showAllCertifications ? 'View Less' : 'View More'}
                  </Button>
                </div>
              )}
            </Form.Group>

            {/* Projects */}
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
                      className="mb-2"
                    />
                    <Form.Control
                      name="description"
                      value={project.description}
                      onChange={(e) => handleListChange(e, 'projects', index)}
                      placeholder="Description"
                      className="mb-2"
                    />
                    <Form.Control
                      name="technologies"
                      value={project.technologies?.join(', ')}
                      onChange={(e) => handleListChange(e, 'projects', index)}
                      placeholder="Technologies (comma separated)"
                      className="mb-2"
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
                  <Button variant="link" className="text-decoration-none" onClick={() => setShowAllProjects(!showAllProjects)}>
                    {showAllProjects ? 'View Less' : 'View More'}
                  </Button>
                </div>
              )}
            </Form.Group>

            {/* References */}
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
                      className="mb-2"
                    />
                    <Form.Control
                      name="position"
                      value={ref.position}
                      onChange={(e) => handleListChange(e, 'references', index)}
                      placeholder="Position"
                      className="mb-2"
                    />
                    <Form.Control
                      name="company"
                      value={ref.company}
                      onChange={(e) => handleListChange(e, 'references', index)}
                      placeholder="Company"
                      className="mb-2"
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
                  <Button variant="link" className="text-decoration-none" onClick={() => setShowAllReferences(!showAllReferences)}>
                    {showAllReferences ? 'View Less' : 'View More'}
                  </Button>
                </div>
              )}
            </Form.Group>

            {/* Save Button */}
            <div className="text-center">
              <Button variant="success" onClick={handleSave}>
                Save
              </Button>
            </div>
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
  skills: PropTypes.arrayOf(PropTypes.string),
  experience: PropTypes.arrayOf(PropTypes.object),
  education: PropTypes.arrayOf(PropTypes.object),
  certifications: PropTypes.arrayOf(PropTypes.string),
  projects: PropTypes.arrayOf(PropTypes.object),
  references: PropTypes.arrayOf(PropTypes.object),
};

export default Profile;
