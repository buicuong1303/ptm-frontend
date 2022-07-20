/* eslint-disable no-unused-vars */
import {
  Backdrop,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import { Header, Page } from 'components';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ScheduleList } from './components';
import { TableHead } from 'components';
import ButtonCreate from 'components/ButtonCreate';
import { useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {
  getScheduleMessages,
  stopScheduleMessage,
  pauseScheduleMessage,
  resumeScheduleMessage,
  deleteScheduleMessage,
  getPullingScheduleMessages
} from 'scenes/ScheduleMessage/ScheduleMessage.asyncAction';
import CachedIcon from '@material-ui/icons/Cached';
import {
  clearStateSchedule,
  resetFilters,
  updateScheduleStatus
} from 'scenes/ScheduleMessage/ScheduleMessage.slice';
import apiStatus from 'utils/apiStatus';
import { useSnackbar } from 'notistack';
import { unwrapResult } from '@reduxjs/toolkit';
import { PermissionContext } from 'contexts/PermissionProvider';
import { useInterval } from 'hooks';

const useStyles = makeStyles((theme) => ({
  root: {
    // [theme.breakpoints.down('xl')]: {
    //   width: theme.breakpoints.values.xl
    // },
    // [theme.breakpoints.down('lg')]: {
    //   width: theme.breakpoints.values.lg
    // },

    height: '100%',
    margin: '0 auto',
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      width: '100%'
    }
  },
  divider: {
    backgroundColor: theme.palette.primary.main,
    border: 'none',
    height: '2px',
    margin: '10px 0px'
  },
  buttonCreate: {
    margin: '10px 0px',
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff'
  },
  paper: {
    flex: '1',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  tableHead: {
    padding: '0px 24px'
  },
  backdrop: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}));
const columns = [
  {
    name: 'No.',
    flex: 0.5
  },
  {
    name: 'Name',
    flex: 3
  },
  {
    name: 'Content',
    flex: 2,
    marginLeft: 10
  },
  {
    name: 'Created By',
    flex: 2,
    marginLeft: 10
  },
  {
    name: 'Company',
    flex: 2
  },
  {
    name: 'Date Time',
    flex: 2
  },
  {
    name: 'Can Retry',
    flex: 2,
    textAlign: 'center'
  },
  {
    name: 'Status',
    flex: 2,
    textAlign: 'center'
  },
  {
    name: 'Progress',
    flex: 2,
    textAlign: 'center'
  },
  {
    name: 'Action',
    flex: 3,
    textAlign: 'center'
  }
];
const ScheduleManagement = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { authorizer } = useContext(PermissionContext);
  const schedules = useSelector((state) => state.schedule.schedules);
  const backdrop = useSelector((state) => state.schedule.backdrop);
  const manage = useSelector((state) => state.schedule.manage);
  const status = useSelector((state) => state.schedule.status);
  const message = useSelector((state) => state.schedule.message);
  const { enqueueSnackbar } = useSnackbar();
  const [processingSchedules, setProcessingSchedules] = useState([]);
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });
  const { url } = useRouteMatch();
  const pulling = useRef(null);
  const [authorPermission, setAuthorPermission] = useState({
    canRead: false,
    canUpdate: false,
    canDelete: false,
    canCreate: false
  });

  const getAuthor = async () => {
    setAuthorPermission({
      ...authorPermission,
      canRead: await authorizer.current.can('read', '/schedules'),
      canUpdate: await authorizer.current.can('update', '/schedules'),
      canDelete: await authorizer.current.can('delete', '/schedules'),
      canCreate: await authorizer.current.can('create', '/schedules')
    });
  };
  const handleStop = async (id) => {
    try {
      setProcessingSchedules([...processingSchedules, id]);
      let scheduleUsing;
      schedules.forEach((item) => {
        if (item.id === id) {
          scheduleUsing = item;
        }
        if (item.backup && item.backup.id === id) {
          scheduleUsing = item.backup;
        }
      });
      const actionResult = await dispatch(
        stopScheduleMessage({
          id: id,
          creationUserId: scheduleUsing.creationUserId
        })
      );
      const result = unwrapResult(actionResult);
      setProcessingSchedules([
        ...processingSchedules.filter((scheduleId) => scheduleId != id)
      ]);
      dispatch(updateScheduleStatus({ id, status: 'stopped' }));
      showSnackbar('Stop success', 'success');
    } catch (error) {
      showSnackbar(error.error.message, 'error');
      setProcessingSchedules([
        ...processingSchedules.filter((scheduleId) => scheduleId != id)
      ]);
    }
  };
  const handlePause = async (id) => {
    try {
      setProcessingSchedules([...processingSchedules, id]);
      let scheduleUsing;
      schedules.forEach((item) => {
        if (item.id === id) {
          scheduleUsing = item;
        }
        if (item.backup && item.backup.id === id) {
          scheduleUsing = item.backup;
        }
      });
      const actionResult = await dispatch(
        pauseScheduleMessage({
          id: id,
          creationUserId: scheduleUsing.creationUserId
        })
      );
      const result = unwrapResult(actionResult);
      setProcessingSchedules([
        ...processingSchedules.filter((scheduleId) => scheduleId != id)
      ]);
      dispatch(updateScheduleStatus({ id, status: 'pausing' }));
      showSnackbar('Pause success', 'success');
    } catch (error) {
      showSnackbar(error.error.message, 'error');
      setProcessingSchedules([
        ...processingSchedules.filter((scheduleId) => scheduleId != id)
      ]);
    }
  };
  const handleResume = async (id) => {
    try {
      setProcessingSchedules([...processingSchedules, id]);
      let scheduleUsing;
      schedules.forEach((item) => {
        if (item.id === id) {
          scheduleUsing = item;
        }
        if (item.backup && item.backup.id === id) {
          scheduleUsing = item.backup;
        }
      });
      const actionResult = await dispatch(
        resumeScheduleMessage({
          id: id,
          creationUserId: scheduleUsing.creationUserId
        })
      );
      const result = unwrapResult(actionResult);
      setProcessingSchedules([
        ...processingSchedules.filter((scheduleId) => scheduleId != id)
      ]);
      dispatch(updateScheduleStatus({ id, status: 'sending' }));
      showSnackbar('Resume success', 'success');
    } catch (error) {
      showSnackbar(error.error.message, 'error');
      setProcessingSchedules([
        ...processingSchedules.filter((scheduleId) => scheduleId != id)
      ]);
    }
  };
  const handleDelete = async (id) => {
    try {
      const actionResult = await dispatch(deleteScheduleMessage(id));
      const result = unwrapResult(actionResult);
      showSnackbar('Delete success', 'success');
    } catch (error) {
      showSnackbar(error.error.message, 'error');
    }
  };
  const handleReload = () => {
    dispatch(getPullingScheduleMessages({ recordsNumber: schedules.length }));
  };

  //* Backdrop
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleToggleBackdrop = (backdropActive) => {
    if (backdropActive === apiStatus.PENDING && manage._page === 1)
      setOpenBackdrop(true);
    else setOpenBackdrop(false);
  };
  useEffect(() => {
    handleToggleBackdrop(backdrop);
  }, [backdrop]);

  const loadMoreData = () => {
    if (manage._page > 1) {
      dispatch(
        getScheduleMessages({
          _page: manage._page,
          _limit: manage._limit
        })
      );
    }
  };
  useInterval(handleReload, 30000); //* reload per 30 seconds
  useEffect(() => {
    getAuthor();
    dispatch(resetFilters());
    dispatch(
      getScheduleMessages({
        firstLoad: true,
        _page: 1,
        _limit: manage._limit
      })
    );
    return () => {
      // if (pulling.current) clearInterval(pulling.current);
      dispatch(resetFilters());
    };
  }, []);
  useEffect(() => {
    if (status === apiStatus.SUCCESS) {
      dispatch(clearStateSchedule());
      // pulling.current = setInterval(() => {
      //   console.log(schedules.length);
      //   dispatch(
      //     getPullingScheduleMessages({ recordsNumber: schedules.length })
      //   );
      // }, 10 * 1000);
    } else if (status === apiStatus.ERROR && message !== 'Get schedules failed')
      // showSnackbar('Something wrong', 'error');
      showSnackbar('Handle schedule fail', 'error');
  }, [status]);
  return (
    <Page title="Scheduling" className={classes.root}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Header childTitle="Campaigns" isParent />
          <NavigateNextIcon />
          <Header childTitle="Scheduling" urlChild="/scheduling" />
        </div>
        <Divider className={classes.divider} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {authorPermission.canCreate ? (
            <Link to={`${url}/create`}>
              <ButtonCreate
                className={classes.buttonCreate}
                disabled={false}
                size="small" // 'large' | 'medium' | 'small'
              />
            </Link>
          ) : (
            <ButtonCreate
              className={classes.buttonCreate}
              disabled={!authorPermission.canCreate}
              size="small" // 'large' | 'medium' | 'small'
            />
          )}
          <IconButton color="primary" onClick={handleReload}>
            <CachedIcon />
          </IconButton>
        </div>

        <Paper className={classes.paper} elevation={3} variant="outlined">
          <TableHead className={classes.tableHead} columns={columns} />
          <ScheduleList
            dataSchedule={schedules}
            onStop={handleStop}
            onPause={handlePause}
            onResume={handleResume}
            onDelete={handleDelete}
            canUpdate={authorPermission.canUpdate}
            processingSchedules={processingSchedules}
            onLoadMore={loadMoreData}
            page={manage._page}
          />
        </Paper>
      </div>
      <Backdrop className={classes.backdrop} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Page>
  );
};

export default ScheduleManagement;
