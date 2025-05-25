import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { withAPI } from '../../../../services/api';
import ViewStudentProfile from '../../../../components/Home/Company/ViewStudentProfile';

const ViewStudentProfileContainer = ({ api }) => {
  const { id: studentId } = useParams();

  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) {
      setError('No student ID provided.');
      setLoading(false);
      return;
    }

    api
      .getStudentById(studentId)
      .then((response) => {
        setStudentProfile(response.data);
        setLoading(false);
      })
      .catch((error) => {
        const errorMsg = error?.response?.data?.message || 'Error loading student profile';
        setError(errorMsg);
        setLoading(false);
      });
  }, [api, studentId]);

  if (loading) return <p>Loading student profile...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return <ViewStudentProfile {...studentProfile} readOnly />;
};

export default withAPI(ViewStudentProfileContainer);
