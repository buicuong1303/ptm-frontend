/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import PropTypes from 'prop-types';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
  btnAdd: {},
}));

const ButtonCreate = (props) => {
  const { children, disabled, className, onClick, size, style, ...rest } = props;

  const classes = useStyles();

  //* render UI
  return (
    <Fab
      aria-label="add"
      className={className}
      color="primary"
      onClick={onClick}
      size={size}
      disabled={disabled}
      style={style}
    >
      {children ? children : <AddIcon />}
    </Fab>
  );
};

ButtonCreate.defaultProps = {
  disabled: false,
  children: null,
  className: '',
  size: 'small',
  style: {}
};

ButtonCreate.propsType = {
  disabled: PropTypes.bool,
  children: PropTypes.any,
  className: PropTypes.any,
  onClick: PropTypes.func,
  size: PropTypes.string,
  style: PropTypes.any
};

export default ButtonCreate;
