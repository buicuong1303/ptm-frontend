/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Timeline from '@material-ui/lab/Timeline';
import { makeStyles } from '@material-ui/styles';
import NotificationTimeLineItem from '../NotificationTimeLineItem';
import * as PropTypes from 'prop-types';
import moment from 'moment';
import { Menu, MenuItem } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: 'start'
  }
}));
const compare = (a, b) => a.getTime() < b.getTime();
const initialState = {
  mouseX: null,
  mouseY: null
};
function NotificationTimeLine({
  notifications,
  onMarkReadNotification,
  onMarkUnReadNotification
}) {
  const classes = useStyles();
  const startOfToday = new Date();
  const [state, setState] = useState(initialState);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  startOfToday.setHours(0, 0, 0, 0);
  var endOfToDay = new Date();
  endOfToDay.setHours(23, 59, 59, 999);

  const startOfYesterday = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24);
  startOfYesterday.setHours(0, 0, 0, 0);
  var endOfToYesterday = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24);
  endOfToYesterday.setHours(23, 59, 59, 999);

  const notificationOfToday = [];
  const notificationOfYesterday = [];
  const notificationOfOthers = [];

  notifications.forEach((item) => {
    if (
      compare(startOfToday, new Date(item.createdAt)) &&
      compare(new Date(item.createdAt), endOfToDay)
    ) {
      notificationOfToday.push(item);
    } else if (
      compare(startOfYesterday, new Date(item.createdAt)) &&
      compare(new Date(item.createdAt), endOfToYesterday)
    )
      notificationOfYesterday.push(item);
    else notificationOfOthers.push(item);
  });
  const handleOpenMenu = (event, notification) => {
    setCurrentNotification(notification);
    if (!menuOpen) {
      event.preventDefault();
      setState({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4
      });
      setMenuOpen(true);
    }
    if (menuOpen) {
      event.preventDefault();
      setState(initialState);
      setMenuOpen(false);
    }
  };

  const handleClose = () => {
    setMenuOpen(false);
    setState(initialState);
  };
  const handleMarkReadNotification = () => {
    if (!onMarkReadNotification) return;
    onMarkReadNotification(currentNotification);
    setMenuOpen(false);
  };

  const handleMarkUnReadNotification = () => {
    if (!onMarkUnReadNotification) return;
    onMarkUnReadNotification(currentNotification);
    setMenuOpen(false);
  };

  return (
    <>
      <Timeline className={classes.root}>
        {notificationOfToday.length > 0 && (
          <>
            <div>Today</div>
            {notificationOfToday.map((notification, index) => {
              return notificationOfToday.length - 1 === index ? (
                <NotificationTimeLineItem
                  key={notification.id}
                  notification={notification}
                  onRightLick={handleOpenMenu}
                  last
                />
              ) : (
                <NotificationTimeLineItem
                  key={notification.id}
                  notification={notification}
                  onRightLick={handleOpenMenu}
                />
              );
            })}
          </>
        )}
        {notificationOfYesterday.length > 0 && (
          <>
            <div>Yesterday</div>
            {notificationOfYesterday.map((notification, index) => {
              return notificationOfYesterday.length - 1 === index ? (
                <NotificationTimeLineItem
                  key={notification.id}
                  notification={notification}
                  onRightLick={handleOpenMenu}
                  last
                />
              ) : (
                <NotificationTimeLineItem
                  key={notification.id}
                  notification={notification}
                  onRightLick={handleOpenMenu}
                />
              );
            })}
          </>
        )}
        {notificationOfOthers.length > 0 && (
          <>
            <div>Others</div>
            {notificationOfOthers.map((notification, index) => {
              return notificationOfOthers.length - 1 === index ? (
                <NotificationTimeLineItem
                  key={notification.id}
                  notification={notification}
                  onRightLick={handleOpenMenu}
                  last
                />
              ) : (
                <NotificationTimeLineItem
                  key={notification.id}
                  notification={notification}
                  onRightLick={handleOpenMenu}
                />
              );
            })}
          </>
        )}
      </Timeline>
      {currentNotification && (
        <Menu
          className={classes.formMenu}
          keepMounted
          open={menuOpen}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            state.mouseY !== null && state.mouseX !== null
              ? { top: state.mouseY, left: state.mouseX }
              : undefined
          }
        >
          <div>
            {currentNotification.readStatus === 'unread' ? (
              <MenuItem
                onClick={handleMarkReadNotification}
                classes={classes.menuItemForward}
              >
                <span>Mark as read</span>
              </MenuItem>
            ) : (
              <MenuItem
                onClick={handleMarkUnReadNotification}
                classes={classes.menuItemForward}
              >
                <span>Mark as unread</span>
              </MenuItem>
            )}
          </div>
        </Menu>
      )}
    </>
  );
}
NotificationTimeLine.propTypes = {
  notifications: PropTypes.array
};
NotificationTimeLine.defaultProps = {
  notifications: []
};
export default NotificationTimeLine;
