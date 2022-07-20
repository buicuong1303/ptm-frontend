import React, { forwardRef } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  navLink: {
    height: '100%'
  }
}));

// eslint-disable-next-line react/display-name
const CustomRouterLink = forwardRef((props, ref) => {
  const classes = useStyles();
  const { className, to } = props;

  return (
    <div className={clsx(className, classes.root)} ref={ref}>
      <NavLink className={classes.navLink} to={!to ? '/#' : to} {...props} />
    </div>
  );
});

CustomRouterLink.propTypes = {
  className: PropTypes.string,
  to: PropTypes.string
};

export default CustomRouterLink;
