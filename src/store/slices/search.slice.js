/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import {
  loadMoreResult,
  searchAll
} from 'store/asyncActions/search.asyncAction';

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    isLoadingResult: null
  },
  reducers: {
    clearStateSearch: (state, action) => {
      state.isLoadingResult = null;
    }
  },
  extraReducers: {
    [loadMoreResult.pending]: (state, action) => {
      state.isLoadingResult = true;
    },
    [loadMoreResult.fulfilled]: (state, action) => {
      state.isLoadingResult = false;
    },
    [loadMoreResult.rejected]: (state, action) => {
      state.isLoadingResult = false;
    },

    [searchAll.pending]: (state, action) => {
      state.isLoadingResult = true;
    },
    [searchAll.fulfilled]: (state, action) => {
      state.isLoadingResult = false;
    },
    [searchAll.rejected]: (state, action) => {
      state.isLoadingResult = false;
    }
  }
});

const { actions, reducer } = searchSlice;

const { clearStateSearch } = actions;

export { clearStateSearch };

export default reducer;
