/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import apiStatus from 'utils/apiStatus';
import {
  getSuggestionsHistory,
  getSuggestionsHistoryDetail
} from './SuggestionHistory.asyncAction';

//*reducer handle
const SuggestionHistorySlice = createSlice({
  name: 'suggestionHistory',
  initialState: {
    status: null,
    error: null,
    message: null,
    backdrop: null,
    suggestionsHistory: [],
    suggestionsHistoryDetail: [],
    searchValues: '',
    totalSuggestions: 0
  },
  reducers: {
    clearStateSuggestionHistory: (state) => {
      state.status = null;
      state.error = null;
      state.message = null;
      state.backdrop = null;
      state.suggestionsHistory = [];
      state.suggestionsHistoryDetail = [];
      state.searchValues = '';
      state.totalSuggestions = 0;
    },
    clearStateSuggestionDetail: (state) => {
      state.suggestionsHistory = [];
      state.suggestionsHistoryDetail = [];
    },
    updateSearchValues: (state, action) => {
      state.searchValues = action.payload;
    },
    clearSearchValues: (state, action) => {
      state.searchValues = '';
    },
    setStateRedirect: (state, action) => {
      state.searchValues = action.payload;
    }
  },
  extraReducers: {
    //* get Opt Suggestions History
    [getSuggestionsHistory.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [getSuggestionsHistory.fulfilled]: (state, action) => {
      state.backdrop = null;
      state.status = apiStatus.SUCCESS;
      state.message = 'Get Suggestion History success';
      state.error = null;
      // state.suggestionsHistory = action.payload;
      if (action.payload.currentItem === 0) {
        state.suggestionsHistory = [...action.payload.suggestionsHistory];
        state.totalSuggestions = action.payload.totalSuggestions;
      } else {
        state.suggestionsHistory = [
          ...state.suggestionsHistory,
          ...action.payload.suggestionsHistory
        ];
        state.totalSuggestions = action.payload.totalSuggestions;
      }
    },
    [getSuggestionsHistory.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = null;
      state.error =
        action?.payload?.error?.message || 'get Suggestion History failed';
    },

    //* get Opt Suggestions History Detail
    [getSuggestionsHistoryDetail.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [getSuggestionsHistoryDetail.fulfilled]: (state, action) => {
      state.backdrop = null;
      state.status = apiStatus.SUCCESS;
      state.message = 'Get Suggestion History Detail success';
      state.error = null;
      state.suggestionsHistoryDetail = action.payload;
    },
    [getSuggestionsHistoryDetail.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = null;
      state.error =
        action?.payload?.error?.message ||
        'get Suggestion History Detail failed';
    }
  }
});

const { actions, reducer } = SuggestionHistorySlice;

const {
  clearStateSuggestionHistory,
  updateSearchValues,
  clearSearchValues,
  clearStateSuggestionDetail,
  setStateRedirect
} = actions;

export {
  clearStateSuggestionHistory,
  updateSearchValues,
  clearSearchValues,
  clearStateSuggestionDetail,
  setStateRedirect
};

export default reducer;
