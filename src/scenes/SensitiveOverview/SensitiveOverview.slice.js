/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';

import apiStatus from 'utils/apiStatus';
import { getSensitiveOverviews, searchSensitiveOverviews } from './SensitiveOverview.asyncAction';

//*reducer handle
const sensitiveOverviewSlice = createSlice({
  name: 'sensitiveOverview',
  initialState: {
    status: null,
    message: null,
    backdrop: null,
    sensitiveOverviews: [],
    sensitiveOverview: null,
    manage: {
      hasNext: true,
      pagination: {
        _limit: 0,
        _page: 0,
        _total: 0
      },
      _page: 1,
      _limit: 15
    }
  },
  reducers: {
    clearStateSensitiveOverview: (state, action) => {
      state.status = null;
      state.message = null;
      state.backdrop = null;
      state.sensitiveOverviews = [];
      state.sensitiveOverview = null;
      state.manage = {
        hasNext: true,
        pagination: {
          _limit: 0,
          _page: 0,
          _total: 0
        },
        _page: 1,
        _limit: 15
      };
    },
    resetPagination: (state, action) => {
      state.manage = {
        hasNext: true,
        pagination: {
          _limit: 0,
          _page: 0,
          _total: 0
        },
        _page: 1,
        _limit: 15
      };
    }
  },
  extraReducers: {
    //* get sensitives Overview
    [getSensitiveOverviews.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [getSensitiveOverviews.fulfilled]: (state, action) => {
      const payload = action.payload.data;
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'get sensitives overview success';
      const firstLoad = action.payload.firstLoad;
      //   state.sensitiveOverviews = action.payload;
      if (firstLoad) {
        state.sensitiveOverviews = payload.data;
      } else {
        state.sensitiveOverviews = [...state.sensitiveOverviews, ...payload.data];
      }
      state.manage.pagination = payload.pagination;
      state.manage._page += 1;
      if (
        state.sensitiveOverviews.length === payload.pagination._total ||
        payload.pagination._total === 0
      )
        state.manage.hasNext = false;
    },
    [getSensitiveOverviews.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action?.payload?.error?.message || 'get sensitives overview failed';
    },

    //* get search sensitives Overview
    [searchSensitiveOverviews.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [searchSensitiveOverviews.fulfilled]: (state, action) => {
      const payload = action.payload.data;
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'get sensitives overview success';
      const firstLoad = action.payload.firstLoad;
      //   state.sensitiveOverviews = action.payload;
      if (firstLoad) {
        state.sensitiveOverviews = payload.data;
      } else {
        state.sensitiveOverviews = [...state.sensitiveOverviews, ...payload.data];
      }
      state.manage.pagination = payload.pagination;
      state.manage._page += 1;
      if (
        state.sensitiveOverviews.length === payload.pagination._total ||
        payload.pagination._total === 0
      )
        state.manage.hasNext = false;
    },
    [searchSensitiveOverviews.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action?.payload?.error?.message || 'get sensitives overview failed';
    },
  }
});

const { actions, reducer } = sensitiveOverviewSlice;

const { clearStateSensitiveOverview, resetPagination} = actions;

export { clearStateSensitiveOverview, resetPagination};

export default reducer;
