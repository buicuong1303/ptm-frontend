/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  readFile,
  addCustomerFromFileExcel
} from './Customer.asyncAction';
import apiStatus from 'utils/apiStatus';
import * as _ from 'lodash';

//*reducer handle
const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    status: null,
    error: null,
    message: null,
    backdrop: null,
    customers: [],
    totalCustomers: null,
    customer: null,
    searchValues: '',
    activeStatus: null,
    listCustomerToCheck: [],
    listError: []
  },
  reducers: {
    clearStateCustomer: (state, action) => {
      state.status = null;
      state.error = null;
      state.message = null;
      state.backdrop = null;
      state.customers = [];
      state.totalCustomers = null;
      state.customer = null;
      state.searchValues = '';
      state.listCustomerToCheck = [];
      state.listError = [];
    },
    updateSearchValues: (state, action) => {
      state.searchValues = action.payload;
    },
    clearSearchValues: (state, action) => {
      state.searchValues = '';
    },
    clearStateDialog: (state, action) => {
      state.status = null;
      state.backdrop = null;
      state.message = null;
      state.listCustomerToCheck = [];
    }
  },
  extraReducers: {
    //* create customer
    [createCustomer.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
      state.activeStatus = apiStatus.PENDING;
    },
    [createCustomer.fulfilled]: (state, action) => {
      state.activeStatus = apiStatus.SUCCESS;
      state.backdrop = null;
      state.status = apiStatus.SUCCESS;
      state.message = 'Create client success';
      state.error = null;
      if (action.payload) {
        state.customers = [action.payload, ...state.customers];
        state.totalCustomers += 1;
      }
    },
    [createCustomer.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = null;
      state.error =
        action?.payload?.error?.message || 'Customer creation failed';
    },

    //* get customers
    [getCustomers.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [getCustomers.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.message = 'Get customers success';
      state.error = null;
      state.backdrop = null;

      if (action.payload.currentItem === 0) {
        state.customers = [...action.payload.customers];
        state.totalCustomers = action.payload.totalCustomers;
      } else {
        state.customers = [...state.customers, ...action.payload.customers];
        state.totalCustomers = action.payload.totalCustomers;
      }
    },
    [getCustomers.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;

      state.message = null;
      state.backdrop = null;
      state.error = action?.payload?.error?.message || 'Get customers failed';
    },

    //* get customer
    [getCustomer.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
    },
    [getCustomer.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.message = 'Get client success';
      state.error = null;
      state.customer = action.payload;
    },
    [getCustomer.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.message = null;
      state.error = action?.payload?.error?.message || 'Get customer failed';
    },

    //* update customer
    [updateCustomer.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
      state.activeStatus = apiStatus.PENDING;
    },
    [updateCustomer.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.activeStatus = apiStatus.SUCCESS;
      state.message = 'Update client success';
      state.error = null;
      if (action.payload) {
        const indexCustomerUpdate = state.customers
          .map((item) => item.id)
          .indexOf(action.payload.id);

        state.customers[indexCustomerUpdate] = {
          ...state.customers[indexCustomerUpdate],
          ..._.omit(action.payload, ['companyCustomers', 'campaignCustomers'])
        };

        action.payload.companyCustomers.map((item) => {
          const indexCompanyCustomer = state.customers[
            indexCustomerUpdate
          ].companyCustomers
            .map((companyCustomer) => companyCustomer.id)
            .indexOf(item.id);

          if (indexCompanyCustomer !== -1)
            state.customers[indexCustomerUpdate].companyCustomers[
              indexCompanyCustomer
            ] = item;
          else
            state.customers[indexCustomerUpdate].companyCustomers = [
              ...state.customers[indexCustomerUpdate].companyCustomers,
              item
            ];
        });

        state.customers[indexCustomerUpdate].campaignCustomers =
          action.payload.campaignCustomers;
      }
    },
    [updateCustomer.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = null;
      state.error = action?.payload?.error?.message || 'Update customer failed';
    },

    //* delete customer
    [deleteCustomer.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [deleteCustomer.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Delete client success';
      state.error = null;
      if (action.payload) {
        const indexRemover = state.customers
          .map((item) => item.id)
          .indexOf(action.payload);
        state.customers.splice(indexRemover, 1);
        state.totalCustomers -= 1;
      }
    },
    [deleteCustomer.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = null;
      state.error = action?.payload?.error?.message || 'Delete customer failed';
    },

    //*Read file
    [readFile.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
      state.message = null;
    },
    [readFile.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'File read success';
      state.listCustomerToCheck = action.payload.data;
      state.listError = action.payload.listError;
    },
    [readFile.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action.payload?.error?.message || 'File reading failed';
    },

    //*Update Client from file excel
    [addCustomerFromFileExcel.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
      state.message = null;
    },
    [addCustomerFromFileExcel.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Update client success';
    },
    [addCustomerFromFileExcel.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action.payload?.error?.message || 'Update client failed';
    }
  }
});

const { actions, reducer } = customerSlice;

const {
  clearStateCustomer,
  updateSearchValues,
  clearSearchValues,
  clearStateDialog
} = actions;

export {
  clearStateCustomer,
  updateSearchValues,
  clearSearchValues,
  clearStateDialog
};

export default reducer;
