/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import apiStatus from 'utils/apiStatus';
import {
  createScheduleMessage,
  deleteScheduleMessage,
  updateScheduleMessage,
  getScheduleMessages,
  validateScheduleMessage,
  getPullingScheduleMessages
} from './ScheduleMessage.asyncAction';

const scheduleMessageSlice = createSlice({
  name: 'schedule',
  initialState: {
    status: null,
    message: null,
    backdrop: null,
    validateSchedule: {
      validated: false,
      fileName: '',
      invalidPhoneNumber: [],
      optOutPhoneNumber: []
    },
    schedules: [],
    manage: {
      hasNext: true,
      pagination: null,
      _page: 1,
      _limit: 15
    }
  },
  reducers: {
    clearStateSchedule: (state, action) => {
      state.status = null;
      state.message = null;
      state.backdrop = null;
      state.validateSchedule = {
        validated: false,
        fileName: '',
        invalidPhoneNumber: [],
        optOutPhoneNumber: []
      };
    },
    resetFilters: (state, action) => {
      state.manage = {
        hasNext: true,
        _page: 1,
        _limit: 15
      };
    },
    clearStateValidateSchedule: (state, action) => {
      state.backdrop = null;
      state.validateSchedule = {
        fileName: '',
        validated: false,
        invalidPhoneNumber: [],
        optOutPhoneNumber: []
      };
    },
    updateScheduleStatus: (state, action) => {
      state.backdrop = null;
      const { id, status } = action.payload;
      const indexSchedule = state.schedules.findIndex(
        (scheduleMessage) => scheduleMessage.id === id
      );
      state.schedules[indexSchedule] = {
        ...state.schedules[indexSchedule],
        sendStatus: status
      };
    },
    trackScheduleMessage: (state, action) => {
      state.backdrop = null;
      const { scheduleMessageId, currentSentMessages, totalMessages } =
        action.payload;
      const index = state.schedules.findIndex((item) => {
        if (
          item.id === scheduleMessageId ||
          (item.backup && item.backup.id === scheduleMessageId)
        ) {
          return true;
        }
      });
      if (index < 0) return;
      if (state.schedules[index].id === scheduleMessageId) {
        state.schedules[index] = {
          ...state.schedules[index],
          totalMessages,
          currentSentMessages
        };
      }
      if (
        state.schedules[index].backup &&
        state.schedules[index].backup.id === scheduleMessageId
      ) {
        let newScheduleBackup = state.schedules[index].backup;
        newScheduleBackup = {
          ...newScheduleBackup,
          currentSentMessagesChild: currentSentMessages,
          totalMessagesChild: totalMessages
        };
        state.schedules[index] = {
          ...state.schedules[index],
          backup: newScheduleBackup
        };
      }
    }
  },
  extraReducers: {
    [validateScheduleMessage.pending]: (state, action) => {
      state.backdrop = apiStatus.PENDING;
      state.status = apiStatus.PENDING;
    },
    [validateScheduleMessage.fulfilled]: (state, action) => {
      state.backdrop = null;
      state.status = apiStatus.SUCCESS;
      state.validateSchedule = {
        validated: true,
        fileName: action.payload?.fileName || '',
        invalidPhoneNumber:
          action.payload?.invalidPhoneNumber?.length > 0
            ? action.payload?.invalidPhoneNumber
            : [],
        optOutPhoneNumber:
          action.payload?.optOutPhoneNumber?.length > 0
            ? action.payload?.optOutPhoneNumber
            : []
      };
      state.message = 'Validate schedule success';
    },
    [validateScheduleMessage.rejected]: (state, action) => {
      state.backdrop = null;
      state.status = apiStatus.ERROR;
      state.message = action.payload
        ? action.payload.error.message
        : 'Validate schedules failed';
    },

    [createScheduleMessage.pending]: (state, action) => {
      state.backdrop = apiStatus.PENDING;
      state.status = apiStatus.PENDING;
    },
    [createScheduleMessage.fulfilled]: (state, action) => {
      state.backdrop = null;
      state.status = apiStatus.SUCCESS;
      state.message = 'Create schedule success';
    },
    [createScheduleMessage.rejected]: (state, action) => {
      state.backdrop = null;
      state.status = apiStatus.ERROR;
      state.message = action.payload
        ? action.payload.error.message
        : 'Create schedules failed';
    },

    [deleteScheduleMessage.fulfilled]: (state, action) => {
      const id = action.payload;
      const index = state.schedules.findIndex((item) => item.id === id);
      state.schedules = [
        ...state.schedules.slice(0, index),
        ...state.schedules.slice(index + 1)
      ];
    },

    [updateScheduleMessage.pending]: (state, action) => {
      state.backdrop = apiStatus.PENDING;
      state.status = apiStatus.PENDING;
    },
    [updateScheduleMessage.fulfilled]: (state, action) => {
      state.backdrop = null;
      state.status = apiStatus.SUCCESS;
      state.message = 'Update schedule success';
    },
    [updateScheduleMessage.rejected]: (state, action) => {
      state.backdrop = null;
      state.status = apiStatus.ERROR;
      state.message = action.payload.error
        ? action.payload.error.message
        : 'Update schedules failed';
    },

    [getScheduleMessages.pending]: (state, action) => {
      state.backdrop = apiStatus.PENDING;
      state.status = apiStatus.PENDING;
    },
    [getScheduleMessages.fulfilled]: (state, action) => {
      state.backdrop = null;
      const payload = action.payload.data;
      const firstLoad = action.payload.firstLoad;
      state.status = apiStatus.SUCCESS;
      if (firstLoad) {
        state.schedules = payload.data;
      } else {
        state.schedules = [...state.schedules, ...payload.data];
      }
      state.manage.pagination = payload.pagination;
      state.manage._page += 1;
      if (
        state.schedules.length === payload.pagination._total ||
        payload.pagination._total === 0
      )
        state.manage.hasNext = false;
    },
    [getScheduleMessages.rejected]: (state, action) => {
      state.backdrop = null;
      state.status = apiStatus.ERROR;
      state.message = action.payload
        ? action.payload.error.message
        : 'Get schedules failed';
    },

    //* get Pulling schedules messages
    [getPullingScheduleMessages.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
    },
    [getPullingScheduleMessages.fulfilled]: (state, action) => {
      const payload = action.payload;
      state.status = apiStatus.SUCCESS;
      state.schedules = payload;
    },
    [getPullingScheduleMessages.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.message = action.payload
        ? action.payload.error.message
        : 'Get Pulling schedules failed';
    }
  }
});
const { reducer, actions } = scheduleMessageSlice;
const {
  clearStateSchedule,
  clearStateValidateSchedule,
  updateScheduleStatus,
  trackScheduleMessage,
  resetFilters
} = actions;
export {
  clearStateSchedule,
  clearStateValidateSchedule,
  updateScheduleStatus,
  trackScheduleMessage,
  resetFilters
};
export default reducer;
