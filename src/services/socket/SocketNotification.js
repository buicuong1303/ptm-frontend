import React, { createContext, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import socketIOClient from 'socket.io-client';
import { NOTIFICATION_NAMESPACE_URL } from './config';
import { updateUserOnlineStatus } from 'store/slices/userOnline.slice';
import { addTopNotifications } from 'store/slices/notification.slice';
import { trackScheduleMessage } from 'scenes/ScheduleMessage/ScheduleMessage.slice';
import { updateConversation } from '../../scenes/Message/Message.slice';
const SocketNotificationContext = createContext(null);
const { Provider } = SocketNotificationContext;

const SocketNotificationProvider = ({ children }) => {
  const socketClient = useRef(null);

  const dispatch = useDispatch();

  const connect = useCallback(() => {
    const accessToken = localStorage.getItem('accessToken');
    socketClient.current = socketIOClient(NOTIFICATION_NAMESPACE_URL, {
      query: { token: accessToken },
      path: `${window._env_.REACT_APP_SOCKET_PATH}/socket.io`
    });

    startListenerSocketEvent();
  }, []);

  const emitUpdateConversation = useCallback((payload) => {
    const { type, conversationUpdated, company } = payload;
    // console.log(conversationUpdated);
    socketClient.current.emit('update_conversation', {
      type,
      company,
      conversationUpdated
    });
  }, []);

  const emitUpdateConversations = useCallback((payload) => {
    const { type, conversationUpdated, company } = payload;
    socketClient.current.emit('update_conversations', {
      type,
      company,
      conversationUpdated
    });
  }, []);

  //* emit event
  const disconnect = useCallback(() => {
    socketClient.current.disconnect();
  }, []);

  const onUserOnline = useCallback((payload) => {
    if (payload) dispatch(updateUserOnlineStatus(payload));
  }, []);

  const onUserOffline = useCallback((payload) => {
    if (payload) dispatch(updateUserOnlineStatus(payload));
  }, []);

  const onPushNotification = useCallback((payload) => {
    dispatch(addTopNotifications(payload));
  }, []);

  const onTrackingMessage = useCallback((payload) => {
    dispatch(trackScheduleMessage(payload));
  }, []);

  const onUpdateConversation = useCallback((payload) => {
    const { conversationUpdated: conversation, company } = payload;
    // console.log(conversation);
    dispatch(updateConversation({ company, conversation }));
  }, []);

  //* add listener event
  const startListenerSocketEvent = useCallback(() => {
    socketClient.current.on('user_online', onUserOnline);
    socketClient.current.on('user_offline', onUserOffline);
    socketClient.current.on('push_notification', onPushNotification);
    socketClient.current.on('track_schedule_message', onTrackingMessage);
    socketClient.current.on('update_conversation', onUpdateConversation);
  }, []);

  return (
    <Provider
      value={{
        connect,
        disconnect,
        emitUpdateConversation,
        emitUpdateConversations
      }}
    >
      {children}
    </Provider>
  );
};

export { SocketNotificationContext, SocketNotificationProvider };
