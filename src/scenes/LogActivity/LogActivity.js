/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Header, Page } from 'components';
import { Backdrop, CircularProgress, Divider, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import apiStatus from 'utils/apiStatus';
import { getLogActivities } from './LogActivity.asyncAction';
import { LogActivityItem, Control } from './components';
import { clearStateLogActivities } from './LogActivity.slice';
import TableHead from './components/TableHead';
import DataDetails from './components/DataDetails';
import { getAllUser } from 'scenes/User/User.asyncActions';
import AuthGuard from 'components/AuthGuard';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flex: '100%',
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`
  },
  title: {},
  backdrop: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  logActivitiesTable: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    height: '0'
  },
  control: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(1)
  },
  currentItem: {
    width: '70px'
  },
  buttonCreate: {
    backgroundColor: theme.palette.primary.main,
    marginRight: 10
    // color: '#ffffff',
    // '&:hover': {
    //   backgroundColor: '#ffffff',
    //   color: theme.palette.primary.main,
    //   border: `solid ${theme.palette.primary.main} 2px`,
    // }
  },
  search: {
    position: 'relative',
    flex: 5,
    display: 'flex',
    flexDirection: 'row-reverse'
  },
  groupSearch: {
    position: 'relative',
    maxWidth: '500px'
  },
  searchIcon: {
    position: 'absolute',
    left: '0px',
    top: '0px'
  },
  searchInput: {
    position: 'relative',
    width: '100%',
    border: 'unset !important'
  },
  searchClear: {
    position: 'absolute',
    right: '0px',
    top: '0px'
  },
  header: {
    display: 'flex',
    width: '100%',
    backgroundColor: '#c1c1c1',
    padding: theme.spacing(1)
  },
  headerItem: {
    textAlign: 'left',
    paddingLeft: theme.spacing(1),
    margin: 'auto'
  },
  list: {
    height: '100%',
    overflowY: 'scroll',
    margin: '0px',
    position: 'relative'
  },
  loadingItem: {
    position: 'absolute',
    bottom: '0px',
    width: '100%',
    borderBottom: '1px solid #d2d2d2',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    color: '#ffffff',
    backgroundColor: '#c1c1c1'
  },
  icon: {
    marginRight: '5px'
  },
  divider: {
    backgroundColor: '#3f51b5',
    border: 'none',
    height: '2px',
    margin: '10px 0px'
  },
  tableHead: {
    padding: `0px ${theme.spacing(2)}px`
  }
}));

const columns = [
  {
    name: 'No.',
    field: 'no',
    cellStyles: { flex: 1 }
  },
  {
    name: 'IP',
    field: 'ip',
    cellStyles: { flex: 2 }
  },
  {
    name: 'Date Time',
    field: 'creationTime',
    cellStyles: { flex: 3 }
  },
  // {
  //   name: 'User (username)',
  //   field: 'user',
  //   cellStyles: { flex: 3 }
  // },
  {
    name: 'Log Action',
    field: 'logAction',
    cellStyles: { flex: 3 }
  },
  {
    name: 'Message',
    field: 'message',
    cellStyles: {
      flex: 7,
      with: '100%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  },
  {
    name: 'Data',
    field: 'data',
    cellStyles: { flex: 1, display: 'flex', justifyContent: 'center' }
  }
];

const LogActivity = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  //* listen state
  const status = useSelector((state) => state.logActivity.status);
  const message = useSelector((state) => state.logActivity.message);
  const backdrop = useSelector((state) => state.logActivity.backdrop);
  const logActivities = useSelector((state) => state.logActivity.logActivities);
  const totalLogActivities = useSelector(
    (state) => state.logActivity.totalLogActivities
  );
  const users = useSelector((state) => state.users.listUser) || [];

  const [loadingData, setLoadingData] = useState(false);

  //* control loading data
  let stopLoading = useRef(false);
  const setStopLoading = (value) => (stopLoading.current = value);

  //* init form value
  const initialState = {
    userId: '',
    logAction: '',
    from: new Date(),
    to: new Date(),
    limit: 20,
    currentItem: 0
  };
  const [formState, setFormState] = useState(initialState);
  const handleReset = () => {
    setFormState(initialState);
    setStopLoading(false);
    getLogActivitiesDispatch(initialState);
  };
  const handleSubmit = () => {
    getLogActivitiesDispatch(formState);
    setStopLoading(false);
  };

  //* handle lazy load logActivity
  const loadMore = async (limit) => {
    if (stopLoading.current) return; //* stop loading again when all data has been loaded

    let logActivitiesList = document.querySelector('#logActivitiesList');
    let logActivityItem = document.querySelector('#logActivitiesList li');
    let numberLogActivityItems = logActivitiesList
      ? logActivitiesList.childElementCount
      : 0;

    setLoadingData(true);

    const action = await getLogActivitiesDispatch({
      ...formState,
      limit: limit,
      currentItem: numberLogActivityItems
    });

    setLoadingData(false);

    if (action.payload) {
      if (action.payload.records.length > 0) {
        if (logActivitiesList && logActivityItem && numberLogActivityItems >= 0)
          if (
            logActivitiesList.clientHeight >=
            logActivityItem.clientHeight *
              (numberLogActivityItems + action.payload.records.length)
          )
            loadMore(limit);
      } else setStopLoading(true);
    }
  };

  let loadMoreTimeout = useRef('');
  window.onresize = function onresize() {
    let logActivitiesList = document.querySelector('#logActivitiesList');
    let logActivityItem = document.querySelector('#logActivitiesList li');
    let numberLogActivityItems = logActivitiesList
      ? logActivitiesList.childElementCount
      : 0;

    if (logActivitiesList && logActivityItem && numberLogActivityItems >= 0)
      if (
        logActivitiesList.clientHeight >=
        logActivityItem.clientHeight * numberLogActivityItems
      ) {
        clearTimeout(loadMoreTimeout.current);
        loadMoreTimeout.current = setTimeout(() => {
          loadMore(formState?.limit);
        }, 750);
      }
  };

  function handleScroll() {
    let logActivitiesList = document.querySelector('#logActivitiesList');
    if (logActivitiesList)
      if (
        Math.ceil(logActivitiesList.scrollTop) +
          logActivitiesList.clientHeight >=
        logActivitiesList.scrollHeight
      ) {
        clearTimeout(loadMoreTimeout.current);
        loadMoreTimeout.current = setTimeout(() => {
          loadMore(formState?.limit);
        }, 0);
      }
  }

  //* show notification
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  const [dataDetails, setDataDetails] = useState({});
  const [openDataDetails, setOpenDataDetails] = useState(false);
  const handleOpenDataDetails = () => setOpenDataDetails(true);
  const handleCloseDataDetails = () => setOpenDataDetails(false);
  const showDataDetails = (data) => {
    setDataDetails(data);
    handleOpenDataDetails();
  };

  //* Backdrop
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleToggleBackdrop = (backdrop) => {
    if (backdrop === apiStatus.PENDING && !loadingData) setOpenBackdrop(true);
    else setOpenBackdrop(false);
  };

  //* -------------- START HANDLE ACTION --------------

  //* handle get list logActivity
  const getLogActivitiesDispatch = async (filters) =>
    dispatch(getLogActivities(filters));
  //* --------------  END HANDLE ACTION  --------------

  //* ---------------  START USEEFFECT  ---------------
  useEffect(() => {
    handleToggleBackdrop(backdrop);
  }, [backdrop]);

  useEffect(() => {
    if (status === apiStatus.ERROR) showSnackbar(message, status);
  }, [status, message]);

  useEffect(() => {
    getLogActivitiesDispatch(formState);
    dispatch(getAllUser());

    return () => {
      window.onresize = null; //* clear onresize function
      dispatch(clearStateLogActivities()); //* clear state when unmount
    };
  }, []);
  //* ----------------  END USEEFFECT  ----------------

  //* render UI
  return (
    <AuthGuard
      requestPermissions={[{ action: 'read', result: '/log-activities' }]}
    >
      <Page className={classes.root} title="History">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Header childTitle="Compliance" isParent />
          <NavigateNextIcon />
          <Header childTitle="History" urlChild="/compliance-history" />
        </div>

        <Divider className={classes.divider} />

        <div style={{ display: 'flex', margin: '10px 0px', height: '40px' }}>
          <Control
            current={logActivities.length}
            total={totalLogActivities}
            formState={formState}
            setFormState={setFormState}
            handleReset={handleReset}
            handleSubmit={handleSubmit}
            users={users}
          />
        </div>

        <Paper
          className={classes.logActivitiesTable}
          elevation={1}
          variant="outlined"
        >
          <TableHead columns={columns} className={classes.tableHead} />
          <ul
            className={classes.list}
            id="logActivitiesList"
            onScroll={handleScroll}
          >
            {logActivities.map((logActivity, index) => {
              return (
                <div key={logActivity?.id || index}>
                  <LogActivityItem
                    columns={columns}
                    logActivity={logActivity}
                    no={index + 1}
                    showDataDetails={showDataDetails}
                  />
                </div>
              );
            })}
          </ul>
          {loadingData && (
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
          )}
        </Paper>

        <DataDetails
          open={openDataDetails}
          onClose={handleCloseDataDetails}
          data={dataDetails}
        />

        <Backdrop className={classes.backdrop} open={openBackdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Page>
    </AuthGuard>
  );
};

export default LogActivity;
