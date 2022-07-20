/* eslint-disable prettier/prettier */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { sensitiveOverviewApi } from 'services/apis';

//*thunk action
const getSensitiveOverviews = createAsyncThunk(
  'detect-sensitive/getSensitivesOverview',
  async (data, props) => {
    try {
      const response = await sensitiveOverviewApi.getSensitiveOverview(data);
      const sensitiveOverviews = response.data;
      return {
        firstLoad: data.firstLoad,
        data: sensitiveOverviews
      };
    //   return sensitiveOverviews;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const getAllSensitiveOverviews = createAsyncThunk(
  'detect-sensitive/getAllSensitivesOverview',
  async (props) => {
    try {
      const response = await sensitiveOverviewApi.getAllSensitiveOverview();
      const sensitiveOverviews = response.data;
      return sensitiveOverviews;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const searchSensitiveOverviews = createAsyncThunk(
  'detect-sensitive/searchSensitiveOverviews',
  async (data, props) => {
    try {
      const response = await sensitiveOverviewApi.searchSensitiveOverviews(data);
      const sensitiveOverviews = response.data;
      return {
        firstLoad: data.firstLoad,
        data: sensitiveOverviews
      };
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);
const createSensitiveWord = createAsyncThunk(
  'detect-sensitive/createSensitiveOverviews',
  async (data, props) => {
    try {
      const response = await sensitiveOverviewApi.createSensitiveWord(data);
      const sensitiveOverviews = response.data;
      return sensitiveOverviews;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);
export {
  getSensitiveOverviews,
  getAllSensitiveOverviews,
  searchSensitiveOverviews,
  createSensitiveWord
};
