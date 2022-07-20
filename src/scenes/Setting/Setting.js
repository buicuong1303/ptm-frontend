import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Paper,
  Switch,
  Typography
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import { Header, Page } from 'components';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSetting } from 'store/asyncActions/session.asyncAction';
import apiStatus from 'utils/apiStatus';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '1024px',
    margin: '0 auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      width: '100%'
    }
  },
  paper: {
    flex: '1',
    display: 'flex',
    minHeight: 0,
    flexDirection: 'column'
  },
  divider: {
    backgroundColor: theme.palette.primary.main,
    border: 'none',
    height: '2px',
    margin: '10px 0px'
  },
  title: {
    padding: '5px 0px',
    borderBottom: '1px solid #eee'
  },
  settingItem: {
    padding: '10px 20px'
  },
  text: {
    color: '#000000b0'
  }
}));
const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex'
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    '&$checked': {
      transform: 'translateX(12px)',
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main
      }
    }
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: 'none'
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white
  },
  checked: {}
}))(Switch);
function Setting() {
  const classes = useStyles();
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const sessionStatus = useSelector((state) => state.session.status);
  const sessionMessage = useSelector((state) => state.session.message);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (event) => {
    if (
      event.target.name === 'allowDesktopNotification' &&
      event.target.checked === true
    ) {
      if (Notification.permission === 'denied') {
        setOpen(true);
        return;
      }
    }
    dispatch(
      updateSetting({
        [event.target.name]: event.target.checked
      })
    );
  };
  const { enqueueSnackbar } = useSnackbar();
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  useEffect(() => {
    if (sessionStatus === apiStatus.ERROR)
      showSnackbar(sessionMessage, sessionStatus);
    // eslint-disable-next-line
  }, [sessionStatus]);
  return (
    <>
      <Page title="Setting" className={classes.root}>
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <Header childTitle="Setting" urlChild="/notifications" />
          <Divider className={classes.divider} />
          <Paper className={classes.paper} elevation={1} variant="outlined">
            <div className={classes.settingItem}>
              <Typography variant="h4" className={classes.title}>
                Desktop Notifications
              </Typography>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ padding: '5px 0px', color: '#ccc' }}>
                  <Typography variant="h5" className={classes.text}>
                    Enable Desktop Notifications
                  </Typography>
                  <Typography className={classes.text}>
                    Show desktop notifications when the app is not in focus
                  </Typography>
                </div>
                <AntSwitch
                  checked={user.allowDesktopNotification}
                  onChange={handleChange}
                  name="allowDesktopNotification"
                />
              </div>
            </div>
            <div className={classes.settingItem}>
              <Typography variant="h4" className={classes.title}>
                Sound Notifications
              </Typography>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ padding: '5px 0px' }}>
                  <Typography variant="h5" className={classes.text}>
                    Enable Sound Notifications
                  </Typography>
                  <Typography className={classes.text}>
                    Allow play audio when receive notification
                  </Typography>
                </div>
                <AntSwitch
                  checked={user.allowSoundNotification}
                  onChange={handleChange}
                  name="allowSoundNotification"
                />
              </div>
            </div>
          </Paper>
        </div>
      </Page>
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center' }}>
          {'Notification Not Allowed'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {
              // eslint-disable-next-line quotes
              "You currently have desktop notifications turned off. Please update your browser's settings to either allow desktop notification or allow site to aks for permission"
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Setting;
