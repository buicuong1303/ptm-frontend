import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
const useStyles = makeStyles(() => ({
  root: {
    padding: '10px 10px',
    border: '1px solid #ccc',
    position: 'relative',
    borderRadius: '5px',
    flex: '1'
  },
  label: {
    position: 'absolute',
    fontSize: '11px',
    top: '-7px',
    left: '10px',
    color: 'grey',
    backgroundColor: '#fff',
    padding: '0px 5px'
  },
  wrapperContent: {
    overflowX: 'auto'
  }
}));
const GroupInput = (props) => {
  const { children, label, className, ...rest } = props;
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <label className={classes.label}>{label}</label>
      {children}
    </div>
  );
};
GroupInput.propTypes = {
  label: PropTypes.string
};
GroupInput.defaultProps = {
  label: ''
};
export default GroupInput;
