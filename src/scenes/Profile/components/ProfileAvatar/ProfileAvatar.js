import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Divider,
  CardActionArea,
  Typography,
  Box,
  Avatar
} from '@material-ui/core';
import { DialogConfirm } from 'components';
import { useSnackbar } from 'notistack';
import apiStatus from 'utils/apiStatus';
import { useSelector } from 'react-redux';
import { readAsArrayBuffer } from 'utils/readFilePromise';

const useStyles = makeStyles(() => ({
  root: {},
  avatarComponent: {
    // display: 'flex'
  },
  cardAvatar: {
    width: '100%'
  },
  imageAvatar: {
    borderRadius: '50%',
    position: 'relative',
    top: '0px',
    left: '50%',
    width: '200px',
    height: '200px',
    transform: 'translate(-50%, 0%)'
  },
  cardAction: {
    display: 'block',
    textAlign: 'center'
  },
  userName: {
    textAlign: 'center'
  }
}));

let newAvatar = null;

const ProfileAvatar = (props) => {
  // eslint-disable-next-line
  const { profileFull, className, handleUpdateAvatar, ...rest } = props;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const resetRef = useRef();

  //* listen state
  const updateAvatarStatus = useSelector((state) => state.profile.status);
  const updateAvatarMessage = useSelector((state) => state.profile.message);
  const updateAvatarError = useSelector((state) => state.profile.error);

  //* show notification
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  //8 init profile data
  const profileData = {
    avatar: '',
    firstName: '',
    lastName: ''
  };
  const [profile, setProfile] = useState(profileData);
  const [dialogConfirm, setDialogConfirm] = useState(false);

  const updateAvatar = async (event) => {
    if (event.target.files[0]) {
      newAvatar = await readAsArrayBuffer(event.target.files[0]);
      profile.avatar = URL.createObjectURL(event.target.files[0]);
      setProfile(Object.assign({}, profile));
    }
  };

  const handleReset = () => {
    newAvatar = null;
    profile.avatar = profileFull.avatar;
    setProfile(Object.assign({}, profile));
  };

  const handleSubmit = () => setDialogConfirm(true);

  const handleCancelDialog = () => setDialogConfirm(false);
  const handleConfirmDialog = () => {
    setDialogConfirm(false);
    handleUpdateAvatar(newAvatar);
  };

  useEffect(() => {
    setProfile({
      avatar: profileFull.avatar,
      firstName: profileFull.firstName,
      lastName: profileFull.lastName
    });
  }, [profileFull]);

  useEffect(() => {
    if (
      updateAvatarStatus === apiStatus.SUCCESS &&
      updateAvatarMessage === 'Update avatar success'
    ) {
      resetRef.current.click();
      showSnackbar(updateAvatarMessage, 'success');
    }

    if (updateAvatarStatus === apiStatus.ERROR) {
      resetRef.current.click();
      showSnackbar(updateAvatarError, 'error');
    }
    // eslint-disable-next-line
  }, [updateAvatarStatus, updateAvatarError]);

  return (
    <Grid item className={classes.avatarComponent} sm={4} xs={12}>
      <Card className={classes.cardAvatar}>
        <form>
          <CardHeader title="Avatar" />
          <Divider />
          <CardActionArea>
            <br />
            <Avatar
              alt="Person"
              className={classes.imageAvatar}
              src={profile.avatar ? profile.avatar : null}
            />
            <CardContent>
              <Typography
                className={classes.userName}
                component="h2"
                gutterBottom
                variant="h5"
              >
                {profile.firstName} {profile.lastName}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Box mx="auto">
              <Button
                color="primary"
                component="label"
                onChange={updateAvatar}
                variant="contained"
              >
                Upload Avatar
                <input
                  style={{ display: 'none' }}
                  type="file"
                  accept=".png, .jpg, .gif"
                />
              </Button>
            </Box>
          </CardActions>
          <Divider />
          <CardActions className={classes.cardAction}>
            <Button
              type="reset"
              variant="contained"
              onClick={handleReset}
              disabled={!newAvatar}
              ref={resetRef}
            >
              Reset
            </Button>
            <Button
              className={classes.saveButton}
              color="primary"
              type="button"
              variant="contained"
              onClick={handleSubmit}
              disabled={!newAvatar}
            >
              Save
            </Button>
          </CardActions>
        </form>
      </Card>
      <DialogConfirm
        message={'Saving changes'}
        handleClose={handleCancelDialog}
        handleConfirm={handleConfirmDialog}
        open={dialogConfirm}
      />
    </Grid>
  );
};

export default ProfileAvatar;

ProfileAvatar.propTypes = {
  className: PropTypes.string,
  profileFull: PropTypes.object,
  handleUpdateAvatar: PropTypes.func
};
