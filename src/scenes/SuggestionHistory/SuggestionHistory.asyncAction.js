import { createAsyncThunk } from '@reduxjs/toolkit';
import { optSuggestionApi } from 'services/apis';

//*thunk action
const getSuggestionsHistory = createAsyncThunk(
  'suggestionHistory/getSuggestionsHistory',
  async (data, props) => {
    try {
      const response = await optSuggestionApi.getSuggestionHistory(data);
      const suggestionsHistory = response.data.suggestionsHistory;
      const totalSuggestions = response.data.totalSuggestions;
      return {
        currentItem: data.currentItem,
        suggestionsHistory: suggestionsHistory,
        totalSuggestions: totalSuggestions
      };
      // return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const getSuggestionsHistoryDetail = createAsyncThunk(
  'suggestionHistory/getSuggestionsHistoryDetail',
  async (data, props) => {
    try {
      const response = await optSuggestionApi.getSuggestionHistoryDetail(data);
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

export { getSuggestionsHistory, getSuggestionsHistoryDetail };
