import React, { Component } from 'react';
import { connect } from 'react-redux';

import Profile from '../../../../components/Home/Student/Profile';

class ProfileContainer extends Component {
  state = {
    firstName: this.props.user.firstName,
    lastName: this.props.user.lastName,
    phone: this.props.user.phone,

    // Resume-style fields
    objective: this.props.user.objective,
    skills: this.props.user.skills,
    experience: this.props.user.experience,
    education: this.props.user.education,
    certifications: this.props.user.certifications,
    projects: this.props.user.projects,
    references: this.props.user.references,
  };

  render() {
    return <Profile {...this.state} />;
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(ProfileContainer);

