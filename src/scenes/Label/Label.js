import { LinearProgress } from '@material-ui/core';
import React from 'react';
import { Suspense } from 'react';
import { renderRoutes } from 'react-router-config';

function Label(props) {
  const { route } = props;
  return (
    <Suspense fallback={<LinearProgress />}>
      {renderRoutes(route.routes)}
    </Suspense>
  );
}

export default Label;
