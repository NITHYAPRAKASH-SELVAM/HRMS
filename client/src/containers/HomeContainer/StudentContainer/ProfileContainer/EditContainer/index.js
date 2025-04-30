import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { setUser } from '../../../../../actions';
import { withAPI } from '../../../../../services/api';
import withRouter from '../../../../../services/withRouter';
import * as ROUTES from '../../../../../constants/routes';

import Edit from '../../../../../components/Home/Student/Profile/Edit';

function safeParseArray(str) {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

class EditContainer extends Component {
  state = {
    firstName: this.props.user.firstName || '',
    lastName: this.props.user.lastName || '',
    phone: this.props.user.phone || '',
    objective: this.props.user.objective || '',
    skills: (this.props.user.skills || []).join(', '),
    certifications: (this.props.user.certifications || []).join(', '),

    // NEW fields for full resume editing
    experience: JSON.stringify(this.props.user.experience || [], null, 2),
    education: JSON.stringify(this.props.user.education || [], null, 2),
    projects: JSON.stringify(this.props.user.projects || [], null, 2),
    references: JSON.stringify(this.props.user.references || [], null, 2),

    isProcessing: false,
    error: null,
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
     if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
    this.setState({ isProcessing: true });

    const { api, setUser, navigate } = this.props;
    const { firstName, lastName, phone, objective, skills, certifications, experience, education, projects, references } = this.state;
    // Log the current state
    console.log("Submitting data:", {
      firstName,
      lastName,
      phone,
      objective,
      skills,
      certifications,
      experience,
      education,
      projects,
      references
    });
    let data = {
      firstName,
      lastName,
      phone,
      objective,
      skills: skills.split(',').map(skill => skill.trim()).filter(Boolean),
      certifications: certifications.split(',').map(cert => cert.trim()).filter(Boolean),
    };

    try {
      data = {
        ...data,
        experience: JSON.parse(experience),
        education: JSON.parse(education),
        projects: JSON.parse(projects),
        references: JSON.parse(references),
      };
    } catch (err) {
      return this.setState({
        isProcessing: false,
        error: 'Invalid JSON format in Experience, Education, Projects, or References.',
      });
    }

    api
      .updateProfile(data)
      .then(() => api.getProfile())
      .then(response => setUser({ user: response.data }))
      .then(() => navigate(ROUTES.PROFILE))
      .catch(error =>
        this.setState({
          isProcessing: false,
          error: error?.response?.data?.message || 'Update failed.',
        })
      );
    }
  };

  dismissAlert = () => this.setState({ error: null });

  render() {
    const {
      firstName,
      lastName,
      phone,
      objective,
      skills,
      certifications,
      experience,
      education,
      projects,
      references,
      isProcessing,
      error,
    } = this.state;

    return (
      <Edit
        firstName={firstName}
        lastName={lastName}
        phone={phone}
        objective={objective}
        skills={skills.split(',').map(skill => skill.trim()).filter(Boolean)}
        certifications={certifications.split(',').map(cert => cert.trim()).filter(Boolean)}
        experience={safeParseArray(experience)}
        education={safeParseArray(education)}
        projects={safeParseArray(projects)}
        references={safeParseArray(references)}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        isProcessing={isProcessing}
        error={error}
        dismissAlert={this.dismissAlert}
      />
    );
    
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

export default compose(
  connect(mapStateToProps, { setUser }),
  withAPI,
  withRouter
)(EditContainer);
