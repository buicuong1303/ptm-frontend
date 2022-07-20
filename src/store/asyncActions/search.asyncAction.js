/* eslint-disable no-unused-vars */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { searchApi } from 'services/apis';
export const searchAll = createAsyncThunk(
  'searchAll/searchAll',
  async (data, props) => {
    try {
      const response = await searchApi.searchAll(data);
      return response.data;
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);
export const loadMoreResult = createAsyncThunk(
  'searchAll/loadMoreResult',
  async (data, props) => {
    try {
      const response = await searchApi.loadMoreResult(data);
      return response.data;
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);
export const clearScroll = createAsyncThunk(
  'searchAll/clearScroll',
  async (data, props) => {
    try {
      const response = await searchApi.clearScroll(data);
      return response.data;
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);
