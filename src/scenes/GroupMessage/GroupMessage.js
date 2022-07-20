/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles,
  Paper,
  Backdrop,
  CircularProgress,
  Divider,
  IconButton,
  colors
} from '@material-ui/core';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Header, Page, TableHead } from 'components';
import { Control, GroupMessageItem } from './components';
import apiStatus from '../../utils/apiStatus';
import { getGroupMessages } from './GroupMessage.asyncAction';
import { unwrapResult } from '@reduxjs/toolkit';
import { formatPhoneNumber } from 'utils/formatPhoneNumber';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import momenttz from 'moment-timezone';
import { Waypoint } from 'react-waypoint';
import Loading from 'images/Rolling-1s-200px.gif';
import CachedIcon from '@material-ui/icons/Cached';
import { useInterval } from 'hooks';
import AuthGuard from 'components/AuthGuard';

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
  backdrop: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  paper: {
    flex: '1',
    display: 'flex',
    minHeight: 0,
    flexDirection: 'column',
    zIndex: 0
  },
  divider: {
    backgroundColor: theme.palette.primary.main,
    border: 'none',
    height: '2px',
    margin: '10px 0px'
  },
  groupMessagesListWrapper: {
    flex: 1,
    display: 'flex',
    overflow: 'auto',
    width: '100%'
  },
  groupMessagesList: {
    display: 'flex',
    flexDirection: 'column',
    height: 'min-content',
    width: '100%'
  },
  groupMessageItem: {
    display: 'flex'
  },
  tableHead: {
    padding: `0px ${theme.spacing(2)}px`
  },
  todayMessage: {
    background: colors.blueGrey[300],
    color: '#ffffff'
  }
}));

const columns = [
  {
    name: 'No.',
    flex: 0.5
  },
  {
    name: 'Company',
    flex: 1.5
  },
  {
    name: 'Client Phone',
    flex: 1.5
  },
  {
    name: 'Other clients',
    flex: 3
  },
  {
    name: 'Content',
    flex: 3.5
  },
  {
    name: 'Time',
    flex: 2
  }
];

const GroupMessage = (props) => {
  const classes = useStyles();
  const { className } = props;

  const dispatch = useDispatch();

  //* show notification
  const { enqueueSnackbar } = useSnackbar();
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  const status = useSelector((state) => state.groupMessage.status);
  const toastMessage = useSelector((state) => state.groupMessage.toastMessage);

  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [more, setMore] = useState(false);
  const [messages, setMessages] = useState([]);
  const [openBackdrop, setOpenBackDrop] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const canSearch = useRef(false);

  const handleChangeSearchQuery = (newSearchQuery) => {
    //* first render trigger change query not trigger
    if (!canSearch.current) {
      canSearch.current = true;
      return;
    }

    resetPagination();
    setSearchQuery(newSearchQuery);
  };

  const resetPagination = () => {
    setMessages([]);
    setCurrent(0);
    setTotal(0);
    setPage(0);
    setMore(false);
  };

  const loadData = async () => {
    const resultAction = await dispatch(
      getGroupMessages({
        page: page + 1,
        pageSize,
        searchQuery,
        current
      })
    );

    const result = unwrapResult(resultAction);

    setMessages([...messages, ...result.list]);
    setCurrent(result.current);
    setTotal(result.total);
    setPage(result.page);
    setMore(result.current < result.total);
  };

  const reloadData = async () => {
    setIsReload(true);

    const resultAction = await dispatch(
      getGroupMessages({
        page: page,
        pageSize,
        searchQuery,
        current,
        isReload: true
      })
    );

    const result = unwrapResult(resultAction);

    setMessages([...result.list]);
    setTotal(result.total);
    setMore(result.current < result.total);
    setIsReload(false);
  };

  useEffect(() => {
    if (status === apiStatus.PENDING && (current === 0 || isReload === true)) {
      setOpenBackDrop(true);
    } else {
      if (status === apiStatus.ERROR) {
        showSnackbar(toastMessage, 'error');
      }
      setOpenBackDrop(false);
    }
  }, [status]);

  useEffect(async () => {
    loadData();
  }, [searchQuery]);

  useEffect(async () => {
    loadData();
  }, []);

  useInterval(reloadData, 30000); //* reload per 30000 seconds

  return (
    <AuthGuard
      requestPermissions={[{ action: 'read', result: '/group-messages' }]}
    >
      <Page title="Group Messages" className={clsx(classes.root, className)}>
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          {/* <Header childTitle="Group messages" urlChild="/group-messages" /> */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Header childTitle="Message" isParent />
            <NavigateNextIcon />
            <Header childTitle="Group messages" urlChild="/group-messages" />
          </div>
          <Divider className={classes.divider} />
          <div style={{ display: 'flex', margin: '10px 0px' }}>
            <Control
              current={current}
              total={total}
              placeholder="Search group message..."
              onSearch={handleChangeSearchQuery}
            />
            <IconButton
              color="primary"
              onClick={reloadData}
              style={{ padding: '7px' }}
            >
              <CachedIcon />
            </IconButton>
          </div>

          <Paper className={classes.paper} elevation={1} variant="outlined">
            <TableHead className={classes.tableHead} columns={columns} />
            <div className={classes.groupMessagesListWrapper}>
              <div className={classes.groupMessagesList}>
                {messages.map((message, index) => {
                  const time = message.exCreationTime ?? message.creationTime;
                  let otherClients = message.nonTargets
                    ?.split('; ')
                    .map((phone) => formatPhoneNumber(phone))
                    .join('; ');

                  const content = `${
                    message.text +
                    (message.text !== '' ? ' <br>' : '') +
                    (message.attachments.length > 0
                      ? `<span style="color:blue;">Attachments [${message.attachments.length}] <span>`
                      : '')
                  }`.replace(/(?:\r\n|\r|\n)/g, '<br>');

                  return (
                    <GroupMessageItem
                      className={clsx(classes.groupMessageItem, {
                        [classes.todayMessage]: momenttz
                          .tz(time, 'America/Los_Angeles')
                          .isSame(momenttz(), 'day')
                      })}
                      key={index}
                      order={`${index + 1}`}
                      company={
                        message.company.name !== ''
                          ? message.company.name
                          : formatPhoneNumber(message.company.phone)
                      }
                      clientPhone={formatPhoneNumber(message.from)}
                      otherClients={otherClients}
                      time={momenttz
                        .tz(time, 'America/Los_Angeles')
                        .format('YYYY-MM-DD HH:mm:ss A')}
                      content={content}
                    />
                  );
                })}

                {more && (
                  <Waypoint onEnter={() => loadData()}>
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
            </div>
          </Paper>
          <Backdrop className={classes.backdrop} open={openBackdrop}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      </Page>
    </AuthGuard>
  );
};

GroupMessage.propTypes = {
  className: PropTypes.string
};

export default GroupMessage;
