/* eslint-disable prettier/prettier */
import React, {
  createContext,
  useRef,
  useCallback,
  useEffect,
  useState,
  useContext
} from 'react';
import socketIOClient from 'socket.io-client';
import { CHAT_NAMESPACE_URL } from './config';
import { useDispatch, useSelector } from 'react-redux';
import {
  addNewMessage,
  addNotifyMissMessage,
  updateOutboundMessage,
  readMessage,
  inputtingMessage,
  addConversation,
  stopInputMessage,
  selectConversation,
  clearJump,
  setFilters
} from 'scenes/Message/Message.slice';
import { v4 as uuid } from 'uuid';
import { MESSAGE_STATUS } from 'constants/message.status';
import {
  getInfoPaginationMessages,
  getNewConversationOfUser,
  jumpToMessageInConversation,
  uploadAttachments
} from 'scenes/Message/Message.asyncAction';
import { unwrapResult } from '@reduxjs/toolkit';
import { messageApi } from 'services/apis';
import limit from 'constants/limit';
import { useSnackbar } from 'notistack';
import { signOut } from 'store/slices/session.slice';
import { useHistory } from 'react-router';
import { SettingContext } from 'contexts/SettingProvider';

const SocketChatContext = createContext(null);
const { Provider } = SocketChatContext;

const SocketChatProvider = ({ children }) => {
  const companiesProviderRef = useRef(null);

  const { showNotification } = useContext(SettingContext);

  const setCompaniesProvider = (companies) =>
    (companiesProviderRef.current = companies);

  const dispatch = useDispatch();
  const history = useHistory();

  const conversations = useSelector((state) => state.message.conversations);
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );
  const user = useSelector((state) => state.session.user);

  const newConversations = useRef([]);
  const userRef = useRef(null);
  const snackBarRef = useRef(null);
  const [statusConnection, setStatusConnection] = useState('success');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  useEffect(() => {
    newConversations.current = conversations;
  }, [conversations]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const socketClient = useRef(null);

  const onClickNotification = async (data) => {
    try {
      const selectCompany = companiesProviderRef.current?.find(
        (company) => company.code === data.companyCode
      );

      window.parent.parent.focus();
      history.push(`/messages/${data.companyCode}`);

      const toggleButton = document.getElementById('/messages');
      if (toggleButton && toggleButton.getAttribute('data-toggle') === 'false')
        toggleButton.click();

      const indexConversation = newConversations.current[data.companyCode]
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

      //* leave old room
      for (const key in selectedConversation) {
        if (Object.hasOwnProperty.call(selectedConversation, key)) {
          if (key === selectCompany.code) {
            leaveRoom(selectedConversation[selectCompany.code].id);
          }
        }
      }

      //* set conversation
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
        setFilters({ companyCode: selectCompany.code, search: '', type: 'all' })
      );

      dispatch(
        jumpToMessageInConversation({
          messageId: data.id,
          company: selectCompany,
          conversationId: data.conversationId,
          highlights: data.highlights || []
        })
      );

      //* join new room
      const participantId =
        newConversations.current[selectCompany.code][indexConversation]
          ?.participantId;
      joinRoom({
        selectedNewConversationId: data.conversationId,
        participantId,
        selectCompany
      });
    } catch (error) {
      // showSnackbar('Something wrong', 'error');
      showSnackbar('Click notification fail', 'error');
    }
  };

  //* emit event
  const joinRoom = useCallback((data) => {
    const {
      selectedNewConversationId: roomId,
      participantId: participantId,
      company: company
    } = data;
    socketClient.current.emit('join_room', { roomId, participantId, company });
  }, []);

  const leaveRoom = useCallback((roomId) => {
    socketClient.current.emit('leave_room', roomId);
  }, []);

  const sendMessage = useCallback(async (payload) => {
    const {
      conversationId,
      message,
      signature,
      sender,
      company,
      checked,
      signatureId
    } = payload;
    const { text, files } = message;
    const tempId = uuid();

    let attachmentInfo = [];

    if (files && files.length > 0) {
      try {
        const uploadResult = await dispatch(uploadAttachments(files));
        attachmentInfo = unwrapResult(uploadResult).map((item) => {
          return {
            ...item,
            url: item.url.slice(0, item.url.indexOf('?'))
          };
        });
      } catch (error) {
        showSnackbar(error.message, 'error');
      }
    }
    const newMessage = {
      mode: 'normal',
      id: tempId,
      text: checked
        ? signature !== ''
          ? text.trim() !== ''
            ? text +
              '\n' +
              sender.firstName +
              ' ' +
              sender.lastName +
              ' - ' +
              signature
            : sender.firstName + ' ' + sender.lastName
          : text + '\n' + sender.firstName + ' ' + sender.lastName
        : signature !== ''
          ? text.trim() !== ''
            ? text + '\n' + signature
            : signature
          : text,

      attachments: attachmentInfo.map((item) => ({
        ...item,
        format: item.type.split('/')[1],
        category: item.type.split('/')[0]
      })),
      direction: 'outbound',
      sender: {
        id: sender.id,
        name: sender.firstName + ' ' + sender.lastName,
        email: sender.email,
        avatar: sender.avatar
      },
      creationTime: JSON.parse(JSON.stringify(new Date())),
      exCreationTime: '',
      messageStatus: MESSAGE_STATUS.SENDING,
      exMessageStatus: '',
      conversationId: conversationId,
      companyCode: company.code,
      signature: signatureId,
      type: 'text'
    };
    dispatch(
      addNewMessage({ message: newMessage, currentUser: userRef.current })
    );
    const data = {
      message: {
        id: tempId,
        text: text,
        attachments: attachmentInfo,
        conversationId: conversationId,
        companyCode: company.code,
        userSignature: checked,
        type: 'text'
      },
      sender: {
        id: sender.id,
        name: sender.firstName + ' ' + sender.lastName,
        email: sender.email,
        avatar: sender.avatar
      },
      signature: signatureId
    };
    socketClient.current.emit('send_message', data);
  }, []);

  const disconnect = useCallback(() => {
    socketClient.current.disconnect();
  }, []);

  const connect = useCallback(() => {
    const accessToken = localStorage.getItem('accessToken');

    socketClient.current = socketIOClient(CHAT_NAMESPACE_URL, {
      query: { token: accessToken },
      path: `${window._env_.REACT_APP_SOCKET_PATH}/socket.io`
    });

    startListenerSocketEvent();
  }, []);

  const handelInputNotify = useCallback((payload) => {
    socketClient.current.emit('typing', payload);
  }, []);

  const handelStopInputNotify = useCallback((payload) => {
    socketClient.current.emit('stop_typing', payload);
  }, []);

  const handelReadMessage = useCallback((payload) => {
    socketClient.current.emit('read_message', payload);
  }, []);

  //* handle event listener
  const onOtherUserOnline = useCallback(() => {
    //TODO: need add online user to top bar and change status
    // console.log('handleOtherUserOnline');
  }, []);

  const onOtherUserOffline = useCallback(() => {
    //TODO: Change online state relate user
    // console.log('handleOtherUserOffline');
  }, []);

  const onOtherUserJoinRoom = useCallback(() => {
    //TODO: Notification another user join room
    // console.log('handleOtherUserJoinRoom');
  }, []);

  const onOtherUserLeaveRoom = useCallback(() => {
    //TODO: Notification another user leave room
    // console.log('handleOtherUserLeaveRoom');
  }, []);

  const onSendError = useCallback((payload) => {
    dispatch(updateOutboundMessage(payload));
    showSnackbar(`Send message '${payload.message.text}' fail`, 'error');
  }, []);

  const onSendMessage = useCallback(async (payload) => {
    const newMessage = payload.message;
    const conversations = newConversations.current[newMessage.companyCode];
    const indexOfConversation = conversations
      .map((item) => item.id)
      .indexOf(newMessage.conversationId);
    if (indexOfConversation === -1) {
      try {
        const response = await messageApi.getNewConversationOfUser({
          id: newMessage.conversationId,
          companyCode: newMessage.companyCode,
          limitMessageInConversations: limit.initLimitMessageInConversations
        });

        const newConversation = {
          ...response.data,
          company: newMessage.companyCode,
          messages: response.data.messages.reverse().map(message => ({
            ...message,
            sender: {
              id: message.creationUserId ? message.creationUserId.id : '',
              name: message.creationUserId
                ? message.creationUserId.firstName +
                  ' ' +
                  message.creationUserId.lastName
                : '',
              email: message.creationUserId
                ? message.creationUserId.email
                : '',
              avatar: message.creationUserId
                ? message.creationUserId.avatar
                : ''
            },
          }))
        };
        if (response.data.lastUser) {
          newConversation['lastUser'] = {
            ...response.data.lastUser,
            name:
              response.data.lastUser &&
              response.data.lastUser.firstName +
                ' ' +
                response.data.lastUser.lastName
          };
        }
        dispatch(addConversation(newConversation));
      } catch (error) {
        // showSnackbar('Something wrong', 'error');
        showSnackbar('Send messages fail', 'error');
      }
    } else {
      dispatch(
        addNewMessage({ message: newMessage, currentUser: userRef.current })
      );
    }
    showNotification(
      newMessage.text,
      () => onClickNotification(newMessage),
      userRef.current,
      'outbound'
    );
  }, []);

  const onUpdateOutboundMessage = useCallback((payload) => {
    dispatch(updateOutboundMessage(payload));
  }, []);

  const onReadMessage = useCallback((payload) => {
    dispatch(readMessage(payload));
  }, []);

  const onDisconnect = useCallback(() => {
    console.log('onDisconnect chat');
  }, []);

  const onConnect = useCallback(() => {
    console.log('onConnect chat');
    setStatusConnection('success');
    if (snackBarRef.current) closeSnackbar(snackBarRef.current);
  }, []);

  const onConnectError = useCallback(() => {
    console.log('onConnectError chat');
    setStatusConnection('error');
  }, []);

  const onReceiveInboundMessage = useCallback(async (payload) => {
    const newMessage = payload.message;
    const conversations = newConversations.current[newMessage.companyCode];
    const indexOfConversation = conversations
      .map((item) => item.id)
      .indexOf(newMessage.conversationId);
    if (indexOfConversation === -1) {
      try {
        const response = await messageApi.getNewConversationOfUser({
          id: newMessage.conversationId,
          companyCode: newMessage.companyCode,
          limitMessageInConversations: limit.initLimitMessageInConversations
        });

        const newConversation = {
          ...response.data,
          company: newMessage.companyCode,
          messages: response.data.messages.reverse().map(message => ({
            ...message,
            sender: {
              id: message.creationUserId ? message.creationUserId.id : '',
              name: message.creationUserId
                ? message.creationUserId.firstName +
                  ' ' +
                  message.creationUserId.lastName
                : '',
              email: message.creationUserId
                ? message.creationUserId.email
                : '',
              avatar: message.creationUserId
                ? message.creationUserId.avatar
                : ''
            },
          }))
        };
        if (response.data.lastUser) {
          newConversation['lastUser'] = {
            ...response.data.lastUser,
            name:
              response.data.lastUser &&
              response.data.lastUser.firstName +
                ' ' +
                response.data.lastUser.lastName
          };
        }
        dispatch(addConversation(newConversation));
      } catch (error) {
        // showSnackbar('Something wrong', 'error');
        showSnackbar('Get new conversation fail', 'error');
      }
    } else {
      dispatch(
        addNewMessage({ message: newMessage, currentUser: userRef.current })
      );
    }
    showNotification(
      newMessage.text,
      () => onClickNotification(newMessage),
      userRef.current,
      'inbound'
    );
  }, []);

  const onReceiveInboundNotifyMiss = useCallback((payload) => {
    showNotification(
      payload?.text,
      () => onClickNotification(payload),
      userRef.current,
      'inbound'
    );
    dispatch(addNotifyMissMessage(payload));
  }, []);

  const onReceiveMissedInboundCall = useCallback(async (payload) => {
    const newMessage = payload.message;
    const conversations = newConversations.current[newMessage.companyCode];
    const indexOfConversation = conversations
      .map((item) => item.id)
      .indexOf(newMessage.conversationId);
    if (indexOfConversation === -1) {
      try {
        const response = await messageApi.getNewConversationOfUser({
          id: newMessage.conversationId,
          companyCode: newMessage.companyCode,
          limitMessageInConversations: limit.initLimitMessageInConversations
        });

        const newConversation = {
          ...response.data,
          company: newMessage.companyCode,
          messages: response.data.messages.reverse().map(message => ({
            ...message,
            sender: {
              id: message.creationUserId ? message.creationUserId.id : '',
              name: message.creationUserId
                ? message.creationUserId.firstName +
                  ' ' +
                  message.creationUserId.lastName
                : '',
              email: message.creationUserId
                ? message.creationUserId.email
                : '',
              avatar: message.creationUserId
                ? message.creationUserId.avatar
                : ''
            },
          }))
        };
        if (response.data.lastUser) {
          newConversation['lastUser'] = {
            ...response.data.lastUser,
            name:
              response.data.lastUser &&
              response.data.lastUser.firstName +
                ' ' +
                response.data.lastUser.lastName
          };
        }
        dispatch(addConversation(newConversation));
      } catch (error) {
        // showSnackbar('Something wrong', 'error');
        showSnackbar('Get new conversation of user fail', 'error');
      }
    } else {
      dispatch(
        addNewMessage({ message: newMessage, currentUser: userRef.current })
      );
    }
    showNotification(
      'Missed call',
      () => onClickNotification(payload.message),
      userRef.current,
      'inbound'
    );
 
  }, []);

  const onDispatchInPutAction = useCallback((payload) => {
    dispatch(inputtingMessage(payload));
  }, []);

  const onDispatchStopInPutAction = useCallback((payload) => {
    dispatch(stopInputMessage(payload));
  }, []);

  const onCreateConversation = useCallback((payload) => {
    const messages = payload?.messages || [];
    for (let i = 0; i < messages.length; i++) {
      const message = {
        ...messages[i],
        companyCode: payload?.company
      };
      showNotification(
        payload.lastMessage.type === 'text' ? payload.lastMessage?.text : 'Missed call',
        () => onClickNotification(message),
        userRef.current,
        message.direction
      );
    }
    dispatch(addConversation(payload));
  }, []);

  const onAuthError = useCallback(() => {
    dispatch(signOut);
    localStorage.removeItem('accessToken');
    window.location = '/auth/sign-in';
  }, []);

  useEffect(() => {
    if (statusConnection === 'error') {
      const key = enqueueSnackbar(
        'Sorry, there seems to be an issue with the connection!',
        { variant: 'error', preventDuplicate: true, persist: true }
      );
      snackBarRef.current = key;
    }
  }, [statusConnection]);

  //* add listener event
  const startListenerSocketEvent = useCallback(() => {
    socketClient.current.on('connect', onConnect);

    socketClient.current.on('connect_user', onOtherUserOnline);

    socketClient.current.on('disconnect', onDisconnect);

    socketClient.current.on('disconnect_user', onOtherUserOffline);

    socketClient.current.on('join_room', onOtherUserJoinRoom);

    socketClient.current.on('leave_room', onOtherUserLeaveRoom);

    socketClient.current.on('send_message', onSendMessage); //*active when other user send message success(emit to connections in room except sender)

    socketClient.current.on('send_message_success', onUpdateOutboundMessage); //* active when user send message success (only emit to current connection)

    socketClient.current.on('update_outbound_message', onUpdateOutboundMessage); //* active when RC response

    socketClient.current.on('create_out_bound_message', onSendMessage); //* active when user send message from soft phone to exist customer

    socketClient.current.on('create_conversation', onCreateConversation); //* listener by all connections related with customer

    socketClient.current.on('receive_message', onReceiveInboundMessage); //* listener by connection same room

    socketClient.current.on(
      'receive_message_another_room',
      onReceiveInboundNotifyMiss
    ); //* listener by all connections which relation with customer

    socketClient.current.on(
      'receive_missed_inbound_call',
      onReceiveMissedInboundCall
    ); //* listener by connection same room

    socketClient.current.on('typing', onDispatchInPutAction);

    socketClient.current.on('stop_typing', onDispatchStopInPutAction);

    socketClient.current.on('read_message', onReadMessage);

    socketClient.current.on('send_error', onSendError);

    socketClient.current.on('auth_error', onAuthError);

    socketClient.current.on('connect_error', onConnectError);
  }, []);

  return (
    <Provider
      value={{
        connect,
        disconnect,
        joinRoom,
        leaveRoom,
        sendMessage,
        handelInputNotify,
        handelReadMessage,
        handelStopInputNotify,
        setCompaniesProvider
      }}
      key="contest"
    >
      {children}
    </Provider>
  );
};

export { SocketChatContext, SocketChatProvider };
