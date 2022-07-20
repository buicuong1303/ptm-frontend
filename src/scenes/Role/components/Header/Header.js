import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: '100%',
    textAlign: 'left'
  },

  titleName: {
    color: theme.palette.primary.main
  }
}));

const Header = (props) => {
  //eslint-disable-next-line
  const { className, titleName, ...rest } = props;

  const classes = useStyles();

  return (
    <div
      // {...rest}
      className={clsx(classes.root, className)}
    >
      <Grid alignItems="flex-end" container justifyContent="space-between">
        <Grid>
          <Typography component="h1" variant="h3">
            <span className={classes.titleName}>
              {' '}
              {titleName ? titleName : ''}{' '}
            </span>
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
