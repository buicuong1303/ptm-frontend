/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Avatar, Chip, List, ListItem } from '@material-ui/core';
import React from 'react';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import MessageItem from '../MessageItem';
import { Waypoint } from 'react-waypoint';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSelector } from 'react-redux';
import Loading from 'images/Rolling-1s-200px.gif';
const useStyles = makeStyles((theme) => ({
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
  listItem: {
    alignItems: 'flex-start',
    borderBottom: '1px solid #f2f2f2'
  }
}));
function ListResult({ listResult, onClick, onLoadMore }) {
  const classes = useStyles();
  const isLoadingResult = useSelector((state) => state.search.isLoadingResult);
  return (
    <List
      component="nav"
      aria-label="main mailbox folders"
      style={{ overflowY: 'auto' }}
      id="results"
    >
      {listResult.map((item) => (
        <ListItem
          key={item._source.id}
          button
          className={classes.listItem}
          onClick={() => onClick(item)}
        >
          <MessageItem data={item} />
        </ListItem>
      ))}
      {isLoadingResult !== null &&
        !listResult.length &&
        isLoadingResult !== true && (
        <ListItem
          className={classes.listItem}
          style={{
            textAlign: 'center',
            justifyContent: 'center',
            fontStyle: 'italic'
          }}
        >
            no result
        </ListItem>
      )}
      <Waypoint
        onEnter={() => {
          const ele = document.getElementById('results');
          if (ele.scrollTop === 0) return;
          if (!onLoadMore) return;
          onLoadMore();
        }}
      >
        <div>
          {isLoadingResult && (
            <div style={{ textAlign: 'center' }}>
              <img style={{ width: 50, height: 50 }} src={Loading} />
            </div>
          )}
        </div>
      </Waypoint>
      {/* <ListItem button className={classes.listItem}>
        <Avatar
          className={classes.avatar}
          // component={RouterLink}
        />
        <div className={classes.messageBody}>
          <div className={classes.activity}>
            <author style={{ fontWeight: 'bold' }}>+1(267) 930-4323</author>
            <span>&nbsp; in &nbsp;</span>
            <span className={classes.conversation}>+1(267) 930-4323</span>
            <span>
              &nbsp;
              <CallReceivedIcon
                color="primary"
                fontSize="small"
                style={{ alignContent: 'baseline' }}
              />
            </span>
            <span className={classes.chip}>
              <Chip label="Health" size="small" color="primary" />
            </span>
          </div>
          <div className={classes.messageText}>asfd</div>
          <div
            className={clsx(classes.attachmentItem, classes.image)}
            style={{ maxHeight: 50 }}
          >
            <img
              src={iconFileZip}
              alt={'Grapefruit slice atop a pile of other slices'}
              style={{
                maxWidth: '100%',
                borderRadius: 5,
                maxHeight: 50
                // height: +attachment.height
              }}
            />
            <div>zip.zip</div>
          </div>
          <span className={classes.timestamp}>
            {new Date().toISOString().slice(0, 10) +
              ' ' +
              new Date().toISOString().substr(11, 8)}
          </span>
        </div>
        <MessageItem />
      </ListItem> */}
    </List>
  );
}
ListResult.propTypes = {
  listResult: PropTypes.array,
  onLoadMore: PropTypes.func
};
ListResult.defaultProps = {
  listResult: [],
  searchValue: ''
};
export default ListResult;
