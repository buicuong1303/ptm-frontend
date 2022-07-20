/* eslint-disable react/self-closing-comp */
/* eslint-disable no-unused-vars */
import {
  Backdrop,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Typography,
  Select,
  TextField,
  Box
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Page } from 'components';
import React, { useEffect, useRef, useState } from 'react';
import NearMeIcon from '@material-ui/icons/NearMe';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import ReplyIcon from '@material-ui/icons/Reply';
import ChatIcon from '@material-ui/icons/Chat';
import { PieChart, BarChart, TableHead, LastMessageList } from './components';
import {
  getDashBoard,
  getLastContactCustomers,
  getMoreLastContactCustomers
} from './DashBoard.asyncAction';
import { useDispatch, useSelector } from 'react-redux';
import Control from './components/Control';
import { clearDashBoardState } from './DashBoard.slice';
import Header from './components/Header';
import apiStatus from 'utils/apiStatus';
import { useSnackbar } from 'notistack';
import Stack from '@mui/material/Stack';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDateRangePicker from '@mui/lab/DesktopDateRangePicker';
import addWeeks from 'date-fns/addWeeks';
import moment from 'moment';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import AuthGuard from 'components/AuthGuard';
const useStyles = makeStyles((theme) => ({
  wrapperCard: {
    display: 'flex',
    padding: '10px 0px'
  },
  cardItem: {
    display: 'flex',
    flexDirection: 'column',
    height: '140px'
  },
  backdrop: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '100px'
  },
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
  divider: {
    backgroundColor: '#3f51b5',
    border: 'none',
    height: '2px',
    margin: '10px 0px'
  },
  cardFooter: {
    flex: 1,
    backgroundColor: 'red'
  },
  chartItem: {
    height: '350px'
  },
  actionArea: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  icon: {
    padding: '10px'
  },
  cardNumber: {
    fontSize: 30
  }
}));
function getWeeksAfter(date, amount) {
  return date ? addWeeks(date, amount) : undefined;
}
function DashBoard() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const statisticalTables = useSelector(
    (state) => state.dashBoard.statisticalTables
  );
  const messageList = useSelector(
    (state) => state.dashBoard.lastContactCustomers
  );

  const [open, setOpen] = React.useState(false);

  const toggle = () => setOpen(!open);
  const barChart = useSelector((state) => state.dashBoard.barChart);
  const pieChart = useSelector((state) => state.dashBoard.pieChart);
  const pagination = useSelector((state) => state.dashBoard.pagination);
  const [filters, setFilters] = useState({
    type: 'today',
    rangeDate: [null, null]
  });
  const status = useSelector((state) => state.dashBoard.status);
  const backdrop = useSelector((state) => state.dashBoard.backdrop);
  const { enqueueSnackbar } = useSnackbar();
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });
  //* control loading data
  let stopLoading = useRef(false);

  const handleGetLastContactCustomers = () => {
    if (!pagination.hasNext) return;
    dispatch(
      getMoreLastContactCustomers({
        limitItem: pagination.limit,
        currentItems: pagination.currentItems
      })
    );
  };
  const loadMore = () => {
    if (pagination.currentItems > 0) {
      handleGetLastContactCustomers();
    }
    // if (currentItems >  )
    // dispatch(
    //   getLastContactCustomers({
    //     limitItem: 5,
    //     currentItems: messageList.length
    //   })
    // );
  };
  const setStopLoading = (value) => (stopLoading.current = value);

  const handleReload = () => {
    dispatch(
      getDashBoard({
        type: filters.type,
        start: moment(filters.rangeDate[0]).isValid()
          ? filters.rangeDate[0]?.toISOString().slice(0, 10)
          : '',
        end: moment(filters.rangeDate[1]).isValid()
          ? filters.rangeDate[1]?.toISOString().slice(0, 10)
          : ''
      })
    );
    dispatch(
      getLastContactCustomers({
        limitItem: pagination.limit,
        currentItems: 0
      })
    );
  };
  //* Backdrop
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleToggleBackdrop = (backdropActive) => {
    if (backdropActive === apiStatus.PENDING) setOpenBackdrop(true);
    else setOpenBackdrop(false);
  };

  const handleChangeFilters = (e) => {
    setFilters({
      rangeDate: [null, null],
      [e.target.name]: e.target.value
    });
  };
  const handleRangeDateChange = (value) => {
    setFilters({
      // ...filters,
      type: 'range',
      rangeDate: value
    });
  };
  //* handle lazy load customer
  useEffect(() => {
    dispatch(
      getLastContactCustomers({
        limitItem: pagination.limit,
        currentItems: pagination.currentItems
      })
    );
  }, []);
  useEffect(() => {
    dispatch(
      getDashBoard({
        type: filters.type,
        start: moment(filters.rangeDate[0]).isValid()
          ? filters.rangeDate[0]?.toISOString().slice(0, 10)
          : '',
        end: moment(filters.rangeDate[1]).isValid()
          ? filters.rangeDate[1]?.toISOString().slice(0, 10)
          : ''
      })
    );
  }, [filters]);
  useEffect(() => {
    return () => dispatch(clearDashBoardState());
  }, []);
  useEffect(() => {
    if (status === apiStatus.ERROR) {
      // showSnackbar('Something wrong', 'error');
      showSnackbar('Handle dash board error', 'error');
    }
  }, [status]);
  useEffect(() => {
    handleToggleBackdrop(backdrop);
  }, [backdrop]);
  return (
    <AuthGuard requestPermissions={[{ action: 'read', result: '/dashboard' }]}>
      <Page className={classes.root} title="Dashboard">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Header childTitle="Reporting" isParent />
          <NavigateNextIcon />
          <Header
            childTitle="Dashboard"
            urlChild="/dashboard"
            showReload
            handleReload={handleReload}
            disabledReload={status === apiStatus.SUCCESS ? false : true}
          />
        </div>
        <Divider className={classes.divider} />
        <Stack direction="row" spacing={2}>
          <FormControl size="small" style={{ width: 100 }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              variant="outlined"
              size="small"
              value={filters.type}
              name="type"
              onChange={handleChangeFilters}
              style={{
                backgroundColor: '#fff'
              }}
            >
              {filters.rangeDate.some((item) => item) && (
                <MenuItem value={'range'}>Range</MenuItem>
              )}
              <MenuItem value={'today'}>Today</MenuItem>
              <MenuItem value={'lastWeek'}>Last week</MenuItem>
              <MenuItem value={'lastMonth'}>Last month</MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDateRangePicker
              startText="Start"
              value={filters.rangeDate}
              maxDate={new Date()}
              minDate={
                new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
              }
              onChange={handleRangeDateChange}
              renderInput={(startProps, endProps) => (
                <React.Fragment>
                  <TextField
                    style={{
                      backgroundColor: '#fff'
                    }}
                    size="small"
                    variant="outlined"
                    {...startProps}
                  />
                  <Box sx={{ mx: 2 }}> to </Box>
                  <TextField
                    aria-readonly
                    style={{
                      backgroundColor: '#fff'
                    }}
                    size="small"
                    variant="outlined"
                    {...endProps}
                  />
                </React.Fragment>
              )}
            />
          </LocalizationProvider>
        </Stack>

        <Grid container className={classes.wrapperCard}>
          {/* <Grid item xs={12} lg={12} sm={12}>
          </Grid> */}
          <Grid item xs={12} lg={3} sm={6}>
            <Card className={classes.cardItem} style={{ marginRight: 20 }}>
              <CardActionArea className={classes.actionArea}>
                <CardContent className={classes.cardContent}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Outbound
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="h2"
                      className={classes.cardNumber}
                      style={{
                        color: 'rgb(254, 147, 101)'
                      }}
                    >
                      {statisticalTables
                        ? statisticalTables.numberOfOutboundMessages
                        : ''}
                    </Typography>
                  </div>
                </CardContent>
                <span className={classes.icon}>
                  <NearMeIcon />
                </span>
              </CardActionArea>
              <div
                className={classes.cardFooter}
                style={{
                  background: 'linear-gradient(to right, #fe9365, #feb798)'
                }}
              ></div>
            </Card>
          </Grid>
          <Grid item xs={12} lg={3} sm={6}>
            <Card className={classes.cardItem} style={{ marginRight: 20 }}>
              <CardActionArea className={classes.actionArea}>
                <CardContent className={classes.cardContent}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Inbound
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="h2"
                      className={classes.cardNumber}
                      style={{
                        color: 'rgb(10, 194, 130)'
                      }}
                    >
                      {statisticalTables
                        ? statisticalTables.numberOfInboundMessages
                        : ''}
                    </Typography>
                  </div>
                </CardContent>
                <span className={classes.icon}>
                  <ChatBubbleIcon />
                </span>
              </CardActionArea>
              <div
                className={classes.cardFooter}
                style={{
                  background: 'linear-gradient(to right, #0ac282, #0df3a3)'
                }}
              ></div>
            </Card>
          </Grid>
          <Grid item xs={12} lg={3} sm={6}>
            <Card className={classes.cardItem} style={{ marginRight: 20 }}>
              <CardActionArea className={classes.actionArea}>
                <CardContent className={classes.cardContent}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Not reply yet
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="h2"
                      className={classes.cardNumber}
                      style={{
                        color: 'rgb(254, 93, 112)'
                      }}
                    >
                      {statisticalTables
                        ? statisticalTables.numberOfNotReplyYetMessages
                        : ''}
                    </Typography>
                  </div>
                </CardContent>
                <span className={classes.icon}>
                  <ReplyIcon />
                </span>
              </CardActionArea>
              <div
                className={classes.cardFooter}
                style={{
                  background: 'linear-gradient(to right, #fe5d70, #fe909d)'
                }}
              ></div>
            </Card>
          </Grid>
          <Grid item xs={12} lg={3} sm={6}>
            <Card className={classes.cardItem}>
              <CardActionArea className={classes.actionArea}>
                <CardContent className={classes.cardContent}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Not read yet
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="h2"
                      className={classes.cardNumber}
                      style={{
                        color: 'rgb(1, 169, 172)'
                      }}
                    >
                      {statisticalTables
                        ? statisticalTables.numberOfNotReadYetMessages
                        : ''}
                    </Typography>
                  </div>
                </CardContent>
                <span className={classes.icon}>
                  <ChatIcon />
                </span>
              </CardActionArea>
              <div
                className={classes.cardFooter}
                style={{
                  background: 'linear-gradient(to right, #01a9ac, #01dbdf)'
                }}
              ></div>
            </Card>
          </Grid>
        </Grid>
        <Grid container className={classes.wrapperCard}>
          <Grid item xs={12} lg={8} sm={6}>
            <Card style={{ marginRight: 20 }}>
              <CardContent className={classes.chartItem}>
                <BarChart title="Messages In Companies" barChart={barChart} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4} sm={6}>
            <Card>
              <CardContent className={classes.chartItem}>
                <PieChart
                  title="New Clients - Old Clients"
                  pieChart={pieChart}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container className={classes.wrapperCard}>
          <Grid item lg={12}>
            <Card>
              <CardContent>
                <div style={{ display: 'flex', margin: '10px 0px' }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Last contact customers
                  </Typography>
                  <Control
                    current={messageList ? messageList.length : 0}
                    total={pagination.total}
                  />
                </div>
                <div>
                  <TableHead />
                  <LastMessageList
                    messageList={messageList}
                    hasNext={pagination.hasNext}
                    onLoadMore={loadMore}
                  />
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Backdrop className={classes.backdrop} open={openBackdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Page>
    </AuthGuard>
  );
}

export default DashBoard;
