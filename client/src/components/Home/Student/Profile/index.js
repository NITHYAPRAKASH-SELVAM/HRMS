import React from 'react';
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

  return (
    <Container className="col-md-8">
      <Card className="shadow-sm mb-4">
        <Card.Header as="h2" className="text-center">Profile</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control readOnly value={firstName} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control readOnly value={lastName} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control readOnly value={phone} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Objective</Form.Label>
              <Form.Control as="textarea" rows={3} readOnly value={objective} />
            </Form.Group>

            {/* Skills */}
            <Form.Group className="mb-3">
              <Form.Label>Skills</Form.Label>
              <ListGroup>
                {skills?.map((skill, index) => (
                  <ListGroup.Item key={index}>{skill}</ListGroup.Item>
                ))}
              </ListGroup>
            </Form.Group>

            {/* Experience */}
            <Form.Group className="mb-3">
              <Form.Label>Experience</Form.Label>
              {experience?.map((exp, index) => (
                <Card key={index} className="mb-2">
                  <Card.Body>
                    <Card.Title>{exp.title} at {exp.company}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{exp.from} - {exp.to}</Card.Subtitle>
                    <Card.Text>{exp.description}</Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </Form.Group>

            {/* Education */}
            <Form.Group className="mb-3">
              <Form.Label>Education</Form.Label>
              {education?.map((edu, index) => (
                <Card key={index} className="mb-2">
                  <Card.Body>
                    <Card.Title>{edu.degree} - {edu.institution}</Card.Title>
                    <Card.Text>{edu.year} | Grade: {edu.grade}</Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </Form.Group>

            {/* Certifications */}
            <Form.Group className="mb-3">
              <Form.Label>Certifications</Form.Label>
              <ListGroup>
                {certifications?.map((cert, index) => (
                  <ListGroup.Item key={index}>{cert}</ListGroup.Item>
                ))}
              </ListGroup>
            </Form.Group>

            {/* Projects */}
            <Form.Group className="mb-3">
              <Form.Label>Projects</Form.Label>
              {projects?.map((project, index) => (
                <Card key={index} className="mb-2">
                  <Card.Body>
                    <Card.Title>{project.title}</Card.Title>
                    <Card.Text>{project.description}</Card.Text>
                    <Card.Text><strong>Technologies:</strong> {project.technologies?.join(', ')}</Card.Text>
                    {project.link && (
                      <Card.Link href={project.link} target="_blank" rel="noopener noreferrer">
                        View Project
                      </Card.Link>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </Form.Group>

            {/* References */}
            <Form.Group className="mb-3">
              <Form.Label>References</Form.Label>
              <ListGroup>
                {references?.map((ref, index) => (
                  <ListGroup.Item key={index}>
                    <strong>{ref.name}</strong> - {ref.position} at {ref.company} ({ref.contact})
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Form.Group>

            <Button variant="success" onClick={() => navigate(ROUTES.PROFILE_EDIT)}>
              Edit
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
