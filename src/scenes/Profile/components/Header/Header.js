import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: '100%',
    textAlign: 'left',
    marginTop: theme.spacing(2)
  },

  parentTitleName: {
    fontSize: '13px',
    color: theme.palette.primary.main
  },

  titleName: {
    color: theme.palette.primary.main
  }
}));

const Header = (props) => {
  //eslint-disable-next-line
  const { className, titleName, parentTitleName, ...rest } = props;

  const classes = useStyles();

  return (
    <div
      // {...rest}
      className={clsx(classes.root, className)}
    >
      <Grid alignItems="flex-end" container justifyContent="space-between">
        <Grid>
          <p className={classes.parentTitleName}>
            {' '}
            {parentTitleName ? parentTitleName : ''}{' '}
          </p>
          <Typography component="h1" variant="h3">
            <p className={classes.titleName}> {titleName ? titleName : ''} </p>
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string,
  titleName: PropTypes.string,
  parentTitleName: PropTypes.string
};

export default Header;
