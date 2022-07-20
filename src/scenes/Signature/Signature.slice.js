/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import {
  createSignature,
  getSignatures,
  getSignature,
  updateSignature,
  deleteSignature
} from './Signature.asyncAction';
import apiStatus from 'utils/apiStatus';

//*reducer handle
const signatureSlice = createSlice({
  name: 'signature',
  initialState: {
    status: null,
    message: null,
    backdrop: null,
    signatures: [],
    signature: null,
  },
  reducers: {
    clearStateSignature: (state, action) => {
      state.status = null;
      state.message = null;
      state.backdrop = null;
      state.signatures = [];
      state.signature = null;
    }
  },
  extraReducers: {
    //* create signature
    [createSignature.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [createSignature.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Create signature success';
      if (action.payload) {
        state.signatures = [ action.payload, ...state.signatures ];
      }
    },
    [createSignature.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action?.payload?.error?.message || 'Create signature failed';
    },

    //* get signatures
    [getSignatures.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [getSignatures.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = null;
      state.signatures = action.payload ? action.payload : state.signatures;
    },
    [getSignatures.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action?.payload?.error?.message || 'Get signatures failed';
    },

    //* get signature
    [getSignature.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
    },
    [getSignature.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.message = null;
      state.signature = action.payload;
    },
    [getSignature.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.message = action?.payload?.error?.message || 'Get signature failed';
    },

    //* update signature
    [updateSignature.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [updateSignature.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Update signature success';
      if (action.payload) {
        const indexUpdate = state.signatures.map((item) => item.id).indexOf(action.payload.id);
        state.signatures[indexUpdate] = {
          ...state.signatures[indexUpdate],
          ...action.payload
        };
      }
    },
    [updateSignature.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action?.payload?.error?.message || 'Update signature failed';
    },

    //* delete signature
    [deleteSignature.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [deleteSignature.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Delete signature success';
      if (action.payload) {
        const indexRemover = state.signatures.map((item) => item.id).indexOf(action.payload);
        state.signatures.splice(indexRemover, 1);
      }
    },
    [deleteSignature.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action?.payload?.error?.message || 'Delete signature failed';
    }
  }
});

const { actions, reducer } = signatureSlice;

const { clearStateSignature, updateSearchValues, clearSearchValues } = actions;

export { clearStateSignature, updateSearchValues, clearSearchValues };

export default reducer;
