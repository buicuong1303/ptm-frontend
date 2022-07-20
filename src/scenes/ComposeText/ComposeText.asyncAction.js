import { createAsyncThunk } from '@reduxjs/toolkit';
import { customerApi, messageApi, signatureApi } from 'services/apis';
import apiStatus from 'utils/apiStatus';

const getCustomersComposeText = createAsyncThunk(
  'customer/getCustomersComposeText',
  async (data, props) => {
    try {
      const response = await customerApi.getCustomersComposeText(data);
      const dataRes = response.data;
      return dataRes;
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

const validateCustomerCampaign = createAsyncThunk(
  'customer/validateCustomerCampaign',
  async (data, props) => {
    try {
      const response = await customerApi.validateCustomerCampaign(data);
      const dataRes = response.data;
      return dataRes;
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

const sendComposeText = createAsyncThunk(
  'customer/sendComposeText',
  async (data, props) => {
    try {
      const response = await messageApi.sendComposeText(data);
      const dataRes = response.data;
      return dataRes;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().message.status === apiStatus.PENDING) {
        return false;
      }
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);
const getSignaturesActive = createAsyncThunk(
  'compose-text/getListSignatureActive',
  async (data, props) => {
    try {
      const res = await signatureApi.getSignaturesActive();
      return res.data;
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);
export {
  getCustomersComposeText,
  sendComposeText,
  getSignaturesActive,
  validateCustomerCampaign
};
