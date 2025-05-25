// client/src/containers/HomeContainer/CompanyContainer/ViewStudentProfileContainer/Lazy.js
import React from 'react';

const LazyComponent = React.lazy(() =>
  import('./index') // make sure this path is correct
);

export default LazyComponent;
