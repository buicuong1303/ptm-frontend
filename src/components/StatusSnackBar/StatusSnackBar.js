import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@material-ui/core';
import { Alert } from './components';

const StatusSnackbar = (props) => {
  const { open, onClose, status, message } = props;

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      autoHideDuration={5000}
      onClose={onClose}
      open={open}
    >
      <Alert onClose={onClose} severity={status === '' ? 'success' : status}>
        {message}
      </Alert>
    </Snackbar>
  );
};

StatusSnackbar.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired
};

StatusSnackbar.defaultProps = {
  open: true,
  onClose: () => {}
};

export default StatusSnackbar;
