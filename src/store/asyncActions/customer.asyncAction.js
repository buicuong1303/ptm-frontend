/* eslint-disable prettier/prettier */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { customersApi } from 'services/apis';
import apiStatus from 'utils/apiStatus';

//*thunk action
const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (data, props) => {
    try {
      const response = await customersApi.createCustomer(data.customer);
      const customer = response.data;
      return customer;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const getCustomers = createAsyncThunk(
  'customers/getCustomers',
  async (data, props) => {
    try {
      const response = await customersApi.getCustomers(data.limitItem, data.currentItem, data.searchValue);
      const customers = response.data.customers;
      const totalCustomers = response.data.totalCustomers;
      return { currentItem: data.currentItem, customers: customers, totalCustomers: totalCustomers };
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }, {
    condition: (data, { getState }) => {
      if (getState().customers.status === apiStatus.PENDING) return false;
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);

const getCustomer = createAsyncThunk(
  'customers/getCustomer',
  async (data, props) => {
    try {
      const response = await customersApi.getCustomer(data.customerId);
      const customer = response.data;
      return customer;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async (data, props) => {
    try {
      const response = await customersApi.updateCustomer(
        data.customerId,
        data.customer
      );
      const customer = response.data;
      return customer;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (data, props) => {
    try {
      await customersApi.deleteCustomer(data.customerId);
      const customerId = data.customerId;
      return customerId;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

export {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer
};
