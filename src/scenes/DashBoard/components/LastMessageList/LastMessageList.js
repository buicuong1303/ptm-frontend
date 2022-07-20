/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import LastMessageItem from '../LastMessageItem';
import { Control } from 'scenes/Message/components/ConversationList/components';
import { Waypoint } from 'react-waypoint';

const useStyles = makeStyles((theme) => ({
  lastMessageList: {
    border: '1px solid #ccc',
    overflowY: 'auto',
    maxHeight: '120px'
  }
}));
function LastMessageList(props) {
  const { messageList, hasNext, onLoadMore } = props;
  const classes = useStyles();
  return (
    <>
      <ul className={classes.lastMessageList}>
        {messageList
          ? messageList.map((item, index) => (
            <LastMessageItem
              key={index}
              message={item.message}
              customer={item.customer}
              index={index}
              company={item.company}
            />
          ))
          : ''}
        <Waypoint
          onEnter={() => {
            if (!onLoadMore) return;
            onLoadMore();
          }}
        >
          <div>{hasNext && <p style={{ textAlign: 'center' }}>Loading...</p>}</div>
        </Waypoint>
      </ul>
      {/* {loadingData && (
        <li className={classes.loadingItem}>
          <div
            style={{
              width: '100%',
              height: '30px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
              Loading...
          </div>
        </li>
      )} */}
    </>
  );
}

LastMessageList.propTypes = {
  listLastMessages: PropTypes.array,
  onLoadMore: PropTypes.func
};

LastMessageList.defaultProps = {
  listLastMessages: []
};
export default LastMessageList;
