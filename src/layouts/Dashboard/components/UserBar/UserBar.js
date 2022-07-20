/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { Fragment, useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Draggable from 'react-draggable';
import {
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Typography,
  Fab,
  Badge
} from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/PeopleOutline';

import { StatusBullet } from 'components';
import onlineStatus from 'utils/onlineStatus';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 280
  },
  root: {
    backgroundColor: theme.palette.white
  },
  list: {
    padding: theme.spacing(1, 2)
  },
  listItemText: {
    marginRight: theme.spacing(1)
  },
  lastActivity: {
    whiteSpace: 'nowrap'
  },
  fab: {
    position: 'fixed',
    top: 'calc(50% - 23px)',
    right: 32,
    zIndex: theme.zIndex.drawer - 100,
    padding: 0
  },
  userOnlineItem: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    '&:hover': {
      backgroundColor: '#e0e0e0'
    }
  }
}));

const UserBar = (props) => {
  const { className, userOnlines, user, ...rest } = props;

  const classes = useStyles();

  const [isDragging, setDragging] = useState(false);
  const [open, setOpen] = useState(false);

  const [data, setData] = useState(null);

  useEffect(() => {
    const groups = [
      { id: 'user', name: 'Users' },
      // { id: onlineStatus.OFFLINE, name: 'Offline Users' }
    ];

    const connections = userOnlines.filter((item) => item.id !== user.id).map((item) => {
      return {
        groupId: 'user',
        id: item.id,
        name: item.firstName + ' ' + item.lastName,
        avatar: item.avatar,
        active: item.onlineStatus === onlineStatus.ONLINE,
        lastActivity: moment(item.lastActivity)
      };
    });

    setData({
      groups: groups,
      connections: connections
    });
  }, [userOnlines]);
  
  useEffect(() => {
    let mounted = true;

    const fetchData = () => {};

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  const handleOpen = (e) => {
    e.preventDefault();
    !isDragging && setOpen(true);
  };

  const handleDrag = () => {
    setDragging(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleStop = () => {
    setTimeout(() => {
      setDragging(false);
    }, 0);
  };

  if (!data) {
    return null;
  }

  const onlineConnections = data.connections.filter(
    (connection) => connection.active
  ).length;

  return (
    <>
      <Drawer
        anchor="left"
        classes={{ paper: classes.drawer }}
        elevation={1}
        onClose={handleClose}
        open={open}
        variant="temporary"
      >
        <div {...rest} className={clsx(classes.root, className)}>
          {data.groups.map((group) => (
            <List
              className={classes.list}
              key={group.id}
              subheader={
                <ListSubheader disableGutters disableSticky>
                  {group.name}
                </ListSubheader>
              }
            >
              {data.connections
                .filter((connection) => group.id === connection.groupId)
                .map((connection) => (
                  <ListItem disableGutters key={connection.id} className={classes.userOnlineItem}>
                    <ListItemAvatar>
                      <Avatar
                        alt="Person"
                        // component={RouterLink}
                        src={connection.avatar}
                        // to="/"
                      />
                    </ListItemAvatar>

                    <ListItemText
                      className={classes.listItemText}
                      disableTypography
                      primary={
                        <Typography
                          // component={RouterLink}
                          display="block"
                          noWrap
                          // to="/"
                          variant="h6"
                        >
                          {connection.name}
                        </Typography>
                      }
                    />

                    {connection.active ? (
                      <StatusBullet color="success" size="small" />
                    ) : (
                      <Typography
                        className={classes.lastActivity}
                        variant="body2"
                      >
                        {moment(connection.lastActivity).fromNow()}
                      </Typography>
                    )}
                  </ListItem>
                ))}
            </List>
          ))}
        </div>
      </Drawer>
      <Draggable onDrag={handleDrag} onStop={handleStop}>
        <div className={classes.fab}>
          <Badge badgeContent={onlineConnections} color="error">
            <Fab
              disableFocusRipple
              color="primary"
              onClick={(e) => handleOpen(e)}
            >
              <PeopleIcon />
            </Fab>
          </Badge>
        </div>
      </Draggable>
    </>
  );
};

UserBar.propTypes = {
  className: PropTypes.string,
  userOnlines: PropTypes.array,
  user: PropTypes.object
};

export default UserBar;
