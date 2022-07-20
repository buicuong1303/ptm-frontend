import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import logoImg from 'images/logo_light.png';

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: 'none',
    width: '100%'
  },
  logo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing(2)
  },
  logoImg: {
    height: '40px',
    width: '40px',
    marginRight: theme.spacing(1)
  },
  logoText: {
    marginLeft: '5px',
    color: 'white',
    fontSize: '20px'
  }
}));

const Topbar = (props) => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <AppBar {...rest} className={clsx(classes.root, className)} color="primary">
      <Toolbar>
        <RouterLink to="/" className={classes.logo}>
          <img alt="Logo" src={logoImg} className={classes.logoImg} />
          <Typography className={classes.logoText}>PHP Text Message</Typography>
        </RouterLink>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string
};

export default Topbar;
