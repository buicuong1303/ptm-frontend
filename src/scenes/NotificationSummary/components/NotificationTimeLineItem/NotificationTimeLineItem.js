/* eslint-disable no-unused-vars */
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator
} from '@material-ui/lab';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import ScheduleIcon from '@material-ui/icons/Schedule';
import PhoneIcon from '@material-ui/icons/PhoneInTalk';
import React from 'react';
import './style.scss';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import clsx from 'clsx';
import { Message } from '@material-ui/icons';
import htmlParser from 'html-react-parser';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 90,
    width: '100%',
    margin: '5px 0px'
  },
  content: {
    width: '500px',
    display: 'flex',
    flexDirection: 'column',
    // height: 60,
    borderRadius: 5,
    marginLeft: theme.spacing(1),
    cursor: 'pointer'
    // '&:hover': {
    //   backgroundColor: '#ebebeb'
    // }
  },
  unread: {
    backgroundColor: '#e6f5eb'
  },
  title: {
    flex: '1',
    paddingRight: theme.spacing(2),
    fontSize: 14,
    padding: '5px 0px',
    fontWeight: '300'
  },
  time: {
    fontSize: 14,
    color: '#94979b',
    fontWeight: '300'
  },
  dot: {
    height: 45,
    width: 45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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
    whiteSpace: 'pre-wrap',
    textOverflow: 'ellipsis'
  },
  connector: {},
  dateTime: {
    marginLeft: 'auto',
    fontSize: 14,
    color: '#191716',
    fontWeight: '300',
    top: 0
  }
}));
function NotificationTimeLineItem({ notification, last, onRightLick }) {
  const classes = useStyles();
  const types = {
    client: <ContactPhoneIcon />,
    schedule: <ScheduleIcon />,
    call: <PhoneIcon />,
    message: <Message />
  };
  const handleRightClick = (e) => {
    if (!onRightLick) return;
    onRightLick(e, notification);
  };
  return (
    <TimelineItem className={classes.root}>
      <TimelineSeparator>
        <TimelineDot
          className={clsx(classes.dot, {
            [classes.client]: notification.type === 'client',
            [classes.schedule]: notification.type === 'schedule',
            [classes.call]: notification.type === 'call',
            [classes.message]: notification.type === 'message'
          })}
        >
          {types[notification.type]}
        </TimelineDot>

        {!last && <TimelineConnector className={classes.connector} />}
      </TimelineSeparator>
      <TimelineContent
        className={clsx(classes.content, {
          [classes.unread]: notification.readStatus === 'unread'
        })}
        onContextMenu={handleRightClick}
      >
        <div style={{ display: 'flex' }}>
          <span className={clsx(classes.title, classes.notificationContent)}>
            {' '}
            <p className={classes.notificationContent}>
              {htmlParser(notification.content)}
            </p>
          </span>
          <span className={classes.dateTime}>
            {moment(notification.createdAt).format('YYYY-MM-DD hh:mm:ss')}
          </span>
        </div>

        <span className={classes.time}>
          {moment(notification.createdAt).fromNow()}
        </span>
      </TimelineContent>
    </TimelineItem>
  );
}
NotificationTimeLineItem.propType = {
  notification: PropTypes.object.isRequired,
  last: PropTypes.bool
};
NotificationTimeLineItem.defaultProps = {
  last: false
};
export default NotificationTimeLineItem;
