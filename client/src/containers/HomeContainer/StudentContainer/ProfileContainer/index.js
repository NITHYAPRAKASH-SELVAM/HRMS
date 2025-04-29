import React from 'react';
import { useSelector } from 'react-redux';
import Profile from '../../../../components/Home/Student/Profile';

const ProfileContainer = () => {
  const user = useSelector((state) => state.user || {});

  const {
    firstName = '',
    lastName = '',
    phone = '',
    objective = '',
    skills = [],
    experience = [],
    education = [],
    certifications = [],
    projects = [],
    references = [],
  } = user;

  return (
    <Profile
      firstName={firstName}
      lastName={lastName}
      phone={phone}
      objective={objective}
      skills={skills}
      experience={experience}
      education={education}
      certifications={certifications}
      projects={projects}
      references={references}
    />
  );
};

export default ProfileContainer;