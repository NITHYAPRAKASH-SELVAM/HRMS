import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { setUser } from '../../actions';
import { withAPI } from '../../services/api';
import withRouter from '../../services/withRouter';
import * as ROLES from '../../constants/roles';

import LogIn from '../../components/LogIn';

class LogInContainer extends Component {
  state = {
    email: '',
    password: '',
    isProcessing: false,
    error: null,
  };

    handleChange = e => {
      this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = e => {
    e.preventDefault();
    this.setState({ isProcessing: true });

    const { api, setUser, location, navigate } = this.props;
    const { email, password } = this.state;

    let role = null;
    const path = location.pathname.toLowerCase();

    if (path.includes('admin')) role = ROLES.ADMIN;
    else if (path.includes('company')) role = ROLES.COMPANY;
    else if (path.includes('student')) role = ROLES.STUDENT;

    api
      .logIn(role, { email, password })
      .then(response => {
        const { user, token } = response.data;

        localStorage.setItem('token', token);
        setUser({ user });

        // ✅ Redirect user based on role
        if (role === ROLES.ADMIN) navigate('/admin/dashboard');
        else if (role === ROLES.COMPANY) navigate('/company/dashboard');
        else if (role === ROLES.STUDENT) navigate('/student/dashboard');
      })
      .catch(error =>{
        console.log('Login error:', error.response?.data || error.message);
        this.setState({
          isProcessing: false,
          error:
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            'Login failed',
        })
      });
    };

  dismissAlert = () => this.setState({ error: null });

  render() {
    const { email, password, isProcessing, error } = this.state;
    
    return (
      <LogIn
        email={email}
        password={password}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        isProcessing={isProcessing}
        error={error}
        dismissAlert={this.dismissAlert}
      />
    );
  }
}

export default compose(
  connect(null, { setUser }),
  withAPI,
  withRouter
)(LogInContainer);
