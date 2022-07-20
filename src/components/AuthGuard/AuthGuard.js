import React, { Fragment, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { PermissionContext } from 'contexts/PermissionProvider';
import { useComponentWillMount } from 'hooks';
import { makeStyles } from '@material-ui/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}));

const AuthGuard = (props) => {
  const { requestPermissions, children } = props;

  const classes = useStyles();
  const [auth, setAuth] = useState(false);

  // requestPermissions example
  // [
  //   { action: 'read', result: '/users' },
  //   { action: 'create', result: '/log-activities' }
  // ]

  const { authorizer } = useContext(PermissionContext);

  const author = async (requestPermissions) => {
    for (let i = 0; i < requestPermissions.length; i++) {
      const requestPermission = requestPermissions[i];

      const canNext = await authorizer.current.can(
        requestPermission.action,
        requestPermission.result
      );

      if (!canNext) {
        window.location = '/errors/error-401';

        return;
      }
    }

    setAuth(true);

    return;
  };

  useComponentWillMount(() => author(requestPermissions));

  if (!auth)
    return (
      <Backdrop className={classes.backdrop} open>
        <CircularProgress color="inherit" />
      </Backdrop>
    );

  return <Fragment>{children}</Fragment>;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
  requestPermissions: PropTypes.array.isRequired
};

AuthGuard.defaultProps = {
  requestPermissions: []
};

export default AuthGuard;
