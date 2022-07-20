/* eslint-disable no-unused-vars */
import { createAsyncThunk } from '@reduxjs/toolkit';
import logActivityApi from 'services/apis/logActivity.api';
import apiStatus from 'utils/apiStatus';

const getLogActivities = createAsyncThunk(
  'logActivity/getLogActivities',
  async (data, props) => {
    try {
      const response = await logActivityApi.getLogActivities(data);
      return response.data;
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

export { getLogActivities };
