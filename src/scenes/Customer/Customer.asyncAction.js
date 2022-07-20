/* eslint-disable no-unused-vars */
/* eslint-disable no-unreachable */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { customerApi } from 'services/apis';
import apiStatus from 'utils/apiStatus';
import compareCampaignCustomer from 'utils/compareCampaignCustomer';
import compareCompanyCustomer from 'utils/compareCompanyCustomer';

//*thunk action
const createCustomer = createAsyncThunk(
  'customer/createCustomer',
  async (data, props) => {
    try {
      const { newCustomer } = cloneDeep(data);

      const oldCompanyCustomer = newCustomer.companyCustomers;
      const newCompanyCustomers = newCustomer.newCompanyCustomers;
      const companyCustomerNeedUpdate =
        compareCompanyCustomer(oldCompanyCustomer, newCompanyCustomers) || [];

      const oldCampaignCustomer = newCustomer.campaignCustomers;
      const newCampaignCustomers = newCustomer.newCampaignCustomers;
      const campaignCustomerNeedUpdate =
        compareCampaignCustomer(oldCampaignCustomer, newCampaignCustomers) ||
        [];

      const dataToCreate = {
        companyCustomers: companyCustomerNeedUpdate,
        campaignCustomers: campaignCustomerNeedUpdate,
        fullName: newCustomer.fullName ? newCustomer.fullName.trim() : '',
        emailAddress: newCustomer.emailAddress
          ? newCustomer.emailAddress.trim()
            ? newCustomer.emailAddress.trim()
            : null
          : null,
        phoneNumber: newCustomer.phoneNumber
          ? newCustomer.phoneNumber.trim()
          : '',
        status: newCustomer.status
      };

      const response = await customerApi.createCustomer(dataToCreate);
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
  'customer/getCustomers',
  async (data, props) => {
    try {
      const response = await customerApi.getCustomers(data);
      const customers = response.data.customers;
      const totalCustomers = response.data.totalCustomers;
      return {
        currentItem: data.currentItem,
        customers: customers,
        totalCustomers: totalCustomers
      };
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().customer.status === apiStatus.PENDING) {
        return false;
      }
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);

const getCustomer = createAsyncThunk(
  'customer/getCustomer',
  async (data, props) => {
    try {
      const response = await customerApi.getCustomer(data.customerId);
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
  'customer/updateCustomer',
  async (data, props) => {
    try {
      const { customerId, newCustomer } = data;

      const oldCompanyCustomer = newCustomer.companyCustomers;
      const newCompanyCustomers = newCustomer.newCompanyCustomers;
      const companyCustomerNeedUpdate = compareCompanyCustomer(
        oldCompanyCustomer,
        newCompanyCustomers
      );

      const oldCampaignCustomer = newCustomer.campaignCustomers;
      const newCampaignCustomers = newCustomer.newCampaignCustomers;

      const campaignCustomerNeedUpdate = compareCampaignCustomer(
        oldCampaignCustomer,
        newCampaignCustomers
      );

      const dataToUpdate = {
        companyCustomers: companyCustomerNeedUpdate || [],
        campaignCustomers: campaignCustomerNeedUpdate || [],
        fullName: newCustomer.fullName ? newCustomer.fullName.trim() : '',
        emailAddress: newCustomer.emailAddress
          ? newCustomer.emailAddress.trim()
            ? newCustomer.emailAddress.trim()
            : null
          : null,
        phoneNumber: newCustomer.phoneNumber
          ? newCustomer.phoneNumber.trim()
          : '',
        status: newCustomer.status
      };

      const response = await customerApi.updateCustomer(
        customerId,
        dataToUpdate
      );
      const customerResponse = response.data;

      return customerResponse;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const deleteCustomer = createAsyncThunk(
  'customer/deleteCustomer',
  async (data, props) => {
    try {
      await customerApi.deleteCustomer(data.customerId);
      const customerId = data.customerId;
      return customerId;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const readFile = createAsyncThunk(
  'customer/readFile',
  async (data, props) => {
    try {
      const response = await customerApi.readFile(data.file);
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().group.status === apiStatus.PENDING) return false;
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);

const addCustomerFromFileExcel = createAsyncThunk(
  'customer/addCustomerFromFileExcel',
  async (data, props) => {
    try {
      // console.log(data);
      const response = await customerApi.addCustomerFromExcel(data);
      // console.log(response.data);
      // return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().group.status === apiStatus.PENDING) return false;
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);
export {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  readFile,
  addCustomerFromFileExcel
};
