/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import apiStatus from 'utils/apiStatus';
import {
  getDashBoard,
  getLastContactCustomers,
  getMoreLastContactCustomers
} from './DashBoard.asyncAction';
const dashBoardSlice = createSlice({
  name: 'dashBoard',
  initialState: {
    status: null,
    message: null,
    statisticalTables: null,
    backdrop: null,
    lastContactCustomers: [],
    barChart: [],
    pieChart: [],
    pagination: {
      total: 0,
      limit: 5,
      currentItems: 0,
      hasNext: true
    }
  },
  reducers: {
    clearDashBoardState: (state, action) => {
      state.status = null;
      state.message = null;
      state.backdrop = null;
      state.pagination = {
        total: 0,
        limit: 5,
        currentItems: 0,
        hasNext: true
      };
      state.lastContactCustomers = [];
    }
  },
  extraReducers: {
    [getDashBoard.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [getDashBoard.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      const { barChart, pieChart, ...rest } = action.payload;
      state.barChart = action.payload.barChart;
      state.pieChart = action.payload.pieChart;
      state.statisticalTables = rest;
      // state.messagesTable = action.payload.tableMessages.messages;
      // state.messagesTable = state.messagesTable.concat(
      //   action.payload.tableMessages.messages
      // );
      // state.totalCustomer = action.payload.tableMessages.totalCustomers;

      // state.message = 'Get dash board success';
    },
    [getDashBoard.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action?.payload?.error?.message || 'Get dashboard failed';
    },

    [getLastContactCustomers.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
      state.lastContactCustomers = [];
      state.pagination.currentItems = 0;
      state.pagination.total = 0;
    },
    [getLastContactCustomers.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.lastContactCustomers = action.payload.data;

      state.pagination = {
        ...action.payload.pagination,
        currentItems: state.lastContactCustomers.length
      };
      if (state.pagination.total === state.lastContactCustomers.length)
        state.pagination.hasNext = false;
      else {
        state.pagination.hasNext = true;
      }
    },
    [getLastContactCustomers.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
    },

    [getMoreLastContactCustomers.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [getMoreLastContactCustomers.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.lastContactCustomers = [
        ...state.lastContactCustomers,
        ...action.payload.data
      ];
      state.pagination = {
        ...action.payload.pagination,
        currentItems: state.lastContactCustomers.length
      };
      if (state.pagination.total === state.lastContactCustomers.length)
        state.pagination.hasNext = false;
    },
    [getMoreLastContactCustomers.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
    }
  }
});
const { reducer, actions } = dashBoardSlice;
const { clearDashBoardState } = actions;
export { clearDashBoardState };
export default reducer;
