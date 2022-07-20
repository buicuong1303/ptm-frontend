/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  childTitle: {
    color: theme.palette.primary.main
  },
  linkSize: {
    maxWidth: '250px'
  }
}));

const Header = (props) => {
  const { className, title, childTitle, description, url, ...rest } = props;

  const classes = useStyles();
  return (
    <div {...rest} className={clsx(classes.root, classes.linkSize, className)}>
      {title && (
        <Link to={url}>
          <Typography
            color="primary"
            component="h2"
            gutterBottom
            variant="overline"
          >
            {title}
          </Typography>
        </Link>
      )}
      <Link>
        <Typography component="h1" variant="h3" className={classes.childTitle}>
          {childTitle}
        </Typography>
      </Link>
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  childTitle: PropTypes.string,
  url: PropTypes.string,
  urlChild: PropTypes.string
};
Header.defaultProps = {
  childTitle: '',
  title: '',
  url: '',
  urlChild: ''
};

export default Header;
