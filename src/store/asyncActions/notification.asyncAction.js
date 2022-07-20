// import { sessionApi } from 'services/apis';
import { createAsyncThunk } from '@reduxjs/toolkit';
import notificationApi from 'services/apis/notification.api';

//*thunk action
const getTopNotificationsOfUser = createAsyncThunk(
  'notification/getTopNotificationsOfUser',
  // eslint-disable-next-line no-unused-vars
  async (data, props) => {
    try {
      const response = await notificationApi.getNotificationsOfUser(data);

      const notifications = response.data;

      return notifications;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);
const readNotifications = createAsyncThunk(
  'notification/readNotifications',
  // eslint-disable-next-line no-unused-vars
  async (data, props) => {
    try {
      const response = await notificationApi.readNotifications(data);
      const { notificationIds } = data;
      const notifications = {
        affected: response.data.affected,
        notificationIds
      };
      return notifications;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);
const updateNotification = createAsyncThunk(
  'notification/readNotification',
  // eslint-disable-next-line no-unused-vars
  async (data, props) => {
    try {
      await notificationApi.updateNotification(data);
      return data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);
const getAllNotificationsOfUser = createAsyncThunk(
  'notification/getAllNotificationsOfUser',
  // eslint-disable-next-line no-unused-vars
  async (data, props) => {
    try {
      const response = await notificationApi.getNotificationsOfUser(data);
      const resData = response.data;
      return resData;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);
const readAllNotificationsOfUser = createAsyncThunk(
  'notification/readAllNotificationsOfUser',
  // eslint-disable-next-line no-unused-vars
  async (data, props) => {
    try {
      const response = await notificationApi.readAllNotifications(data);
      const resData = response.data;
      return resData;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

export {
  getTopNotificationsOfUser,
  readNotifications,
  updateNotification,
  getAllNotificationsOfUser,
  readAllNotificationsOfUser
};
