import { createAsyncThunk } from '@reduxjs/toolkit';
import { groupApi } from 'services/apis';
import apiStatus from 'utils/apiStatus';

//*thunk action
export const createGroup = createAsyncThunk(
  'group/createGroup',
  async (data, props) => {
    try {
      const response = await groupApi.createGroup(data);
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

export const getGroup = createAsyncThunk(
  'group/getGroup',
  async (data, props) => {
    try {
      const response = await groupApi.getGroup();
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

export const getCustomersInGroup = createAsyncThunk(
  'group/getCustomersInGroup',
  async (data, props) => {
    try {
      const response = await groupApi.getCustomersInGroup(data);
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

export const changeStatusGroupCustomer = createAsyncThunk(
  'group/changeStatusGroupCustomer',
  async (data, props) => {
    try {
      const response = await groupApi.changeStatusGroupCustomer(data);
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

export const readFile = createAsyncThunk(
  'group/readFile',
  async (data, props) => {
    try {
      const response = await groupApi.readFile(data.file, data.groupId);
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

export const addCustomersToGroup = createAsyncThunk(
  'group/addCustomersToGroup',
  async (data, props) => {
    try {
      const response = await groupApi.addCustomersToGroup(data);
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

export const deleteGroup = createAsyncThunk(
  'group/deleteGroup',
  async (data, props) => {
    try {
      const response = await groupApi.deleteGroup(data);
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

export const deleteCustomerInGroup = createAsyncThunk(
  'group/deleteCustomerInGroup',
  async (data, props) => {
    try {
      const response = await groupApi.deleteCustomerInGroup(data);
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

export const updateGroup = createAsyncThunk(
  'group/updateGroup',
  async (data, props) => {
    try {
      const response = await groupApi.updateGroup(data);
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
