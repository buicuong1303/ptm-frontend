/* eslint-disable no-unused-vars */
import { Divider, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { Header, Page } from 'components';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Waypoint } from 'react-waypoint';

import { NotificationTimeLine, ToolBar } from './components';
import Loading from 'images/Rolling-1s-200px.gif';
// import { readNotifications } from 'store/asyncActions/notification.asyncAction';
import { setFilters } from 'store/slices/notification.slice';
import { useSnackbar } from 'notistack';
import {
  getAllNotificationsOfUser,
  readAllNotificationsOfUser,
  updateNotification
} from 'store/asyncActions/notification.asyncAction';
const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    margin: '0 auto',
    padding: theme.spacing(3),
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
  }
}));
function NotificationSummary() {
  const classes = useStyles();
  const _limit = 10;
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const hasNext = useSelector((state) => state.notification.hasNext);
  const page = useSelector((state) => state.notification.page);
  const filters = useSelector((state) => state.notification.filters);
  const notifications = useSelector(
    (state) => state.notification.allNotifications
  );

  const { enqueueSnackbar } = useSnackbar();
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  async function fetchNotifications() {
    try {
      const result = await dispatch(
        getAllNotificationsOfUser({
          userId: user.id,
          _page: page,
          _limit: _limit,
          filters: filters
        })
      );
      unwrapResult(result);
    } catch (error) {
      // showSnackbar('Something wrong', 'error');
      showSnackbar('Fetch notification fail', 'error');
    }
  }
  const handleFilter = (value) => {
    dispatch(
      setFilters({ ...filters, _type: value.type, _unread: value.unread })
    );
  };
  const handleReadAll = async () => {
    try {
      const result = await dispatch(
        readAllNotificationsOfUser({ userId: user.id })
      );
      unwrapResult(result);
      fetchNotifications();
    } catch (error) {
      // showSnackbar('Something wrong', 'error');
      showSnackbar('Handle read all fail', 'error');
    }
  };
  const loadMoreData = () => {
    if (page > 1) {
      fetchNotifications();
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
      showSnackbar('Handle mark read all fail', 'error');
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
      showSnackbar('Handle mark unread fail', 'error');
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, [filters]);

  return (
    <Page title="Notification summary" className={classes.root}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Header childTitle="Notification summary" urlChild="/notifications" />
        <Divider className={classes.divider} />

        <Paper className={classes.paper} elevation={1} variant="outlined">
          <ToolBar onFilter={handleFilter} onReadAll={handleReadAll} />

          <div
            style={{
              overflowY: 'auto'
            }}
          >
            <NotificationTimeLine
              notifications={notifications}
              onMarkReadNotification={handleMarkReadNotification}
              onMarkUnReadNotification={handleMarkUnReadNotification}
            />
            {hasNext && (
              <Waypoint onEnter={loadMoreData}>
                <div
                  style={{
                    textAlign: 'center'
                  }}
                >
                  <img src={Loading} style={{ width: 50, height: 50 }} />
                </div>
              </Waypoint>
            )}
          </div>
        </Paper>
      </div>
    </Page>
  );
}

export default NotificationSummary;
