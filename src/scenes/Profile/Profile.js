import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Page } from 'components';
import { Divider } from '@material-ui/core';
import { FullProfile } from './components/';
import { Header } from 'components';

const useStyles = makeStyles((theme) => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    height: '100%',
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      width: '100%'
    }
  },
  divider: {
    backgroundColor: theme.palette.primary.main,
    border: 'none',
    height: '2px',
    margin: '10px 0px'
  },
  container: {
    marginTop: theme.spacing(3)
  },
  btnAdd: {
    marginTop: theme.spacing(2)
  },
  profileContent: {
    marginTop: theme.spacing(3)
  }
}));

const Profile = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Profile">
      <Header childTitle="Profile" urlChild="/profile" />
      <Divider className={classes.divider} />

      <FullProfile className={classes.profileContent} />
    </Page>
  );
};

export default Profile;
