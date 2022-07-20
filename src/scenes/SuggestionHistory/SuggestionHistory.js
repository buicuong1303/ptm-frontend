/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Backdrop, CircularProgress, Divider, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { DialogConfirm, Header, Page, TableHead } from 'components';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import apiStatus from 'utils/apiStatus';
import { Update } from '@material-ui/icons';
import { PermissionContext } from 'contexts/PermissionProvider';
// import Control from './scenes/Control';
import ButtonCreate from 'components/ButtonCreate';
import SuggestionHistoryItem from './scenes/SuggestionHistoryItem';
import SuggestionHistoryDetailItem from './scenes/SuggestionHistoryDetailItem';
import { getSuggestionsHistory, getSuggestionsHistoryDetail } from './SuggestionHistory.asyncAction';
import Control from './scenes/Control';
import { useLocation } from 'react-router';
import { clearStateSuggestionDetail, clearStateSuggestionHistory, setStateRedirect } from './SuggestionHistory.slice';
import { CompanyContext } from 'contexts/CompanyProvider';
import { SocketChatContext } from 'services/socket/SocketChat';
import { useHistory } from 'react-router';
import { unwrapResult } from '@reduxjs/toolkit';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {
  getInfoPaginationMessages,
  getNewConversationOfUser,
  jumpToMessageInConversation
} from 'scenes/Message/Message.asyncAction';
import {
  addConversation,
  clearJump,
  selectConversation,
  setFilters
} from 'scenes/Message/Message.slice';
import AuthGuard from 'components/AuthGuard';
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
    height: '100%'
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
  },
  leftTable: {
    height: '100%'
  },
  container: {
    height: '87%'
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
    flex: 2
  },
  {
    name: 'Opt Status',
    flex: 1,
    textAlign: 'center',
  }
];
const columnsDetail = [
  {
    name: 'No.',
    flex: 0.5
  },
  {
    name: 'Option',
    flex: 1,
    textAlign: 'center',
  },
  {
    name: 'Status',
    flex: 1,
    textAlign: 'center',
  },
  {
    name: 'Creation Time',
    flex: 3
  },
  {
    name: 'Confirm By',
    flex: 2
  },
  {
    name: 'Reason',
    flex: 3
  },
  {
    name: 'Action',
    flex: 1,
    textAlign: 'center'
  }
];

function SuggestionHistory(props) {
  const { setOpenHistory, ...rest} = props;
  const customerPhone = new URLSearchParams(useLocation().search).get('customerPhone');
  
  const classes = useStyles();
  const dispatch = useDispatch();
  const valuePage = false;

  const suggestionsHistory = useSelector((state) => state.suggestionHistory.suggestionsHistory);
  const suggestionsHistoryDetail = useSelector((state) => state.suggestionHistory.suggestionsHistoryDetail);
  const searchValues = useSelector((state) => state.suggestionHistory.searchValues);
  const totalSuggestions = useSelector((state) => state.suggestionHistory.totalSuggestions);
  const backdrop = useSelector((state) => state.suggestionHistory.backdrop);

  //*Hight light item
  const [itemSelected, setItemSelected] = useState(''); 

  //* control loading data
  const [loadingData, setLoadingData] = useState(false);
  let stopLoading = useRef(false);
  const setStopLoading = (value) => (stopLoading.current = value);

  //*Handle zoom
  const history = useHistory();
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
        (company) => company.code === data.companyCode
      );
      setCompany(selectCompany);
      history.push(`/messages/${selectCompany.code}`);
      const toggleButton = document.getElementById('/messages');
      if (toggleButton && toggleButton.getAttribute('data-toggle') === 'false')
        toggleButton.click();
      const indexConversation = conversations[selectCompany.code]
        .map((item) => item.id)
        .indexOf(data.conversationId);
      if (indexConversation < 0) {
        const actionResultPromise = dispatch(
          getNewConversationOfUser({
            conversationId: data.conversationId,
            companyCode: data.companyCode,
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
          conversationId: data.conversationId,
          company: selectCompany,
          isJumping: true
        })
      );
      dispatch(
        getInfoPaginationMessages({
          conversationId: data.conversationId,
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
          messageId: data.messageId,
          company: selectCompany,
          conversationId: data.conversationId,
          highlights: {
            attachments: [],
            text: [data.messageText]
          }
        //   highlights: data.highlights
        })
      );

      //* join new room
      joinRoom({
        selectedNewConversationId: data.conversationId,
        participantId,
        selectCompany
      });
    } catch (error) {
      showSnackbar('Join room fail', 'error');
    }
  };

  //* handle lazy load customer
  const [limit, setLimit] = useState(25);

  const loadMore = async (limit) => {
    if (stopLoading.current) return; //* stop loading again when all data has been loaded

    let suggestionList = document.querySelector('#suggestionHistoryList');
    let suggestionItem = document.querySelector('#suggestionHistoryList li');
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
      if (action.payload.suggestionsHistory.length > 0) {
        if (suggestionList && suggestionItem && numberSuggestionItems >= 0)
          if (
            suggestionList.clientHeight >=
              suggestionItem.clientHeight *
                (numberSuggestionItems + action.payload.suggestionsHistory.length)
          )
            loadMore(limit);
      } else setStopLoading(true);
    }
  };

  let loadMoreTimeout = useRef('');
  window.onresize = function onresize() {
    let optSuggestionList = document.querySelector('#suggestionHistoryList');
    let optSuggestionItem = document.querySelector('#suggestionHistoryList li');
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
    let optSuggestionList = document.querySelector('#suggestionHistoryList');
    if (optSuggestionList)
      if (
        Math.ceil(optSuggestionList.scrollTop) + optSuggestionList.clientHeight >=
          optSuggestionList.scrollHeight
      ) {
        clearTimeout(loadMoreTimeout.current);
        loadMoreTimeout.current = setTimeout(() => {
          loadMore(limit);
        }, 0);
      }
  }
  //* Backdrop
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleToggleBackdrop = (backdrop) => {
    if (backdrop === apiStatus.PENDING && totalSuggestions === 0) setOpenBackdrop(true);
    else setOpenBackdrop(false); 
  };

  //* Show detail suggestion
  const showDetailSuggestion = (item) => {
    setItemSelected(item.id);
    dispatch(getSuggestionsHistoryDetail({
      customerId: item.customer.id,
      campaignId: item.campaign.id,
    }));
  };

  //* handle get list customer
  const getSuggestionDispatch = async (
    limitItem,
    currentItem,
    searchValue = ''
  ) =>{
    return await dispatch(
      getSuggestionsHistory({ limitItem, currentItem, searchValue: searchValue.trim() })
    );
  };

  //*UseEffect
  useEffect(() => {
    handleToggleBackdrop(backdrop);
    // eslint-disable-next-line
  }, [backdrop]);

  useEffect(() => {
    getSuggestionDispatch(limit, 0, searchValues);
  }, [limit, searchValues]);

  useEffect(() => {
    if(customerPhone){
      dispatch(setStateRedirect(customerPhone));
    }
    // dispatch(getSuggestionsHistory());
    return(() => {
      dispatch(clearStateSuggestionHistory());
    });
  },[]);

  return (
    <AuthGuard requestPermissions={[{ action: 'read', result: '/suggestions' }]}>
      <Page title="History" className={classes.root}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Header childTitle="Campaign" isParent />
          <NavigateNextIcon />
          <Header childTitle="Opt Suggestion" isParent/>
          <NavigateNextIcon />
          <Header childTitle="History" urlChild="/opt-history" />
        </div>
        <Divider className={classes.divider} />
        <div style={{ display: 'flex', margin: '10px 0px', paddingRight: '24px', width: '50%' }}>
          <Control
            current={suggestionsHistory.length}
            limit={limit}
            placeholder="Search suggestion ..."
            setLimit={setLimit}
            setStopLoading={setStopLoading}
            total={totalSuggestions}
          />
        </div>
        <Grid className={classes.container} container spacing={3}>
          <Grid className={classes.leftTable} item xs={12} sm={6}>
            <Paper
              className={classes.customersTable}
              elevation={1}
              variant="outlined"
            >
              <TableHead columns={columns} className={classes.tableHead} />
              <ul className={classes.list} id="suggestionHistoryList" onScroll={handleScroll}>
                {suggestionsHistory.map((suggestionHistory, index) => (
                  <SuggestionHistoryItem
                    suggestionHistory={suggestionHistory}
                    showDetailSuggestion = {showDetailSuggestion}
                    key={index}
                    setItemSelected={setItemSelected}
                    itemSelected={itemSelected}
                    no={index + 1}
                  />
                ))}
              </ul>
              {loadingData && (
                <li className={classes.loadingItem}>
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
          </Grid>
          <Grid className={classes.leftTable} item xs={12} sm={6}>
            <Paper
              className={classes.customersTable}
              elevation={1}
              variant="outlined"
            >
              <TableHead columns={columnsDetail} className={classes.tableHead} />
              <ul className={classes.list} id="suggestionHistoryList">
                {suggestionsHistoryDetail.map((suggestionHistoryDetail, index) => (
                  <SuggestionHistoryDetailItem
                    handleClick={handleClick}
                    suggestionHistoryDetail={suggestionHistoryDetail}
                    key={index}
                    no={index + 1}
                  />
                ))}
              </ul>
            </Paper>
          </Grid>
        </Grid>
        <Backdrop className={classes.backdrop} open={openBackdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Page>
    </AuthGuard>
  );
}

export default SuggestionHistory;
