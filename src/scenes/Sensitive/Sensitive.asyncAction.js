/* eslint-disable prettier/prettier */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { sensitiveApi } from 'services/apis';

//*thunk action
const getSensitives = createAsyncThunk(
  'signature/getSensitives',
  async (props) => {
    try {
      const response = await sensitiveApi.getSensitive();
      const sensitives = response.data;
      return sensitives;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const updateSensitives = createAsyncThunk(
  'signature/updateSensitives',
  async (data, props) => {
    try {
      const response = await sensitiveApi.updateSensitive(data);
      const sensitives = response.data;
      return sensitives;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const createSensitives = createAsyncThunk(
  'signature/createSensitives',
  async (data, props) => {
    try {
      const response = await sensitiveApi.createSensitive(data);
      const sensitives = response.data;
      return sensitives;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const deleteSensitives = createAsyncThunk(
  'signature/deleteSensitives',
  async (data, props) => {
    try {
      const response = await sensitiveApi.deleteSensitive(data);
      const sensitives = response.data;
      return sensitives;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

export {
  getSensitives,
  updateSensitives,
  createSensitives,
  deleteSensitives
};
