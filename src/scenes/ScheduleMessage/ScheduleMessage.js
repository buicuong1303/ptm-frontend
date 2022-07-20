import { LinearProgress } from '@material-ui/core';
import { PermissionContext } from 'contexts/PermissionProvider';
import React, { Suspense, useContext, useEffect, useState } from 'react';
import { renderRoutes } from 'react-router-config';

export default function ScheduleMessage(props) {
  const { route } = props;
  const { authorizer } = useContext(PermissionContext);
  const [authorPermission, setAuthorPermission] = useState({
    canRead: false,
    canUpdate: false,
    canDelete: false,
    canCreate: false
  });
  const getAuthor = async () => {
    setAuthorPermission({
      ...authorPermission,
      canRead: await authorizer.current.can('read', '/schedules')
    });
  };
  useEffect(() => {
    getAuthor();
  }, []);
  return (
    <Suspense fallback={<LinearProgress />}>
      {authorPermission.canRead ? renderRoutes(route.routes) : null}
      {/* {renderRoutes(route.routes)} */}
    </Suspense>
  );
}
