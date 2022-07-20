import {
  Backdrop,
  CircularProgress,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Tooltip,
  Menu
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Header, Page, TableHead } from 'components';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import apiStatus from 'utils/apiStatus';
import SensitiveOverviewList from './scenes/SensitiveOverviewList';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {
  clearStateSensitiveOverview,
  resetPagination
} from './SensitiveOverview.slice';
import Control from './scenes/Control';
import {
  getAllSensitiveOverviews,
  getSensitiveOverviews,
  searchSensitiveOverviews
} from './SensitiveOverview.asyncAction';
import Stack from '@mui/material/Stack';
import GetAppIcon from '@material-ui/icons/GetApp';
import { unwrapResult } from '@reduxjs/toolkit';
import { CsvBuilder } from 'filefy';
import moment from 'moment';
import { formatPhoneNumber } from 'utils/formatPhoneNumber';
import { CompanyContext } from 'contexts/CompanyProvider';
import {
  selectConversation,
  clearJump,
  addConversation,
  setFilters
} from 'scenes/Message/Message.slice';
import {
  jumpToMessageInConversation,
  getNewConversationOfUser,
  getInfoPaginationMessages
} from 'scenes/Message/Message.asyncAction';
import { SocketChatContext } from 'services/socket/SocketChat';
import { useHistory } from 'react-router';
import { PermissionContext } from 'contexts/PermissionProvider';
import AuthGuard from 'components/AuthGuard';

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
  buttonCreate: {
    margin: '10px 0px',
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff'
  },
  title: {},
  tableHead: {
    padding: `0px ${theme.spacing(2)}px`
  }
}));

const columns = [
  {
    name: 'No.',
    flex: 1
  },
  {
    name: 'Company',
    flex: 3
  },
  {
    name: 'Client',
    flex: 3
  },
  {
    name: 'User',
    flex: 3
  },
  {
    name: 'Message',
    flex: 6
  },
  {
    name: 'Reason',
    flex: 3
  },
  {
    name: 'Date',
    flex: 3
  },
  {
    name: 'Action',
    flex: 1,
    textAlign: 'center'
  }
];

function SensitiveOverview() {
  const classes = useStyles();
  const dispatch = useDispatch();

  //*Zoom
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });
  const conversations = useSelector((state) => state.message.conversations);
  const { leaveRoom, joinRoom } = useContext(SocketChatContext);
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );
  const { setCompany, companies } = useContext(CompanyContext);
  const handleClick = async (data) => {
    try {
      const selectCompany = companies.find(
        (company) =>
          company.code ===
          data.message.conversation.companyCustomer.company.code
      );
      setCompany(selectCompany);
      history.push(`/messages/${selectCompany.code}`);
      const toggleButton = document.getElementById('/messages');
      if (toggleButton && toggleButton.getAttribute('data-toggle') === 'false')
        toggleButton.click();
      const indexConversation = conversations[selectCompany.code]
        .map((item) => item.id)
        .indexOf(data.message.conversation.id);
      if (indexConversation < 0) {
        const actionResultPromise = dispatch(
          getNewConversationOfUser({
            conversationId: data.message.conversation.id,
            companyCode: data.message.conversation.companyCustomer.company.code,
            isJumping: true
          })
        );
        const actionResult = await actionResultPromise;

        const result = unwrapResult(actionResult);
        dispatch(addConversation(result));
      }
      const participantId =
        conversations[selectCompany.code][indexConversation]?.participantId;
      //* leave old room
      for (const key in selectedConversation) {
        if (Object.hasOwnProperty.call(selectedConversation, key)) {
          if (key === selectCompany.code) {
            leaveRoom(selectedConversation[selectCompany.code].id);
          }
        }
      }
      // * set conversation
      dispatch(
        selectConversation({
          conversationId: data.message.conversation.id,
          company: selectCompany,
          isJumping: true
        })
      );
      dispatch(
        getInfoPaginationMessages({
          conversationId: data.message.conversation.id,
          company: selectCompany
        })
      );
      dispatch(clearJump());
      dispatch(
        setFilters({
          companyCode: selectCompany.code,
          search: '',
          types: [],
          labels: [],
          users: []
        })
      );
      dispatch(
        jumpToMessageInConversation({
          messageId: data.message.id,
          company: selectCompany,
          conversationId: data.message.conversation.id,
          // highlights: ''
          highlights: {
            attachments: [],
            text: [data.message.text]
          }
        })
      );

      //* join new room
      joinRoom({
        selectedNewConversationId: data.message.conversation.id,
        participantId,
        selectCompany
      });
    } catch (error) {
      showSnackbar('Join room fail', 'error');
    }
  };
  //   const { companies: companiesContext, setCompanies: setCompaniesContext } =
  //     useContext(CompanyContext);

  //*Handle Author
  const { authorizer } = useContext(PermissionContext);
  const [authorPermission, setAuthorPermission] = useState({
    canRead: false,
    canUpdate: false,
    canDelete: false,
    canCreate: false
  });
  const getAuthor = async () => {
    setAuthorPermission({
      ...authorPermission,
      canRead: await authorizer.current.can('read', '/sensitives'),
      canUpdate: await authorizer.current.can('update', '/sensitives'),
      canDelete: await authorizer.current.can('delete', '/sensitives'),
      canCreate: await authorizer.current.can('create', '/sensitives')
    });
  };

  //* listens state from redux
  const sensitiveOverviews = useSelector(
    (state) => state.sensitiveOverview.sensitiveOverviews
  );
  const sensitivesStatus = useSelector(
    (state) => state.sensitiveOverview.status
  );
  const sensitivesMessage = useSelector(
    (state) => state.sensitiveOverview.message
  );
  const backdrop = useSelector((state) => state.sensitiveOverview.backdrop);
  const manage = useSelector((state) => state.sensitiveOverview.manage);

  //* Backdrop
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleToggleBackdrop = (backdrop) => {
    if (backdrop === apiStatus.PENDING && manage._page === 1)
      setOpenBackdrop(true);
    else setOpenBackdrop(false);
  };

  //*lazy load
  const loadMoreData = () => {
    if (searchValue) {
      if (manage._page > 1) {
        dispatch(
          searchSensitiveOverviews({
            _page: manage._page,
            _limit: manage._limit,
            value: searchValue.trim()
          })
        );
      }
    } else {
      if (manage._page > 1) {
        dispatch(
          getSensitiveOverviews({
            _page: manage._page,
            _limit: manage._limit
          })
        );
      }
    }
  };
  //* Search
  // eslint-disable-next-line no-unused-vars
  const [resetPage, setResetPage] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchSensitives = () => {
    if (searchValue !== null) {
      dispatch(resetPagination());
      setResetPage(true);
    }
  };
  useEffect(() => {
    if (resetPage) {
      if (searchValue) {
        console.log('Run 2');
        dispatch(
          searchSensitiveOverviews({
            firstLoad: true,
            _page: manage._page,
            _limit: manage._limit,
            value: searchValue.trim()
          })
        );
      } else {
        console.log('Run 1');
        dispatch(
          getSensitiveOverviews({
            firstLoad: true,
            _page: manage._page,
            _limit: manage._limit
          })
        );
      }
      setResetPage(false);
    }
  }, [resetPage]);

  //* Export
  const handleGetResponses = async () => {
    const res = await dispatch(getAllSensitiveOverviews());
    const data = unwrapResult(res);
    handleExportCsv(data);
  };
  const [exportButtonAnchorEl, setExportButtonAnchorEl] = useState(null);
  const handleClose = () => {
    setExportButtonAnchorEl(null);
  };
  const handleExportCsv = (data) => {
    // console.log(data);
    // const fileName = title || 'data';
    const sensitiveOverviews = data.map((item, index) => ({
      number: index + 1,
      company: item.message.conversation.companyCustomer.company.name,
      clientPhone: formatPhoneNumber(
        item.message.conversation.companyCustomer.customer.phoneNumber
      ),
      user: item.message.lastModifiedUserId
        ? `${item.message.lastModifiedUserId.firstName} ${item.message.lastModifiedUserId.lastName}`
        : 'unknown',
      message: item.message.text,
      reason: item.reason,
      date: moment(item.creationTime).format('YYYY/MM/DD hh:mm:ss'),
      messageDate: moment(item.message.creationTime).format(
        'YYYY/MM/DD hh:mm:ss'
      )
    }));
    const builder = new CsvBuilder('Sensitives Overview' + '.csv');
    builder.setColumns([
      '#',
      'Company',
      'Client Phone',
      'User',
      'Message',
      'Reason',
      'Date',
      'Message Date'
    ]);
    builder
      .addRows(
        sensitiveOverviews.map((item) =>
          Object.keys(item).map((key) => item[key])
        )
      )
      .exportFile();
  };

  useEffect(() => {
    handleToggleBackdrop(backdrop);
    // eslint-disable-next-line
  }, [backdrop]);

  useEffect(() => {
    getAuthor();
    // console.log('Run 3');
    // dispatch(
    //   getSensitiveOverviews({
    //     firstLoad: true,
    //     _page: manage._page,
    //     _limit: manage._limit
    //   })
    // );
    return () => dispatch(clearStateSensitiveOverview());
  }, []);

  //* listen status and show notification
  useEffect(() => {
    if (
      sensitivesStatus === apiStatus.SUCCESS &&
      sensitivesMessage === 'Create sensitive success'
    ) {
      showSnackbar(sensitivesMessage, sensitivesStatus);
    }
    if (sensitivesStatus === apiStatus.ERROR)
      showSnackbar(sensitivesMessage, sensitivesStatus);
    // eslint-disable-next-line
  }, [sensitivesStatus]);

  //* render UI
  return (
    <AuthGuard requestPermissions={[{ action: 'read', result: '/sensitives' }]}>
      <Backdrop className={classes.backdrop} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Page title="Sensitive Message" className={classes.root}>
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          {/* <Header component="div" childTitle="Sensitive Message" /> */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Header childTitle="Compliance" isParent />
            <NavigateNextIcon />
            <Header childTitle="Rules" isParent />
            <NavigateNextIcon />
            <Header
              childTitle="Sensitive Message"
              urlChild="/sensitive-message"
            />
          </div>
          <Divider className={classes.divider} />
          <Stack
            direction="row"
            style={{ display: 'flex', margin: '10px 0px' }}
          >
            <Control
              current={sensitiveOverviews.length}
              placeholder="Search sensitives ..."
              total={manage.pagination._total}
              setSearchValue={setSearchValue}
              searchValue={searchValue}
              searchSensitives={searchSensitives}
            />
            <Tooltip title="">
              <IconButton
                color="inherit"
                id="export"
                aria-controls="export-menu"
                aria-haspopup="true"
                onClick={(event) => {
                  setExportButtonAnchorEl(event.currentTarget);
                }}
                style={{ padding: '7px' }}
              >
                <GetAppIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={exportButtonAnchorEl}
              open={Boolean(exportButtonAnchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleGetResponses}>Export as CSV</MenuItem>
            </Menu>
          </Stack>
          <Paper className={classes.paper} elevation={1} variant="outlined">
            <TableHead className={classes.tableHead} columns={columns} />
            <SensitiveOverviewList
              handleClick={handleClick}
              sensitiveOverviews={sensitiveOverviews}
              onLoadMore={loadMoreData}
              manage={manage}
            />
          </Paper>
        </div>
      </Page>
    </AuthGuard>
  );
}

export default SensitiveOverview;
