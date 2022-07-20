/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { IconButton, Typography } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  childTitle: {
    color: theme.palette.primary.main
  },
  parentTitle: {
    color: '#A4A4A4'
  },
  linkSize: {
    maxWidth: '100px',
    display: 'flex'
  }
}));

const Header = (props) => {
  const {
    className,
    handleReload,
    title,
    childTitle,
    description,
    url,
    urlChild,
    disabledReload,
    isParent,
    showReload,
    ...rest
  } = props;

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
      {urlChild ? (
        <Link to={urlChild}>
          <Typography
            component="h1"
            variant="h3"
            className={isParent ? classes.parentTitle : classes.childTitle}
          >
            {childTitle}
          </Typography>
        </Link>
      ) : (
        <Typography
          component="h1"
          variant="h3"
          className={isParent ? classes.parentTitle : classes.childTitle}
        >
          {childTitle}
        </Typography>
      )}

      {showReload ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: 10
          }}
        >
          <IconButton
            color="primary"
            onClick={handleReload}
            style={{ padding: 0 }}
            disabled={disabledReload}
          >
            <CachedIcon />
          </IconButton>
        </div>
      ) : null}
      {/* <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginLeft: 10
        }}
      >
        <IconButton
          color="primary"
          onClick={handleReload}
          style={{ padding: 0 }}
          disabled={disabledReload}
        >
          <CachedIcon />
        </IconButton>
      </div> */}
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  childTitle: PropTypes.string,
  url: PropTypes.string,
  urlChild: PropTypes.string,
  disabledReload: PropTypes.bool
};
Header.defaultProps = {
  childTitle: '',
  title: '',
  url: '',
  urlChild: ''
};

export default Header;
