/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import apiStatus from 'utils/apiStatus';
import {
  getCampaigns,
  getOptSuggestions,
  getSuggestionsHistory,
  getSuggestionsHistoryDetail,
  updateOptSuggestion,
  updateReasonOptSuggestion
} from './OptSuggestion.asyncAction';
// import * as _ from 'lodash';

//*reducer handle
const OptSuggestionSlice = createSlice({
  name: 'optSuggestion',
  initialState: {
    status: null,
    error: null,
    message: null,
    backdrop: null,
    optSuggestions: [],
    searchValues: '',
    campaignList: [],
    totalSuggestions: null
  },
  reducers: {
    clearStateSuggestion: (state) => {
      state.status = null;
      state.error = null;
      state.message = null;
      state.backdrop = null;
      state.optSuggestions = [];
      state.searchValues = '';
      state.totalSuggestions = null;
      state.campaignList = [];
    },
    updateSearchValues: (state, action) => {
      state.searchValues = action.payload;
    },
    clearSearchValues: (state, action) => {
      state.searchValues = '';
    }
  },
  extraReducers: {
    //* get Opt Suggestions
    [getOptSuggestions.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [getOptSuggestions.fulfilled]: (state, action) => {
      state.backdrop = null;
      state.status = apiStatus.SUCCESS;
      state.message = 'Get Opt Suggestion success';
      state.error = null;
      if (action.payload.currentItem === 0) {
        state.optSuggestions = [...action.payload.optSuggestions];
        state.totalSuggestions = action.payload.totalSuggestions;
      } else {
        state.optSuggestions = [
          ...state.optSuggestions,
          ...action.payload.optSuggestions
        ];
        state.totalSuggestions = action.payload.totalSuggestions;
      }
    },
    [getOptSuggestions.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = null;
      state.error =
        action?.payload?.error?.message || 'get Opt Suggestion failed';
    },

    //* get Opt Suggestions
    [updateOptSuggestion.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [updateOptSuggestion.fulfilled]: (state, action) => {
      state.backdrop = null;
      state.status = apiStatus.SUCCESS;
      state.message = 'Update opt suggestion success';
      state.error = null;
      if (action.payload.id) {
        state.optSuggestions = state.optSuggestions.map((item) => {
          if (item.id === action.payload.id) {
            item.suggestionStatus = action.payload.suggestionStatus;
            item.campaignId = action.payload.campaignId;
            return item;
          }
          return item;
        });
      }
    },
    [updateOptSuggestion.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = null;
      state.error =
        action?.payload?.error?.message || 'Update opt suggestion failed';
    },

    //* get Campaign
    [getCampaigns.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [getCampaigns.fulfilled]: (state, action) => {
      state.backdrop = null;
      state.status = apiStatus.SUCCESS;
      state.message = 'get Campaign success';
      state.error = null;
      state.campaignList = action.payload;
    },
    [getCampaigns.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = null;
      state.error = action?.payload?.error?.message || 'get Campaign failed';
    },

    //* update reason opt suggestion
    [updateReasonOptSuggestion.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [updateReasonOptSuggestion.fulfilled]: (state, action) => {
      state.backdrop = null;
      state.status = apiStatus.SUCCESS;
      state.message = 'update Reason Opt Suggestion success';
      state.error = null;
      state.optSuggestions = state.optSuggestions.map((item) => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            reason: action.payload.reason
          };
        }
        return item;
      });
    },
    [updateReasonOptSuggestion.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = null;
      state.error =
        action?.payload?.error?.message ||
        'update Reason Opt Suggestion failed';
    }
  }
});

const { actions, reducer } = OptSuggestionSlice;

const { clearStateSuggestion, updateSearchValues, clearSearchValues } = actions;

export { clearStateSuggestion, updateSearchValues, clearSearchValues };

export default reducer;
