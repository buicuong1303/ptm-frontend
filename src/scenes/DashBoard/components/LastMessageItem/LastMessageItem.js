/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import { makeStyles, withStyles } from '@material-ui/styles';
import { StringFormat } from 'components';
import { formatPhoneNumber } from 'utils/formatPhoneNumber';

const useStyles = makeStyles((theme) => ({
  lastMessageItem: {
    backgroundColor: '#fff',
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '1px 1px 5px #ccc',
    listStyle: 'none',
    padding: '10px 10px',
    fontSize: '14px'
  },

  content: {
    wordBreak: 'break-all',
    flex: 10,
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    display: '-webkit-box',
    textOverflow: 'ellipsis'
  },
  actions: {
    margin: '0px 3px'
  },
  controlActions: {
    padding: theme.spacing(2),
    minWidth: '150px',
    backgroundColor: '#fff'
  }
}));
function LastMessageItem(props) {
  const classes = useStyles();
  const { message, index, customer, company } = props;

  return (
    <li className={classes.lastMessageItem}>
      <span style={{ flex: 1 }}>{index + 1}</span>
      <StringFormat isPhoneNumber />
      <span style={{ flex: 2 }}>
        {customer ? formatPhoneNumber(customer.phoneNumber) : ''}
      </span>

      <span className={classes.content}>
        {message ? (
          message.attachments > 0 ? (
            <span style={{ color: '#006E9B' }}>
              {' '}
              + Attachment: [ {message.attachments} ]
            </span>
          ) : (
            ''
          )
        ) : (
          ''
        )}
        {message ? message.text : ''}
      </span>
      <span style={{ flex: 2 }}>
        {message
          ? moment(message.creationTime).format('MM/DD/YYYY HH:mm:ss')
          : ''}
      </span>
      <span style={{ flex: 1, textAlign: 'center' }}>
        {company ? company : ''}
      </span>
    </li>
  );
}
LastMessageItem.propTypes = {
  message: PropTypes.object
};

LastMessageItem.defaultProps = {};
export default LastMessageItem;
