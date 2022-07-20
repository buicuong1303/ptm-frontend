/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';

import apiStatus from 'utils/apiStatus';
import { createSensitives, deleteSensitives, getSensitives, updateSensitives } from './Sensitive.asyncAction';

//*reducer handle
const sensitiveSlice = createSlice({
  name: 'sensitive',
  initialState: {
    status: null,
    message: null,
    backdrop: null,
    sensitives: [],
    sensitive: null,
  },
  reducers: {
    clearStateSensitive: (state, action) => {
      state.status = null;
      state.message = null;
      state.backdrop = null;
      state.sensitives = [];
      state.sensitive = null;
    }
  },
  extraReducers: {
    //* get sensitive
    [getSensitives.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [getSensitives.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'get sensitive success';
      state.sensitives = action.payload;
    },
    [getSensitives.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action?.payload?.error?.message || 'get sensitive failed';
    },
    //* create sensitive
    [createSensitives.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [createSensitives.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Create sensitive success';
      state.sensitives = [action.payload, ...state.sensitives];
    },
    [createSensitives.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action?.payload?.error?.message || 'Create sensitive failed';
    },

    //* update sensitive
    [updateSensitives.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [updateSensitives.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Update sensitive success';
      state.sensitives = state.sensitives.map(item => {
        if(item.id === action.payload.id){
          item = action.payload;
          return item;
        }else{
          return item;
        }
      });
    },
    [updateSensitives.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action?.payload?.error?.message || 'Update sensitive failed';
    },

    //* update sensitive
    [deleteSensitives.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [deleteSensitives.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Delete sensitive success';
      state.sensitives = state.sensitives.filter(item => {
        if(item.id === action.payload.id){
          item = action.payload;
          return false;
        }else{
          return true;
        }
      });
    },
    [deleteSensitives.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action?.payload?.error?.message || 'Delete sensitive failed';
    },
  }
});

const { actions, reducer } = sensitiveSlice;

const { clearStateSensitive} = actions;

export { clearStateSensitive};

export default reducer;
