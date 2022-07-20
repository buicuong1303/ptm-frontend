import { createAsyncThunk } from '@reduxjs/toolkit';
import { campaignApi, optSuggestionApi } from 'services/apis';

//*thunk action
const getOptSuggestions = createAsyncThunk(
  'optSuggestion/getOptSuggestions',
  async (data, props) => {
    try {
      const response = await optSuggestionApi.getOptSuggestions(data);
      const optSuggestions = response.data.optSuggestions;
      const totalSuggestions = response.data.totalSuggestions;
      return {
        currentItem: data.currentItem,
        optSuggestions: optSuggestions,
        totalSuggestions: totalSuggestions
      };
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const updateOptSuggestion = createAsyncThunk(
  'optSuggestion/updateOptSuggestion',
  async (data, props) => {
    try {
      const response = await optSuggestionApi.updateOptSuggestion(data);
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const getCampaigns = createAsyncThunk(
  'optSuggestion/getCampaign',
  async (props) => {
    try {
      const response = await campaignApi.getCampaigns();
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);
const createOptSuggestion = createAsyncThunk(
  'optSuggestion/createOptSuggestion',
  async (data, props) => {
    try {
      const response = await optSuggestionApi.createOptSuggestion(data);
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const updateReasonOptSuggestion = createAsyncThunk(
  'optSuggestion/updateReasonOptSuggestion',
  async (data, props) => {
    try {
      const response = await optSuggestionApi.updateReasonOptSuggestion(data);
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

export {
  getOptSuggestions,
  updateOptSuggestion,
  getCampaigns,
  createOptSuggestion,
  updateReasonOptSuggestion
};
