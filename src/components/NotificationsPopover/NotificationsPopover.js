import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Popover,
  CardHeader,
  CardActions,
  Divider,
  Button,
  colors
} from '@material-ui/core';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import { NotificationList, EmptyList } from './components';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { readAllNotification } from 'store/slices/notification.slice';
import {
  readAllNotificationsOfUser,
  updateNotification
} from 'store/asyncActions/notification.asyncAction';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles(() => ({
  root: {
    width: 350,
    maxWidth: '100%'
  },
  actions: {
    backgroundColor: colors.grey[50],
    justifyContent: 'center'
  }
}));

const NotificationsPopover = (props) => {
  const { topNotifications, anchorEl, ...rest } = props;
  const dispatch = useDispatch();

  const classes = useStyles();
  const unread = useSelector((state) => state.notification.unread);
  const user = useSelector((state) => state.session.user);
  const { enqueueSnackbar } = useSnackbar();
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  const handleReadAll = async () => {
    try {
      const result = await dispatch(
        readAllNotificationsOfUser({ userId: user.id })
      );
      unwrapResult(result);
      dispatch(readAllNotification());
    } catch (error) {
      // showSnackbar('Something wrong', 'error');
      showSnackbar('Read notification of user fail', 'error');
    }
  };
  const handleMarkReadNotification = async (notification) => {
    try {
      const result = await dispatch(
        updateNotification({
          userId: user.id,
          notificationId: notification.id,
          readStatus: 'read'
        })
      );
      unwrapResult(result);
    } catch (error) {
      // showSnackbar('Something wrong', 'error');
      showSnackbar('update notification fail', 'error');
    }
  };
  const handleMarkUnReadNotification = async (notification) => {
    try {
      const result = await dispatch(
        updateNotification({
          userId: user.id,
          notificationId: notification.id,
          readStatus: 'unread'
        })
      );
      unwrapResult(result);
    } catch (error) {
      // showSnackbar('Something wrong', 'error');
      showSnackbar('update notification fail', 'error');
    }
  };
  return (
    <Popover
      {...rest}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
    >
      <div className={classes.root}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <CardHeader title="Notifications" out />
          <Button
            size="small"
            color="primary"
            onClick={handleReadAll}
            disabled={unread > 0 ? false : true}
          >
            <DoneAllIcon />
          </Button>
        </div>
        <Divider />
        {topNotifications.length > 0 ? (
          <NotificationList
            notifications={topNotifications}
            onMarkReadNotification={handleMarkReadNotification}
            onMarkUnReadNotification={handleMarkUnReadNotification}
          />
        ) : (
          <EmptyList />
        )}
        <Divider />
        <CardActions className={classes.actions}>
          <Button
            component={RouterLink}
            size="small"
            to="/notifications"
            onClick={() => {
              if (props.onClose) props.onClose();
            }}
          >
            See all
          </Button>
        </CardActions>
      </div>
    </Popover>
  );
};

NotificationsPopover.propTypes = {
  anchorEl: PropTypes.any,
  className: PropTypes.string,
  topNotifications: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default NotificationsPopover;
