/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { Paper } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import {
  ConversationList,
  ConversationPlaceholder,
  ConversationDetail
} from './components';
import { Page } from 'components';
import {
  getConversationsOfUser,
  loadMoreMessagesInConversation,
  loadPreviousMessages,
  loadNextMessages,
  getListSignatureActive,
  updateUmnConversation,
  updateUmnConversations,
  getCallLogRecords,
  editInfoClient,
  editConversation,
  assignLabels,
  editConversations
} from 'scenes/Message/Message.asyncAction';
import { createSelector } from 'reselect';
import { CompanyContext } from 'contexts/CompanyProvider';
import {
  selectConversation,
  setFirstLoadingAfterFilter,
  setHasNext,
  setIsEmptyPage,
  updateConversation,
  clearFilters
} from './Message.slice';
import limit from 'constants/limit';
import Error404 from 'components/Error404';
import apiStatus from 'utils/apiStatus';
import { useSnackbar } from 'notistack';
import CallLogsDialog from './components/ConversationList/components/CallLogsDialog';
import ConversationActivitiesDialog from './components/ConversationList/components/ConversationActivitiesDialog';
import { unwrapResult } from '@reduxjs/toolkit';
import { SocketNotificationContext } from 'services/socket/SocketNotification';
import emitUpdateConversationTypes from '../../constants/emitUpdateConversationTypes';
import { PermissionContext } from 'contexts/PermissionProvider';
import MakeOptSuggestion from './components/MakeOptSuggestion';
import { createOptSuggestion } from 'scenes/OptSuggestion/OptSuggestion.asyncAction';
import { createSensitiveWord } from 'scenes/SensitiveOverview/SensitiveOverview.asyncAction';
import { getLogActivities } from 'scenes/LogActivity/LogActivity.asyncAction';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    padding: theme.spacing(2)
  },
  messages: {
    height: '100%',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    '@media (max-width: 1023px)': {
      //* <= 863, allow conversationDetails hiden in right tab
      '& $conversationList, & $conversationDetails': {
        flexBasis: '100%',
        flexShrink: '0',
        transform: 'translateX(0)'
      }
    }
  },
  openConversion: {
    //* <= 863, if pick conversation, move conversationDetails to left tab, show conversationDetails and hiden conversationList
    '@media (max-width: 1023px)': {
      '& $conversationList, & $conversationDetails': {
        transform: 'translateX(-100%)'
      }
    }
  },
  conversationList: {
    flexShrink: 0,
    flexGrow: 0,
    width: '400px',
    flexBasis: '400px', //* not work like expect because inside content over 400px
    '@media (min-width: 1023px)': {
      //* >= 864
      borderRight: `1px solid ${theme.palette.divider}`
    }
  },
  conversationDetails: {
    flexGrow: 1
  },
  conversationPlaceholder: {
    flexGrow: 1
  }
}));

//TODO: need move to component
const isFiltering = (filters) => {
  let test = false;
  if (
    filters.types.length > 0 ||
    filters.labels.length > 0 ||
    filters.search ||
    filters.users.length > 0
  )
    test = true;
  return test;
};

//* memoizing selector
const selectConversations = createSelector(
  (state) => state.message.conversations,
  (_, company) => company,
  (conversations, company) => {
    if (company && conversations[company.code]) {
      return conversations[company.code];
    } else {
      return [];
    }
  }
);

const selectSelectedConversation = createSelector(
  (state) => state.message.selectedConversation,
  (_, company) => company,
  (selectedConversation, company) => {
    if (selectedConversation[company.code]) {
      return selectedConversation[company.code];
    } else {
      return {};
    }
  }
);

const selectHasPreviousMessage = createSelector(
  (state) => state.message.currentMessages,
  (_, company) => company,
  (currentMessages, company) => {
    if (currentMessages[company.code]) {
      return currentMessages[company.code].manager.hasPrevious;
    } else {
      return false;
    }
  }
);

function Message() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isMountRef = useRef(true);
  const loadConversationRef = useRef(null);
  const { authorizer } = useContext(PermissionContext);
  //* subscribe dynamic data with company.code
  const { company } = useContext(CompanyContext);
  const { enqueueSnackbar } = useSnackbar();
  const [checkedConversations, setCheckedConversations] = useState([]);
  const [openMakeOptSuggestion, setOpenMakeOptSuggestionOrSensitiveWord] =
    useState(false);
  const [
    messageMakingOptSuggestion,
    setMessageMakingOptSuggestionOrSensitiveWord
  ] = useState(null);
  if (!company.code) return <Error404 />;

  const page = useSelector(
    (state) => state.message.conversations.manager[company.code].page
  );
  const hasNextConversation = useSelector(
    (state) => state.message.conversations.manager[company.code].hasNext
  );
  const callLogs = useSelector((state) => state.message.callLogs);
  const hasPreviousMessage = useSelector((state) =>
    selectHasPreviousMessage(state, company)
  );
  const jumpMessages = useSelector((state) => state.message.jumpMessages);
  const pagination = useSelector(
    (state) => state.message.conversations.manager[company.code].pagination
  );
  const isEmptyPage = useSelector(
    (state) => state.message.conversations.manager[company.code].isEmptyPage
  );
  const [editingClient, setEditingClient] = useState(null);
  //*Author
  const [authorPermission, setAuthorPermission] = useState({
    canRead: false,
    canUpdate: false,
    canDelete: false,
    canCreate: false
  });

  //*Handle Author
  const getAuthor = async () => {
    setAuthorPermission({
      ...authorPermission,
      canRead: await authorizer.current.can('read', '/chat'),
      canUpdate: await authorizer.current.can('update', '/chat'),
      canDelete: await authorizer.current.can('delete', '/chat'),
      canCreate: await authorizer.current.can('create', '/chat'),
      canReadLogActivities: await authorizer.current.can(
        'read',
        '/log-activities'
      )
    });
  };
  //* Call Logs
  const status = useSelector((state) => state.message.status);
  const message = useSelector((state) => state.message.message);

  const [openCallLog, setOpenCallLog] = useState(false);
  const [callLogConversation, setCallLogConversation] = useState();

  const activitiesLog = useSelector((state) => state.message.activitiesLog);
  // const activitiesLog = useState([]);
  const [openActivitiesLog, setOpenActivitiesLog] = useState(false);
  const [activitiesLogLogConversation, setActivitiesLogConversation] =
    useState();

  const conversations = useSelector((state) =>
    selectConversations(state, company)
  );
  const [filterConversations, setFilterConversations] = useState([]);

  const selectedConversation = useSelector((state) =>
    selectSelectedConversation(state, company)
  );
  const filters = useSelector(
    (state) => state.message.conversations.manager[company.code].filters
  );

  const { emitUpdateConversation, emitUpdateConversations } = useContext(
    SocketNotificationContext
  );

  //* show notification
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  //* only using for mobile screen
  const handleBackToConversationList = () =>
    dispatch(
      selectConversation({ conversationId: undefined, company: company })
    );

  const loadMoreConversations = () => {
    if (page > 1) {
      loadConversations();
    }
  };

  //* get call log records
  const handleGetCallLogRecords = (data) => {
    dispatch(getCallLogRecords(data));
  };

  //
  const handleGetActivitiesLog = (filters) => {
    dispatch(getLogActivities(filters));
  };

  //* without search and jump
  const loadMoreMessages = ({ topBoundary }) => {
    if (!hasPreviousMessage) return;
    dispatch(
      loadMoreMessagesInConversation({
        topBoundary: topBoundary,
        limitMessageInConversations: limit.moreLimitMessageInConversations
          ? limit.moreLimitMessageInConversations
          : null,
        conversationId: selectedConversation ? selectedConversation.id : null,
        company: company
      })
    );
  };

  //* when search and jump to a message in conversation
  const handleLoadPreviousMessages = (data) => {
    if (!jumpMessages.manager.hasPrevious) return;
    dispatch(
      loadPreviousMessages({
        conversationId: selectedConversation ? selectedConversation.id : null,
        query: data
      })
    );
  };

  //* when search and jump to a message in conversation
  const handleLoadNextMessages = (data) => {
    if (!jumpMessages.manager.hasNext) {
      return;
    }
    dispatch(
      loadNextMessages({
        conversationId: selectedConversation ? selectedConversation.id : null,
        query: data,
        company
      })
    );
  };

  const loadConversations = () => {
    if (!hasNextConversation) return;
    loadConversationRef.current = dispatch(
      getConversationsOfUser({
        page: page,
        limitConversations: limit.initLimitConversations,
        limitMessageInConversations: limit.moreLimitMessageInConversations,
        company: company,
        types: filters.types,
        search: filters.search,
        labels: filters.labels,
        users: filters.users
      })
    );
  };

  const handleCheckConversations = (e, value) => {
    if (e.target.checked)
      setCheckedConversations([
        ...checkedConversations,
        {
          participantId: value.participantId,
          conversationId: value.id,
          umn: value.umn
        }
      ]);
    else {
      const index = checkedConversations.findIndex(
        (item) => item.conversationId === value.id
      );
      checkedConversations.splice(index, 1);
      setCheckedConversations([...checkedConversations]);
    }
  };

  const handleMarkRead = (participantId, umn) => {
    if (participantId) {
      dispatch(
        updateUmnConversation({
          participantId,
          company: company,
          readStatus: 'read'
        })
      );
      setCheckedConversations([]);

      emitUpdateConversation({
        type: emitUpdateConversationTypes.PARTICIPANT,
        company: company,
        conversationUpdated: {
          participant: {
            id: participantId,
            type: 'read',
            umn: umn
          }
        }
      });
    } else {
      dispatch(
        updateUmnConversations({
          company: company,
          participantIds: checkedConversations.map(
            (item) => item.participantId
          ),
          readStatus: 'read'
        })
      );
      setCheckedConversations([]);

      emitUpdateConversations({
        type: emitUpdateConversationTypes.PARTICIPANT,
        company: company,
        conversationUpdated: {
          participants: checkedConversations.map((item) => {
            return {
              id: item.participantId,
              type: 'read',
              umn: item.umn
            };
          })
        }
      });
    }
  };

  const handleMarkUnRead = (participantId, umn) => {
    if (participantId) {
      dispatch(
        updateUmnConversation({
          participantId,
          company: company,
          readStatus: 'unread'
        })
      );
      setCheckedConversations([]);

      if (umn === 0)
        emitUpdateConversation({
          type: emitUpdateConversationTypes.PARTICIPANT,
          company: company,
          conversationUpdated: {
            participant: {
              id: participantId,
              type: 'unread',
              umn: umn
            }
          }
        });
    } else {
      dispatch(
        updateUmnConversations({
          company: company,
          participantIds: checkedConversations.map(
            (item) => item.participantId
          ),
          readStatus: 'unread'
        })
      );
      setCheckedConversations([]);

      emitUpdateConversations({
        type: emitUpdateConversationTypes.PARTICIPANT,
        company: company,
        conversationUpdated: {
          participants: checkedConversations
            .map((item) => {
              if (item.umn === 0)
                return {
                  id: item.participantId,
                  type: 'unread',
                  umn: item.umn
                };
            })
            .filter((item) => item)
        }
      });
    }
  };

  const handleEditClient = (conversation) => {
    if (!conversation) return setEditingClient(null);
    if (editingClient) showSnackbar('1 item is editing', 'warning');
    else setEditingClient(conversation);
  };

  const handleSubmitEditClient = async (data) => {
    dispatch(editInfoClient(data))
      .then(unwrapResult)
      .then((result) => {
        setEditingClient(null);
        const conversationUpdated = {
          id: result['conversationId'],
          customer: {
            id: result['customerId'],
            fullName: result['name'],
            campaigns: result['campaigns']
          }
        };
        dispatch(
          updateConversation({ company, conversation: conversationUpdated })
        );

        emitUpdateConversation({
          type: emitUpdateConversationTypes.CONVERSATION,
          company,
          conversationUpdated
        });
      })
      .catch((error) => {
        showSnackbar('Update client error!', 'error');
      });
  };

  const handleEditConversation = async (conversation) => {
    try {
      const result = await dispatch(editConversation(conversation));
      unwrapResult(result);
      dispatch(updateConversation({ company, conversation }));

      emitUpdateConversation({
        type: emitUpdateConversationTypes.CONVERSATION,
        company,
        conversationUpdated: conversation
      });
    } catch (error) {
      showSnackbar('Handle edit conversation fail', 'error');
      // showSnackbar('Something wrong', 'error');
    }
  };

  const handleEditConversations = async (data) => {
    try {
      const result = await dispatch(
        editConversations({
          company: company,
          ids: checkedConversations.map((item) => item.conversationId),
          ...data
        })
      );
      unwrapResult(result);
      setCheckedConversations([]);

      emitUpdateConversations({
        type: emitUpdateConversationTypes.CONVERSATION,
        company: company,
        conversationUpdated: {
          ids: checkedConversations.map((item) => item.conversationId),
          ...data
        }
      });
    } catch (error) {
      // showSnackbar('Something wrong', 'error');
      showSnackbar('Handle edit conversations fail', 'error');
    }
  };

  const handleAssignLabel = async (conversation, labelIds) => {
    if (!conversation || !labelIds) return;
    dispatch(
      assignLabels({
        conversationId: conversation['id'],
        labelIds
      })
    )
      .then(unwrapResult)
      .then((result) => {
        //* get conversation from store
        const { labels } = result;

        const conversationUpdated = {
          id: conversation['id'],
          labels: labels
        };

        emitUpdateConversation({
          type: emitUpdateConversationTypes.CONVERSATION,
          company,
          conversationUpdated
        });
      });
  };
  const handleOpenMakeOptSuggestionOrSensitiveWord = (message) => {
    setMessageMakingOptSuggestionOrSensitiveWord(message);
    setOpenMakeOptSuggestionOrSensitiveWord(true);
  };
  const handleCloseMakeOptSuggestion = () => {
    setOpenMakeOptSuggestionOrSensitiveWord(false);
    setMessageMakingOptSuggestionOrSensitiveWord(null);
  };
  const handleSubmitMakeOptSuggestionOrMakeSensitiveWord = async ({
    campaign,
    reason,
    optStatus
  }) => {
    try {
      if (messageMakingOptSuggestion.direction === 'inbound') {
        const actionResult = await dispatch(
          createOptSuggestion({
            messageId: messageMakingOptSuggestion.id,
            reason: reason,
            rate: 1,
            campaignId: campaign,
            optStatus
          })
        );
        const result = unwrapResult(actionResult);
        if (result.success) {
          showSnackbar('Make opt suggestion success', 'success');
        } else {
          showSnackbar(result.message, 'warning');
        }
      } else {
        const actionResult = await dispatch(
          createSensitiveWord({
            messageId: messageMakingOptSuggestion.id,
            reason: reason
          })
        );
        const result = unwrapResult(actionResult);
        if (result.success) {
          showSnackbar('Make sensitive word success', 'success');
        } else {
          showSnackbar(result.message, 'warning');
        }
      }
    } catch (error) {
      console.log(error);
      showSnackbar('Something wrong', 'error');
    }
    handleCloseMakeOptSuggestion();
  };
  //* filter conversation when set filter when lazy load, real time
  useEffect(() => {
    if (!filters) return;
    //* detect new conversations have just been loaded in store
    let newConversations = [];
    //* conversation need updating
    let updateConversations = [];
    conversations.forEach((storeConversation) => {
      const info = filterConversations.find(
        (item) => item.id === storeConversation.id
      );
      if (!info) {
        newConversations.push(storeConversation);
      } else updateConversations.push(storeConversation);
    });
    //* new conversations which are in store and not in filterConversations
    if (filters.search) {
      newConversations = newConversations.filter((item) =>
        item.customer.phone.includes(filters.search)
      );
    }
    if (filters.types.length > 0) {
      filters.types.forEach((type) => {
        if (type.value === 'incomplete') {
          newConversations = newConversations.filter(
            (item) => item.isCompleted === false
          );
        } else if (type.value === 'completed') {
          newConversations = newConversations.filter(
            (item) => item.isCompleted === true
          );
        } else if (type.value === 'new')
          newConversations = newConversations.filter(
            (item) => item.newOrExisting === 'new'
          );
        else if (type.value === 'existing')
          newConversations = newConversations.filter(
            (item) => item.newOrExisting === 'existing'
          );
        else if (type.value === 'unread')
          newConversations = newConversations.filter((item) => item.umn > 0);
        else
          newConversations = newConversations.filter(
            (item) => item.lastMessage === 'inbound'
          );
      });
    }
    if (filters.labels.length > 0) {
      newConversations = newConversations.filter((conversation) => {
        if (
          filters.labels.some((label) => {
            const indexLabel = conversation.labels.findIndex(
              (infoLabel) => infoLabel.id === label.value
            );
            return indexLabel > -1 ? true : false;
          })
        ) {
          return true;
        }
        return false;
      });
    }
    if (filters.users.length > 0) {
      const userIds = filters.users.map((user) => user.value);
      newConversations = newConversations.filter((item) =>
        userIds.includes(item.lastUser.id)
      );
    }

    let concatConversations = [
      ...updateConversations,
      ...newConversations
    ].sort((item1, item2) => {
      if (!item1.lastMessage.mode) return 1;
      if (!item2.lastMessage.mode) return -1;
      if (item1.lastMessage.mode > item2.lastMessage.mode) return 1;
      else if (item1.lastMessage.mode < item2.lastMessage.mode) return -1;
      else {
        if (new Date(item2.lastModifiedTime) > new Date(item1.lastModifiedTime))
          return 1;
        else if (
          new Date(item2.lastModifiedTime) < new Date(item1.lastModifiedTime)
        )
          return -1;
        return 0;
      }
    });
    setFilterConversations(concatConversations);
    if (concatConversations.length === pagination.total)
      dispatch(setHasNext({ companyCode: company.code, hasNext: false }));
  }, [conversations]);

  useEffect(() => {
    isMountRef.current = true;
  }, [company.code]);

  //* filter conversation when set filter
  useEffect(() => {
    if (!isMountRef.current) {
      if (loadConversationRef.current) loadConversationRef.current.abort();
      let filterConversations = conversations;

      if (filters.search) {
        filterConversations = filterConversations.filter((item) =>
          item.customer.phone.includes(filters.search)
        );
      }
      if (filters.types.length > 0) {
        filters.types.forEach((type) => {
          if (type.value === 'incomplete')
            filterConversations = filterConversations.filter(
              (item) => item.isCompleted === false
            );
          else if (type.value === 'completed')
            filterConversations = filterConversations.filter(
              (item) => item.isCompleted === true
            );
          else if (type.value === 'new')
            filterConversations = filterConversations.filter(
              (item) => item.newOrExisting === 'new'
            );
          else if (type.value === 'existing')
            filterConversations = filterConversations.filter(
              (item) => item.newOrExisting === 'existing'
            );
          else if (type.value === 'unread')
            filterConversations = filterConversations.filter(
              (item) => item.umn > 0
            );
          else {
            filterConversations = filterConversations.filter(
              (item) => item.lastMessage.direction === 'inbound'
            );
          }
        });
      }
      if (filters.labels.length > 0) {
        filterConversations = filterConversations.filter((conversation) => {
          if (
            filters.labels.some((label) => {
              const indexLabel = conversation.labels.findIndex(
                (infoLabel) => infoLabel.id === label.value
              );
              return indexLabel > -1 ? true : false;
            })
          ) {
            return true;
          }
          return false;
        });
      }

      if (filters.users.length > 0) {
        const userIds = filters.users.map((user) => user.value);
        filterConversations = filterConversations.filter((item) =>
          userIds.includes(item.lastUser.id)
        );
      }

      setFilterConversations(filterConversations);

      dispatch(setFirstLoadingAfterFilter(true));
      loadConversations(); //? why
    }
    isMountRef.current = false;
  }, [filters]);

  useEffect(() => {
    if (pagination.total === 0) {
      dispatch(setHasNext({ companyCode: company.code, hasNext: false }));
    }
    if (isFiltering(filters)) {
      if (pagination.total === filterConversations.length)
        dispatch(setHasNext({ companyCode: company.code, hasNext: false }));
      else {
        //? why
        // console.log('pagination:' + pagination.total);
        // console.log('filterconversations:' + filterConversations.length);
        // console.log('hasNext tue');
        // dispatch(setHasNext({ companyCode: company.code, hasNext: true }));
      }
    } else {
      if (conversations.length === pagination.total) {
        dispatch(setHasNext({ companyCode: company.code, hasNext: false }));
      } else {
        //? why
        // dispatch(setHasNext({ companyCode: company.code, hasNext: true }));
      }
    }
  }, [pagination]);

  useEffect(() => {
    if (isEmptyPage) {
      if (isFiltering(filters)) {
        if (filterConversations.length < pagination.total) {
          loadConversations();
        }
      } else {
        if (conversations.length < pagination.total) {
          loadConversations();
        }
      }
      dispatch(setIsEmptyPage({ companyCode: company.code }));
    }
  }, [isEmptyPage]);

  useEffect(() => {
    if (status === apiStatus.ERROR) showSnackbar(message, apiStatus.ERROR);
  }, [status]);

  useEffect(() => {
    getAuthor();
    dispatch(getListSignatureActive());
    return () => dispatch(clearFilters({ companyCode: company.code }));
  }, []);

  return (
    <Page
      className={clsx({
        [classes.root]: true,
        [classes.openConversion]: !!selectedConversation.id //* only work with small screen
      })}
      title={company.name}
    >
      <Paper className={classes.messages} elevation={1} variant="outlined">
        <ConversationList
          className={classes.conversationList}
          conversations={
            isFiltering(filters) ? filterConversations : conversations
          }
          loadMoreConversations={loadMoreConversations}
          selectedConversation={selectedConversation}
          filters={filters}
          checkedConversations={checkedConversations}
          onCheckConversation={handleCheckConversations}
          onMarkRead={handleMarkRead}
          onMarkUnRead={handleMarkUnRead}
          onClearCheckedConversation={() => setCheckedConversations([])}
          setOpenCallLog={setOpenCallLog}
          setCallLogConversation={setCallLogConversation}
          getCallLogs={handleGetCallLogRecords}
          setOpenActivitiesLog={setOpenActivitiesLog}
          setActivitiesLogConversation={setActivitiesLogConversation}
          getActivitiesLog={handleGetActivitiesLog}
          editingClient={editingClient}
          onEditClient={handleEditClient}
          onSubmitEditClient={handleSubmitEditClient}
          onEditConversation={handleEditConversation}
          onAssignLabels={handleAssignLabel}
          onEditConversations={handleEditConversations}
          authorPermission={authorPermission}
        />

        {selectedConversation.id ? (
          <ConversationDetail
            className={classes.conversationDetails}
            conversations={conversations}
            onBack={handleBackToConversationList}
            selectedConversation={selectedConversation}
            loadMoreMessages={loadMoreMessages}
            company={company}
            loadPreviousMessages={handleLoadPreviousMessages}
            loadNextMessages={handleLoadNextMessages}
            authorPermission={authorPermission}
            onOpenMakeOptSuggestionOrSensitiveWord={
              handleOpenMakeOptSuggestionOrSensitiveWord
            }
          />
        ) : (
          <ConversationPlaceholder
            className={classes.conversationPlaceholder}
          /> //* unpick any conversation
        )}
      </Paper>
      {callLogConversation ? (
        <CallLogsDialog
          open={openCallLog}
          callLogs={callLogs}
          title="Call Logs"
          setOpenCallLog={setOpenCallLog}
          getCallLogs={handleGetCallLogRecords}
          conversation={callLogConversation}
          company={company}
        />
      ) : (
        ''
      )}
      <MakeOptSuggestion
        open={openMakeOptSuggestion}
        onClose={handleCloseMakeOptSuggestion}
        onYes={handleSubmitMakeOptSuggestionOrMakeSensitiveWord}
        data={messageMakingOptSuggestion}
      />

      {activitiesLogLogConversation && openActivitiesLog && (
        <ConversationActivitiesDialog
          open={openActivitiesLog}
          activitiesLog={activitiesLog}
          title="Activities log"
          setOpenActivitiesLog={setOpenActivitiesLog}
          getActivitiesLog={handleGetActivitiesLog}
          conversation={activitiesLogLogConversation}
        />
      )}
    </Page>
  );
}

Message.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default Message;
