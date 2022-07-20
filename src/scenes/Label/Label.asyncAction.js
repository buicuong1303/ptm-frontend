import { createAsyncThunk } from '@reduxjs/toolkit';
import { labelApi } from 'services/apis';
const createLabel = createAsyncThunk(
  'label/createLabel',
  async (data, props) => {
    try {
      const result = await labelApi.createLabel(data);
      return result.data;
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);
const getLabels = createAsyncThunk('label/getLabels', async (data, props) => {
  try {
    const result = await labelApi.getLabels();
    return result.data;
  } catch (error) {
    const newError = { ...error };
    const payload = { error: newError.response.data };
    return props.rejectWithValue(payload);
  }
});
const getLabel = createAsyncThunk('label/getLabel', async (data, props) => {
  try {
    const result = await labelApi.getLabel(data);
    return result.data;
  } catch (error) {
    const newError = { ...error };
    const payload = { error: newError.response.data };
    return props.rejectWithValue(payload);
  }
});
const updateLabel = createAsyncThunk(
  'label/updateLabel',
  async (data, props) => {
    try {
      const { id, ...rest } = data;
      const result = await labelApi.updateLabel(id, rest);
      return result.data;
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);
const deleteLabel = createAsyncThunk(
  'label/deleteLabel',
  async (data, props) => {
    try {
      const result = await labelApi.deleteLabel(data);
      return result.data;
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);
export { createLabel, getLabels, getLabel, updateLabel, deleteLabel };
