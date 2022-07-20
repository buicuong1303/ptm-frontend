/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, withStyles } from '@material-ui/styles';
import {
  AppBar,
  Badge,
  Button,
  IconButton,
  Toolbar,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Popover,
  Drawer,
  TextField,
  Backdrop
} from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import ProfileIcon from '@material-ui/icons/PermIdentityOutlined';
import { useRouter } from 'hooks';
import {
  DialogConfirmSignOut,
  DialogWarning,
  NotificationsPopover
} from 'components';
import { signOut } from 'store/slices/session.slice';
import { readNotifications } from 'store/asyncActions/notification.asyncAction';
import PanelSearch from '../PanelSearch';
import apiStatus from 'utils/apiStatus';
import getExp from 'utils/getExp';
import decodeToken from 'utils/decodeToken';
import { useSnackbar } from 'notistack';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { Link as RouterLink } from 'react-router-dom';
const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: '#283593'
    },
    '& .MuiInputBase-root': {
      color: '#283593'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#283593'
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: '#dcdc'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#283593'
      },
      '&:hover fieldset': {
        borderColor: 'yellow'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#283593'
      }
    }
  }
})(TextField);
const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: '0 2px 2px -2px #d4cfcf',
    width: '100%',
    backgroundColor: theme.palette.white
  },
  toolbar: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  flexGrow: {
    flexGrow: 1
  },
  toolList: {
    flex: '1',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  toolItem: {
    marginLeft: theme.spacing(1)
  },
  optionItem: {
    width: '150px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    '& > span > div': {
      textAlign: 'center'
    }
  },
  drawer: {
    width: '40%',

    [theme.breakpoints.down('xs')]: {
      width: '100%'
    },
    padding: '30px 20px'
  },
  menuIcon: {
    color: theme.palette.primary.main
  },
  search: {
    transition: 'all .3s',
    width: 100,
    position: 'relative'
    // marginRight: '30px'
  },

  searchResult: {
    marginTop: '20px',
    display: 'none',
    position: 'absolute',
    top: '100%',
    right: 0,
    width: '500px',
    height: '200px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;'
  },
  icon: {
    color: theme.palette.primary.main
  }
}));

const TopBar = (props) => {
  const { onOpenNavBarMobile, className, ...rest } = props;

  const classes = useStyles();
  const { history } = useRouter();
  const dispatch = useDispatch();

  const searchInputRef = useRef(null);
  const searchResultRef = useRef(null);
  const avatarRef = useRef(null);
  const notificationsRef = useRef(null);

  const [openNotifications, setOpenNotifications] = useState(false);
  const [openAvatarOptions, setOpenAvatarOptions] = useState(false);
  const [openSearchDrawer, setOpenSearchDrawer] = useState(false);
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  //* show notification
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  const user = useSelector((state) => state.session.user);
  const { topNotifications, unread } = useSelector(
    (state) => state.notification
  );
  const jumpStatus = useSelector(
    (state) => state.message.jumpMessages.manager.jumpStatus
  );

  //* Dialog Confirm
  const initSignOutValue = { open: false, message: '' };
  const [dialogConfirmSignOutValue, setDialogConfirmSignOutValue] =
    useState(initSignOutValue);
  const handleOpenDialogConfirmSignOut = () =>
    setDialogConfirmSignOutValue({
      open: true,
      message: 'This will end your session'
    });
  const handleSubmitDialogConfirmSignOut = async () => handleLogout();
  const handleCloseDialogConfirmSignOut = () =>
    setDialogConfirmSignOutValue(initSignOutValue);

  //* Dialog Warning
  const initWarningValue = { open: false, title: '', message: '' };
  const [dialogWarningValue, setDialogWarningValue] =
    useState(initWarningValue);
  const handleOpenDialogWarning = (title, message) => {
    setDialogWarningValue({
      open: true,
      title: title,
      message: message
    });
  };
  const handleCloseDialogWarning = () => {
    setDialogWarningValue(initWarningValue);
    handleLogout();
  };

  //* handle logic
  const handleLogout = () => {
    history.push('/auth/sign-in');
    localStorage.removeItem('accessToken');
    dispatch(signOut());
  };

  const expTimeoutRef = useRef();
  const decodedToken = decodeToken(localStorage.getItem('accessToken'));
  const time = getExp(decodedToken?.exp);
  if (time > 0) {
    if (expTimeoutRef.current) clearTimeout(expTimeoutRef.current);

    expTimeoutRef.current = setTimeout(() => {
      handleOpenDialogWarning(
        'Your session has expired',
        'Please login again to continue using the app'
      );
    }, time * 1000);
  }

  const handleProfile = () => {
    history.push('/profile');
  };

  const handleNotificationsOpen = async () => {
    setOpenNotifications(true);

    // const actionResult = await dispatch(readNotifications(user.id));
    // const { error } = unwrapResult(actionResult);
  };

  const handleNotificationsClose = async () => {
    setOpenNotifications(false);
    // const notificationIds = topNotifications.reduce((total, item) => {
    //   if (item.readStatus === 'unread') total = [...total, item.id];
    //   return total;
    // }, []);
    // if (notificationIds.length > 0) {
    //   dispatch(readNotifications({ userId: user.id, notificationIds }));
    // }
  };
  window.onbeforeunload = (event) => {
    const e = event || window.event;
    const notificationIds = topNotifications.reduce((total, item) => {
      if (item.readStatus === 'unread') total = [...total, item.id];
      return total;
    }, []);
    if (notificationIds.length > 0) {
      openNotifications &&
        dispatch(readNotifications({ userId: user.id, notificationIds }));
    }
    // Cancel the event
  };
  const handleAvatarOptions = () => {
    setOpenAvatarOptions(!openAvatarOptions);
  };

  const handleSearchDrawer = (status) => {
    setOpenSearchDrawer(status);
  };

  useEffect(() => {
    if (jumpStatus === apiStatus.SUCCESS) setOpenBackDrop(false);
    else if (jumpStatus === apiStatus.PENDING) setOpenBackDrop(true);
    else if (jumpStatus === apiStatus.ERROR) {
      setOpenBackDrop(false);
      // showSnackbar('Something wrong', 'error');
      showSnackbar('Handle top bar fail', 'error');
    }
  }, [jumpStatus]);

  useEffect(() => {
    if (time <= 0) {
      handleOpenDialogWarning(
        'Your session has expired',
        'Please login again to continue using the app'
      );
    }
    return () => clearTimeout(expTimeoutRef.current);
  }, []);

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
      color="primary"
      position="static"
    >
      <Toolbar className={classes.toolbar}>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onOpenNavBarMobile}>
            <MenuIcon className={classes.menuIcon} />
          </IconButton>
        </Hidden>

        {/* tools key */}
        <div className={classes.toolList}>
          <IconButton
            onClick={() => handleSearchDrawer(true)}
            className={classes.icon}
            color="inherit"
          >
            <SearchIcon />
          </IconButton>
          <div className={classes.searchWrapper}>
            <List ref={searchResultRef} className={classes.searchResult}>
              <ListItem className={classes.optionItem}>
                <ListItemText>test</ListItemText>
              </ListItem>

              <ListItem className={classes.optionItem}>
                <ListItemText>test</ListItemText>
              </ListItem>
            </List>
          </div>

          <IconButton
            className={classes.toolItem}
            color="inherit"
            onClick={handleNotificationsOpen}
            ref={notificationsRef}
          >
            <Badge badgeContent={unread} max={99} color="error">
              <NotificationsIcon className={classes.icon} />
            </Badge>
          </IconButton>

          <IconButton
            className={classes.toolItem}
            color="inherit"
            component={RouterLink}
            to="/setting"
          >
            <SettingsOutlinedIcon className={classes.icon} />
          </IconButton>

          <Button
            className={classes.toolItem}
            color="inherit"
            onClick={handleAvatarOptions}
            ref={avatarRef}
          >
            <Avatar
              alt="Person"
              className={classes.avatar}
              src={user ? user.avatar : ''}
            />

            <Popover
              open={openAvatarOptions}
              anchorEl={avatarRef.current}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
            >
              <List>
                <ListItem
                  onClick={handleProfile}
                  component={Button}
                  className={classes.optionItem}
                >
                  <ListItemIcon className={classes.menuIcon}>
                    <ProfileIcon />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </ListItem>

                <ListItem
                  onClick={handleOpenDialogConfirmSignOut}
                  component={Button}
                  className={classes.optionItem}
                >
                  <ListItemIcon className={classes.menuIcon}>
                    <InputIcon />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </ListItem>
              </List>
            </Popover>
          </Button>
        </div>
        {/*end tools key */}
      </Toolbar>

      <NotificationsPopover
        anchorEl={notificationsRef.current}
        topNotifications={topNotifications}
        onClose={handleNotificationsClose}
        open={openNotifications}
      />

      <Drawer
        anchor="right"
        classes={{ paper: classes.drawer }}
        elevation={1}
        onClose={() => handleSearchDrawer(false)}
        open={openSearchDrawer}
        variant="temporary"
      >
        <PanelSearch onClose={() => handleSearchDrawer(false)} />
      </Drawer>

      <Backdrop style={{ zIndex: 1 }} open={openBackDrop} />

      <DialogConfirmSignOut
        handleClose={handleCloseDialogConfirmSignOut}
        handleConfirm={handleSubmitDialogConfirmSignOut}
        message={dialogConfirmSignOutValue.message}
        open={dialogConfirmSignOutValue.open}
      />

      <DialogWarning
        onClose={handleCloseDialogWarning}
        message={dialogWarningValue.message}
        open={dialogWarningValue.open}
        title={dialogWarningValue.title}
        submitTitle="I Got It"
      />
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onOpenNavBarMobile: PropTypes.func
};

export default TopBar;
