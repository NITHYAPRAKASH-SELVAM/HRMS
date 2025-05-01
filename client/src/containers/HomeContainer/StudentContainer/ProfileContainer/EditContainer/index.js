import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { setUser } from '../../../../../actions';
import { withAPI } from '../../../../../services/api';
import withRouter from '../../../../../services/withRouter';
import * as ROUTES from '../../../../../constants/routes';

import Edit from '../../../../../components/Home/Student/Profile/Edit';

class EditContainer extends Component {
  state = {
    formData: {
      firstName: this.props.user.firstName || '',
      lastName: this.props.user.lastName || '',
      phone: this.props.user.phone || '',
      objective: this.props.user.objective || '',
      skills: this.props.user.skills || [],
      certifications: this.props.user.certifications || [],
      experience: this.props.user.experience || [],
      education: this.props.user.education || [],
      projects: this.props.user.projects || [],
      references: this.props.user.references || [],
    },
    isProcessing: false,
    error: null,
  };

  handleSubmit = (formData) => {
    this.setState({ isProcessing: true });

    const { api, setUser, navigate } = this.props;

    const data = {
      ...formData,
      skills: formData.skills.map(s => s.trim()).filter(Boolean),
      certifications: formData.certifications.map(c => c.trim()).filter(Boolean),
      projects: formData.projects.map(p => ({
        ...p,
        technologies: Array.isArray(p.technologies)
          ? p.technologies.map(t => t.trim()).filter(Boolean)
          : [],
      })),
    };

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
  };

  dismissAlert = () => this.setState({ error: null });

  render() {
    const { formData, isProcessing, error } = this.state;

    return (
      <Edit
        {...formData}
        handleSubmit={this.handleSubmit}
        isProcessing={isProcessing}
        error={error}
        dismissAlert={this.dismissAlert}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default compose(
  connect(mapStateToProps, { setUser }),
  withAPI,
  withRouter
)(EditContainer);
