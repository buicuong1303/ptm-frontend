import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem
} from '@material-ui/core';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import ScheduleIcon from '@material-ui/icons/Schedule';
import PhoneIcon from '@material-ui/icons/PhoneInTalk';
import { Message } from '@material-ui/icons';
import TooltipCustom from 'components/TooltipCustom';
import htmlParser from 'html-react-parser';

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'auto',
    height: 400
  },
  listItem: {
    height: 80,
    borderBottom: '3px solid #ffff',
    '&:hover': {
      backgroundColor: theme.palette.background.default
    }
  },
  listItemUnRead: {
    borderBottom: '3px solid #ffff',
    height: 80,
    backgroundColor: '#e5f5eaee'
  },
  client: {
    backgroundColor: '#43a047'
  },
  schedule: {
    backgroundColor: '#E6AF2E'
  },
  call: {
    backgroundColor: '#c72c38'
  },
  message: {
    backgroundColor: '#3f52b5'
  },
  notificationContent: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  tooltipContent: {
    maxWidth: '500px',
    display: 'inline-block',
    position: 'relative',
    fontSize: '14px',
    textAlign: 'start',
    wordBreak: 'break-word',
    fontWeight: '400',
    borderRadius: '5px',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.3'
  },
  formMenu: {
    boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
  }
}));
const initialState = {
  mouseX: null,
  mouseY: null
};
const NotificationList = (props) => {
  const {
    notifications,
    className,
    onMarkReadNotification,
    onMarkUnReadNotification,
    ...rest
  } = props;

  const classes = useStyles();
  const [state, setState] = useState(initialState);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const avatars = {
    schedule: (
      <Avatar className={classes.schedule}>
        <ScheduleIcon />
      </Avatar>
    ),
    client: (
      <Avatar className={classes.client}>
        <ContactPhoneIcon />
      </Avatar>
    ),
    call: (
      <Avatar className={classes.call}>
        <PhoneIcon />
      </Avatar>
    ),
    message: (
      <Avatar className={classes.message}>
        <Message />
      </Avatar>
    )
  };
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
    <List {...rest} className={clsx(classes.root, className)} disablePadding>
      {notifications.map((notification, i) => (
        <TooltipCustom
          key={i}
          icon={
            <ListItem
              className={clsx({
                [classes.listItem]: notification.readStatus === 'read',
                [classes.listItemUnRead]: notification.readStatus === 'unread'
              })}
              onContextMenu={(e) => handleOpenMenu(e, notification)}
              component={RouterLink}
              divider={i < notifications.length - 1}
              key={notification.id + i}
              to="#"
            >
              <ListItemAvatar>{avatars[notification.type]}</ListItemAvatar>
              <ListItemText
                primary={
                  <div>
                    <p className={classes.notificationContent}>
                      {htmlParser(notification.content)}
                    </p>
                  </div>
                }
                primaryTypographyProps={{ variant: 'body1' }}
                secondary={<>{moment(notification.createdAt).fromNow()}</>}
              />
            </ListItem>
          }
        >
          <div className={classes.tooltipContent}>
            {htmlParser(notification.content)}
          </div>
        </TooltipCustom>
      ))}
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
    </List>
  );
};

NotificationList.propTypes = {
  className: PropTypes.string,
  notifications: PropTypes.array.isRequired
};

export default NotificationList;
