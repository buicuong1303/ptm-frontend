/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import { uz } from 'date-fns/locale';

import {
  getTopNotificationsOfUser,
  readNotifications,
  updateNotification,
  readAllNotificationsOfUser,
  getAllNotificationsOfUser
} from 'store/asyncActions/notification.asyncAction';
import apiStatus from 'utils/apiStatus';
//*reducer handle
const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    status: null,
    message: null,
    topNotifications: [],
    allNotifications: [],
    unread: 0,
    hasNext: true,
    pagination: null,
    page: 1,
    filters: null,
    isReadNotifications: false
  },
  reducers: {
    // eslint-disable-next-line no-unused-vars
    clearStateNotification: (state, action) => {
      state.status = null;
      state.message = null;
      state.notification = [];
    },

    addTopNotifications: (state, action) => {
      if (action.payload) {
        const data = action.payload;

        state.topNotifications = [data, ...state.topNotifications];
        state.unread += 1;
      }
    },
    readAllNotification: (state, action) => {
      state.unread = 0;
      state.topNotifications = state.topNotifications.map((item) => ({
        ...item,
        readStatus: 'read'
      }));
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.page = 1;
      state.hasNext = true;
      state.allNotifications = [];
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setHasNext: (state, action) => {
      state.hasNext = action.payload;
    }
  },
  extraReducers: {
    [getTopNotificationsOfUser.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
    },
    [getTopNotificationsOfUser.fulfilled]: (state, action) => {
      if (action.payload) {
        const { data, unread } = action.payload;
        state.topNotifications = [...state.topNotifications, ...data];
        state.unread = unread;
        state.status = apiStatus.SUCCESS;
        state.message = '';
      }
    },
    [getTopNotificationsOfUser.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.message = action.payload.error?.message;
    },

    [readNotifications.pending]: (state, action) => {
      state.isReadNotifications = true;
      state.status = apiStatus.PENDING;
    },
    [readNotifications.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.isReadNotifications = false;
      const { affected, notificationIds } = action.payload;
      state.unread = state.unread - affected;
      state.topNotifications = state.topNotifications.map((item) => {
        if (notificationIds.includes(item.id)) {
          item.readStatus = 'read';
        }
        return item;
      });
      state.topNotifications = state.topNotifications.sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt)
      );
    },
    [readNotifications.rejected]: (state, action) => {
      state.isReadNotifications = false;
    },
    [updateNotification.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
    },
    [updateNotification.fulfilled]: (state, action) => {
      const data = action.payload;
      state.status = apiStatus.SUCCESS;
      const indexInTopNotifications = state.topNotifications.findIndex(
        (item) => item.id === data.notificationId
      );
      const indexInAllNotifications = state.allNotifications.findIndex(
        (item) => item.id === data.notificationId
      );
      if (data.readStatus === 'read') {
        state.unread -= 1;
        if (indexInTopNotifications > -1) {
          state.topNotifications[indexInTopNotifications] = {
            ...state.topNotifications[indexInTopNotifications],
            readStatus: 'read'
          };
        }
        if (indexInAllNotifications > -1) {
          state.allNotifications[indexInAllNotifications] = {
            ...state.allNotifications[indexInAllNotifications],
            readStatus: 'read'
          };
        }
      } else {
        state.unread += 1;
        if (indexInTopNotifications > -1) {
          state.topNotifications[indexInTopNotifications] = {
            ...state.topNotifications[indexInTopNotifications],
            readStatus: 'unread'
          };
        }
        if (indexInAllNotifications > -1) {
          state.allNotifications[indexInAllNotifications] = {
            ...state.allNotifications[indexInAllNotifications],
            readStatus: 'unread'
          };
        }
      }
    },

    [getAllNotificationsOfUser.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
    },
    [getAllNotificationsOfUser.fulfilled]: (state, action) => {
      const payload = action.payload;
      state.status = apiStatus.SUCCESS;
      state.allNotifications = [...state.allNotifications, ...payload.data];
      state.pagination = payload.pagination;
      state.page += 1;
      if (
        state.allNotifications.length === payload.pagination._total ||
        payload.pagination._total === 0
      )
        state.hasNext = false;
    },
    [readAllNotificationsOfUser.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
    },
    [readAllNotificationsOfUser.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.unread = 0;
      state.topNotifications = state.topNotifications.map((item) => ({
        ...item,
        readStatus: 'read'
      }));
      state.allNotifications = state.allNotifications.map((item) => ({
        ...item,
        readStatus: 'read'
      }));
    }
  }
});

const { actions, reducer } = notificationSlice;

const {
  clearStateNotification,
  addTopNotifications,
  setNotifications,
  setPage,
  readAllNotification,
  setFilters,
  setHasNext
} = actions;

export {
  clearStateNotification,
  addTopNotifications,
  setNotifications,
  setPage,
  readAllNotification,
  setFilters,
  setHasNext
};

export default reducer;
