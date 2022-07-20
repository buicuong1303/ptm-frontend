/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import apiStatus from 'utils/apiStatus';
import {
  createCompany,
  deleteCompany,
  getCompanies,
  updateCompany
} from './Company.asyncAction';

const companySlice = createSlice({
  initialState: {
    companies: [],
    status: null,
    message: null,
    backdrop: null
  },
  name: 'company',
  reducers: {
    clearState: (state, action) => {
      state.status = null;
      state.backdrop = null;
      state.message = null;
    }
  },
  extraReducers: {
    [getCompanies.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
      state.message = null;
    },
    [getCompanies.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.companies = action.payload;
    },
    [getCompanies.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action.payload?.error?.message || 'Get company failed';
    },

    [createCompany.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
      state.message = null;
    },
    [createCompany.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Create company success';
      state.companies = [...state.companies, action.payload];
    },
    [createCompany.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;

      let message;
      try {
        message = JSON.parse(action.payload?.error?.message);
      } catch (error) {
        message = null;
      }

      if (message?.error) {
        state.message = message.error;
      } else {
        state.message =
          action.payload?.error?.message || 'Create company failed';
      }
    },

    [updateCompany.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
      state.message = null;
    },
    [updateCompany.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Update company success';
      const indexCompany = state.companies.findIndex(
        (item) => item.id === action.payload.id
      );
      state.companies[indexCompany] = action.payload;
    },
    [updateCompany.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;

      let message;
      try {
        message = JSON.parse(action.payload?.error?.message);
      } catch (error) {
        message = null;
      }

      if (message?.error) {
        state.message = message.error;
      } else {
        state.message =
          action.payload?.error?.message || 'Update company failed';
      }
    },

    [deleteCompany.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
      state.message = null;
    },
    [deleteCompany.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Delete company success';
      const indexCompany = state.companies.findIndex(
        (item) => item.id === action.payload.id
      );
      state.companies.splice(indexCompany, 1);
    },
    [deleteCompany.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action.payload?.error?.message || 'Delete company failed';
    }
  }
});
const { reducer, actions } = companySlice;
const { clearState } = actions;
export { clearState };
export default reducer;
