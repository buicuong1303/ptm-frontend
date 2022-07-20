/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import { getLogActivities } from './LogActivity.asyncAction';
import apiStatus from 'utils/apiStatus';
import * as _ from 'lodash';

//*reducer handle
const logActivitySlice = createSlice({
  name: 'logActivity',
  initialState: {
    status: null,
    message: null,
    backdrop: null,
    logActivities: [],
    totalLogActivities: null
  },
  reducers: {
    clearStateLogActivities: (state, action) => {
      state.status = null;
      state.message = null;
      state.backdrop = null;
      state.logActivities = [];
      state.totalLogActivities = null;
    }
  },
  extraReducers: {
    //* get logActivities
    [getLogActivities.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [getLogActivities.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.message = 'Get log activities success';
      state.backdrop = null;

      if (action.payload.currentItem === 0) {
        state.logActivities = [...action?.payload?.records];
        state.totalLogActivities = action?.payload?.totalLogActivities;
      } else {
        state.logActivities = [
          ...state.logActivities,
          ...action?.payload?.records
        ];
        state.totalLogActivities = action?.payload?.totalLogActivities;
      }
    },
    [getLogActivities.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.message =
        action?.payload?.error?.message || 'Get log activities failed';
      state.backdrop = null;
    }
  }
});

const { actions, reducer } = logActivitySlice;

const { clearStateLogActivities } = actions;

export { clearStateLogActivities };

export default reducer;
