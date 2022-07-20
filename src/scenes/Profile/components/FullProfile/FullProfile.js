/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar';
import ProfileInformation from '../ProfileInformation/ProfileInformation';
import { Backdrop, CircularProgress, Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProfile,
  updateAvatar,
  updateProfile
} from 'scenes/Profile/Profile.asyncAction';
import { clearStateProfile } from 'scenes/Profile/Profile.slice';
import apiStatus from 'utils/apiStatus';

const useStyles = makeStyles((theme) => ({
  root: {},
  cardAvata: {},
  form: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%'
    }
  },
  formControl: {
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  marginInput: {
    margin: '8px 0px !important'
  },
  formAction: {
    '& > *': {
      margin: theme.spacing(1)
    },
    padding: '20px',
    textAlign: 'right'
  },
  inputControl: {
    display: 'flex'
  },
  inputAction: {
    position: 'relative',
    bottom: '-30px'
  }
}));

const FullProfile = (props) => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.profile.profile);
  const backdrop = useSelector((state) => state.profile.backdrop);

  //* Backdrop
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleToggleBackdrop = (status) => {
    if (status === apiStatus.PENDING) {
      setOpenBackdrop(true);
    } else {
      setTimeout(() => {
        if (status !== apiStatus.PENDING) {
          setOpenBackdrop(false);
        }
      }, 500);
    }
  };

  //* handle update avatar
  const handleUpdateAvatar = (avatar) => {
    dispatch(updateAvatar({ avatar: avatar }));
  };

  //* handle update profile
  const handleUpdateProfile = (profileUpdate) => {
    dispatch(updateProfile({ profileUpdate: profileUpdate }));
  };

  //* get profile first time
  useEffect(() => {
    dispatch(getProfile());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    handleToggleBackdrop(backdrop);
    // eslint-disable-next-line
  }, [backdrop]);

  //* clear state profile when unmount
  useEffect(() => {
    return () => dispatch(clearStateProfile());
    // eslint-disable-next-line
  }, []);

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      { profile &&
        <Grid container spacing={3}>
          <ProfileAvatar
            handleUpdateAvatar={handleUpdateAvatar}
            profileFull={profile}
            className={classes.profileContent}
          />
          <ProfileInformation
            handleUpdateProfile={handleUpdateProfile}
            profileFull={profile}
            className={classes.profileContent}
          />
        </Grid>
      }
      <Backdrop className={classes.backdrop} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default FullProfile;

FullProfile.propTypes = {
  className: PropTypes.string
};
