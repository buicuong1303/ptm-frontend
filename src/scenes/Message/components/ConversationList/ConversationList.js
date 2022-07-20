/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, List } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import {
  readMessage,
  resetLoadingMessages,
  selectConversation,
  setEditingLabels
} from 'scenes/Message/Message.slice';
import { Control, ConversationListItem } from './components';
import { SocketChatContext } from 'services/socket/SocketChat';
import { CompanyContext } from 'contexts/CompanyProvider';
import { Waypoint } from 'react-waypoint';
import apiStatus from 'utils/apiStatus';
import { scrollTo } from 'utils/scrollTo';
import Loading from 'images/Rolling-1s-200px.gif';
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column'
  },
  searchInput: {
    flexGrow: 1
  },
  conversationList: {
    flex: 1,
    overflowY: 'auto',
    padding: '0px'
  },
  conversationListItem: {
    width: '100%'
  },
  perfectScrollbar: {
    '&.ps--active-y': {
      paddingRight: '10px'
    }
  },
  formControl: {
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: '5px'
    }
  },
  optionItem: {
    minWidth: '80px'
  }
}));

const ConversationList = (props) => {
  const {
    conversations,
    className,
    loadMoreConversations,
    selectedConversation,
    checkedConversations,
    onCheckConversation,
    onMarkRead,
    onMarkUnRead,
    filters,
    onClearCheckedConversation,
    getCallLogs,
    setOpenCallLog,
    setCallLogConversation,
    setOpenActivitiesLog,
    setActivitiesLogConversation,
    getActivitiesLog,
    editingClient,
    onSubmitEditClient,
    onEditClient,
    onEditConversation,
    onAssignLabels,
    onEditConversations,
    authorPermission,
    ...rest
  } = props;

  const classes = useStyles();

  const dispatch = useDispatch();

  //* chat socket
  const { joinRoom, leaveRoom, handelReadMessage } =
    useContext(SocketChatContext);

  //* company
  const { company } = useContext(CompanyContext);

  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const firstLoadingAfterFilter = useSelector(
    (state) => state.message.firstLoadingAfterFilter
  );
  const jumpMessages = useSelector((state) => state.message.jumpMessages);
  const hasNext = useSelector(
    (state) => state.message.conversations.manager[company.code].hasNext
  );
  const handleSelectConversation = (selectedNewConversationId) => {
    if (onClearCheckedConversation) onClearCheckedConversation();
    //* update unm -> 0
    const participantId =
      conversations[
        conversations.map((item) => item.id).indexOf(selectedNewConversationId)
      ].participantId;
    // dispatch(updateUmnWhenReadMessage({ conversationId: selectedNewConversationId, participantId: participantId, company: company }));

    //* leave old room
    leaveRoom(selectedConversationId);

    //* set select conversationId
    setSelectedConversationId(selectedNewConversationId);

    //* set conversation
    dispatch(
      selectConversation({
        conversationId: selectedNewConversationId,
        company: company
      })
    );

    //* turn on loading messages
    dispatch(resetLoadingMessages());

    //* join new room
    joinRoom({ selectedNewConversationId, participantId, company });

    //* read message in this connection
    dispatch(
      readMessage({
        conversationId: selectedNewConversationId,
        company: company,
        umn: conversations[
          conversations
            .map((item) => item.id)
            .indexOf(selectedNewConversationId)
        ]?.umn
      })
    );

    //* read message in other connection
    handelReadMessage({
      participantId: participantId,
      company: {
        code: company.code
      },
      conversationId: selectedNewConversationId,
      umn: conversations[
        conversations.map((item) => item.id).indexOf(selectedNewConversationId)
      ]?.umn
    });
  };

  // useEffect(() => {
  //   const ele = document.getElementById('scrollbar-conversation-list');
  //   ele.scrollTop = 0;
  // }, [filters]);

  useEffect(() => {
    return () => leaveRoom(selectedConversationId);
  }, []);

  useLayoutEffect(() => {
    if (jumpMessages.manager.jumpStatus === apiStatus.SUCCESS) {
      const element = document.getElementById('scrollbar-conversation-list');
      const indexConversation = conversations.findIndex(
        (item) => item.id === jumpMessages.manager.conversationId
      );
      let totalHeight = indexConversation * 80;
      scrollTo(element, totalHeight, 550);
    }
  }, [jumpMessages.manager.jumpStatus]);

  useEffect(() => {
    return () => {
      handleOnSetEnableEditLabels(false);
    };
  }, []);

  const handleOnSetEnableEditLabels = (status) => {
    dispatch(setEditingLabels({ status }));
  };

  const handleAssignLabels = (conversation, labelIds) => {
    onAssignLabels(conversation, labelIds);
  };
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div>
        <Control
          editingClient={editingClient}
          labels={company['labels']}
          users={company['users']}
        />
      </div>
      <Divider />
      <List
        className={classes.conversationList}
        id="scrollbar-conversation-list"
      >
        {!firstLoadingAfterFilter ? (
          <div className={classes.perfectScrollbar}>
            {conversations.map((conversation, i) => (
              <ConversationListItem
                active={
                  selectedConversation
                    ? conversation.id === selectedConversation.id
                    : false
                }
                conversation={conversation}
                divider={i < conversations.length - 1}
                key={conversation.id}
                onClick={handleSelectConversation}
                className={classes.conversationListItem}
                onCheckConversation={onCheckConversation}
                checked={checkedConversations
                  .map((item) => item.participantId)
                  .includes(conversation.participantId)}
                isChecking={checkedConversations.length > 0 ? true : false}
                onMarkRead={onMarkRead}
                onMarkUnRead={onMarkUnRead}
                company={company}
                getCallLogs={getCallLogs}
                setOpenCallLog={setOpenCallLog}
                setCallLogConversation={setCallLogConversation}
                labels={company['labels']}
                onEditLabel={handleOnSetEnableEditLabels}
                editingClient={editingClient}
                onSubmitEditClient={onSubmitEditClient}
                onEditClient={onEditClient}
                onEditConversation={onEditConversation}
                onAssignLabels={handleAssignLabels}
                onEditConversations={onEditConversations}
                setOpenActivitiesLog={setOpenActivitiesLog}
                setActivitiesLogConversation={setActivitiesLogConversation}
                getActivitiesLog={getActivitiesLog}
                authorPermission={authorPermission}
              />
            ))}
            {hasNext && (
              <Waypoint
                onEnter={() => {
                  loadMoreConversations();
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <img src={Loading} style={{ width: 50, height: 50 }} />
                </div>
              </Waypoint>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <img src={Loading} style={{ width: 50, height: 50 }} />
          </div>
        )}
      </List>
    </div>
  );
};

ConversationList.propTypes = {
  conversation: PropTypes.array,
  className: PropTypes.string,
  loadConversations: PropTypes.func,
  selectedConversation: PropTypes.object,
  filters: PropTypes.object,
  loadMoreConversations: PropTypes.func.isRequired,
  onCheckConversation: PropTypes.func.isRequired,
  onMarkRead: PropTypes.func.isRequired,
  onMarkUnRead: PropTypes.func.isRequired,
  setCallLogConversation: PropTypes.func.isRequired,
  onAssignLabels: PropTypes.func.isRequired,
  setOpenActivitiesLog: PropTypes.func.isRequired,
  setActivitiesLogConversation: PropTypes.func.isRequired,
  getActivitiesLog: PropTypes.func.isRequired,
  authorPermission: PropTypes.object
};

export default ConversationList;
