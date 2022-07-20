/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import {
  getCustomersComposeText,
  getSignaturesActive,
  sendComposeText
} from './ComposeText.asyncAction';
import apiStatus from 'utils/apiStatus';
import * as _ from 'lodash';

const composeTextSlice = createSlice({
  name: 'compose-text',
  initialState: {
    listSignature: [{ id: '', name: 'None' }],
    status: null,
    message: null,
    isSending: false
  },
  reducers: {
    clearState: (state, action) => {
      state.status = null;
      state.message = '';
      state.listSignature = [{ id: '', name: 'None' }];
    }
  },
  extraReducers: {
    //* get signature active
    [getSignaturesActive.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
    },
    [getSignaturesActive.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.listSignature = state.listSignature.concat(action.payload);
    },
    [getSignaturesActive.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
    },

    [getCustomersComposeText.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
    },
    [getCustomersComposeText.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
    },
    [getCustomersComposeText.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.message = action?.payload?.error?.message || 'Get customers failed';
    },

    [sendComposeText.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.isSending = true;
    },
    [sendComposeText.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.isSending = false;
      state.message = 'Sent messages success';
    },
    [sendComposeText.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.message = action?.payload?.error?.message || 'Sent messages failed';
      state.isSending = false;
    }
  }
});
const { actions, reducer } = composeTextSlice;
const { clearState } = actions;

export { clearState };
export default reducer;
