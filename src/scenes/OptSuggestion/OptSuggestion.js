import { Backdrop, CircularProgress, Divider, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { DialogConfirm, Header, Page, TableHead } from 'components';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import apiStatus from 'utils/apiStatus';
import Control from './scenes/Control';
import OptSuggestionItem from './scenes/OptSuggestionItem';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {
  getCampaigns,
  getOptSuggestions,
  updateOptSuggestion,
  updateReasonOptSuggestion
} from './OptSuggestion.asyncAction';
import { clearStateSuggestion } from './OptSuggestion.slice';
import { useHistory } from 'react-router';
import { CompanyContext } from 'contexts/CompanyProvider';
import {
  getInfoPaginationMessages,
  getNewConversationOfUser,
  jumpToMessageInConversation
} from 'scenes/Message/Message.asyncAction';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  addConversation,
  clearJump,
  selectConversation,
  setFilters
} from 'scenes/Message/Message.slice';
import { SocketChatContext } from 'services/socket/SocketChat';
import AuthGuard from 'components/AuthGuard';
import { PermissionContext } from 'contexts/PermissionProvider';
import Loading from 'images/Rolling-1s-200px.gif';

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
  customersTable: {
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
    backgroundColor: theme.palette.primary.main
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
    overflow: 'auto',
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
    backgroundColor: '#F5F5F5'
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
    flex: 0.5
  },
  {
    name: 'Campaign',
    flex: 2
  },
  {
    name: 'Client',
    flex: 1
  },
  {
    name: 'Opt Status',
    textAlign: 'center',
    flex: 1
  },
  {
    name: 'Suggestion Status',
    textAlign: 'center',
    flex: 1.5
  },
  {
    name: 'Reason',
    flex: 3
  },
  {
    name: 'Confirm By',
    flex: 1.5
  },
  {
    name: 'Creation Time',
    flex: 1.5
  },
  {
    name: 'Action',
    flex: 2,
    textAlign: 'center'
  }
];

function OptSuggestion() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  // const valuePage = true;

  const optSuggestions = useSelector(
    (state) => state.optSuggestion.optSuggestions
  );
  const searchValues = useSelector((state) => state.optSuggestion.searchValues);
  const totalSuggestions = useSelector(
    (state) => state.optSuggestion.totalSuggestions
  );
  const campaignList = useSelector((state) => state.optSuggestion.campaignList);
  const status = useSelector((state) => state.optSuggestion.status);
  const message = useSelector((state) => state.optSuggestion.message);
  const backdrop = useSelector((state) => state.optSuggestion.backdrop);
  const error = useSelector((state) => state.optSuggestion.error);

  //Submit Reason
  const handleSubmitReason = (data) => {
    dispatch(updateReasonOptSuggestion(data));
  };

  //Zoom
  const { setCompany, companies } = useContext(CompanyContext);
  const conversations = useSelector((state) => state.message.conversations);
  const { leaveRoom, joinRoom } = useContext(SocketChatContext);
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );
  const { enqueueSnackbar } = useSnackbar();
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });
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

  //* update Opt Suggestion
  const [dataUpdate, setDataUpdate] = useState(null);
  const updateOptSuggestionStatus = (data) => {
    setDataUpdate(data);
    setDialogConfirm(true);
  };

  //* control loading data
  const [loadingData, setLoadingData] = useState(false);
  let stopLoading = useRef(false);
  const setStopLoading = (value) => (stopLoading.current = value);
  //* handle lazy load customer
  const [limit, setLimit] = useState(20);
  //* confirm dialog
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const handleConfirmDialog = () => {
    dispatch(updateOptSuggestion(dataUpdate));
    setDialogConfirm(false);
  };
  const handleCloseDialog = () => setDialogConfirm(false);

  const loadMore = async (limit) => {
    if (stopLoading.current) return; //* stop loading again when all data has been loaded

    let suggestionList = document.querySelector('#optSuggestionList');
    let suggestionItem = document.querySelector('#optSuggestionList li');
    let numberSuggestionItems = suggestionList
      ? suggestionList.childElementCount
      : 0;

    setLoadingData(true);
    const action = await getSuggestionDispatch(
      limit,
      numberSuggestionItems,
      searchValues
    );
    setLoadingData(false);
    if (action.payload) {
      if (action.payload.optSuggestions.length > 0) {
        if (suggestionList && suggestionItem && numberSuggestionItems >= 0)
          if (
            suggestionList.clientHeight >=
            suggestionItem.clientHeight *
              (numberSuggestionItems + action.payload.optSuggestions.length)
          )
            loadMore(limit);
      } else setStopLoading(true);
    }
  };

  let loadMoreTimeout = useRef('');
  window.onresize = function onresize() {
    let optSuggestionList = document.querySelector('#optSuggestionList');
    let optSuggestionItem = document.querySelector('#optSuggestionList li');
    let numberSuggestionItems = optSuggestionList
      ? optSuggestionList.childElementCount
      : 0;

    if (optSuggestionList && optSuggestionItem && numberSuggestionItems >= 0)
      if (
        optSuggestionList.clientHeight >=
        optSuggestionItem.clientHeight * numberSuggestionItems
      ) {
        clearTimeout(loadMoreTimeout.current);
        loadMoreTimeout.current = setTimeout(() => {
          loadMore(limit);
        }, 750);
      }
  };

  function handleScroll() {
    let optSuggestionList = document.querySelector('#optSuggestionList');
    if (optSuggestionList)
      if (
        Math.ceil(optSuggestionList.scrollTop) +
          optSuggestionList.clientHeight >=
        optSuggestionList.scrollHeight
      ) {
        clearTimeout(loadMoreTimeout.current);
        loadMoreTimeout.current = setTimeout(() => {
          loadMore(limit);
        }, 0);
      }
  }

  //*Update Campaign
  const handleUpdateCampaign = (data) => {
    dispatch(updateOptSuggestion(data));
    // setDataUpdate(data);
    // setDialogConfirm(true);
  };
  //* handle get list customer
  const getSuggestionDispatch = async (
    limitItem,
    currentItem,
    searchValue = ''
  ) => {
    await dispatch(getCampaigns());
    return await dispatch(
      getOptSuggestions({
        limitItem,
        currentItem,
        searchValue: searchValue.trim()
      })
    );
  };

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
      canRead: await authorizer.current.can('read', '/suggestions'),
      canUpdate: await authorizer.current.can('update', '/suggestions'),
      canDelete: await authorizer.current.can('delete', '/suggestions'),
      canCreate: await authorizer.current.can('create', '/suggestions')
    });
  };

  //* Backdrop
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleToggleBackdrop = (backdrop) => {
    if (backdrop === apiStatus.PENDING && totalSuggestions === null)
      setOpenBackdrop(true);
    else setOpenBackdrop(false);
  };

  useEffect(() => {
    handleToggleBackdrop(backdrop);
    // eslint-disable-next-line
  }, [backdrop]);

  useEffect(() => {
    getSuggestionDispatch(limit, 0, searchValues);
  }, [limit, searchValues]);

  useEffect(() => {
    if (
      status == apiStatus.SUCCESS &&
      message &&
      message != 'Get Opt Suggestion success' &&
      message != 'get Campaign success'
    ) {
      showSnackbar(message, 'success');
    } else if (status == apiStatus.ERROR && error) {
      // setOpen(false);
      showSnackbar(error, 'error');
    }
  }, [status]);

  useEffect(() => {
    getAuthor();
    return () => {
      dispatch(clearStateSuggestion());
    };
    // eslint-disable-next-line
  }, []);

  return (
    <AuthGuard
      requestPermissions={[
        { action: 'read', result: '/suggestions' },
        { action: 'read', result: '/campaigns' }
      ]}
    >
      <Page title="Suggestions" className={classes.root}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Header childTitle="Campaign" isParent />
          <NavigateNextIcon />
          <Header childTitle="Opt Suggestion" isParent />
          <NavigateNextIcon />
          <Header childTitle="Suggestions" urlChild="/opt-suggestions" />
        </div>
        <Divider className={classes.divider} />
        <div style={{ display: 'flex', margin: '10px 0px' }}>
          <Control
            current={optSuggestions.length}
            limit={limit}
            placeholder="Search suggestion ..."
            setLimit={setLimit}
            setStopLoading={setStopLoading}
            total={totalSuggestions}
          />
        </div>
        <Paper
          className={classes.customersTable}
          elevation={1}
          variant="outlined"
        >
          <TableHead columns={columns} className={classes.tableHead} />
          <ul
            className={classes.list}
            id="optSuggestionList"
            onScroll={handleScroll}
          >
            {optSuggestions.map((optSuggestion, index) => (
              <OptSuggestionItem
                optSuggestion={optSuggestion}
                authorPermission={authorPermission}
                key={index}
                no={index + 1}
                handleUpdateCampaign={handleUpdateCampaign}
                handleSubmitReason={handleSubmitReason}
                handleClick={handleClick}
                campaignList={campaignList}
                updateOptSuggestionStatus={updateOptSuggestionStatus}
                setDialogConfirm={setDialogConfirm}
              />
            ))}
          </ul>
          {loadingData && (
            <li className={classes.loadingItem}>
              {/* <div
                style={{
                  width: '100%',
                  height: '30px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                Loading...
              </div> */}
              <div
                style={{
                  textAlign: 'center',
                  width: '100%',
                  height: '30px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <img src={Loading} style={{ width: 50, height: 50 }} />
              </div>
            </li>
          )}
        </Paper>
      </Page>
      <DialogConfirm
        handleClose={handleCloseDialog}
        handleConfirm={handleConfirmDialog}
        message={`Update suggestion ${
          dataUpdate
            ? dataUpdate.confirm === null
              ? 'campaign'
              : 'status'
            : 'status'
        }`}
        open={dialogConfirm}
      />
      <Backdrop className={classes.backdrop} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </AuthGuard>
  );
}

export default OptSuggestion;
