import { createAsyncThunk } from '@reduxjs/toolkit';
import { companyApi } from 'services/apis';
import apiStatus from 'utils/apiStatus';

//*thunk action
export const createCompany = createAsyncThunk(
  'signature/createCompany',
  async (data, props) => {
    try {
      const response = await companyApi.createCompany(data);
      const company = response.data;
      return company;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().company.status === apiStatus.PENDING) return false;
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);

export const updateCompany = createAsyncThunk(
  'signature/updateCompany',
  async (data, props) => {
    try {
      const response = await companyApi.updateCompany(data);
      const company = response.data;
      return company;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().company.status === apiStatus.PENDING) return false;
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);

export const deleteCompany = createAsyncThunk(
  'signature/deleteCompany',
  async (data, props) => {
    try {
      const response = await companyApi.deleteCompany(data);
      const signature = response.data;
      return signature;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().company.status === apiStatus.PENDING) return false;
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);

export const getCompanies = createAsyncThunk(
  'signature/getCompanies',
  async (data, props) => {
    try {
      const response = await companyApi.getCompanies();
      const companies = response.data;
      return companies;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().company.status === apiStatus.PENDING) return false;
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);
