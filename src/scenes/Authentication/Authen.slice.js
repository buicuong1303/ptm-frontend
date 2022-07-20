/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import {
  signUpAction,
  verifyAccountAction,
  signInAction,
  resetPasswordAction,
  forgotPasswordAction,
  resendEmailAction
} from './Authen.asyncAction';
import apiStatus from 'utils/apiStatus';

const authenSlice = createSlice({
  name: 'authentication',
  initialState: {
    status: null,
    message: '',
    resetSuccess: null,
    verifyEmail: ''
  },
  reducers: {
    clearState: (state, action) => {
      state.status = null;
      state.message = '';
      state.resetSuccess = null;
    }
  },
  extraReducers: {
    [signUpAction.pending]: (state, action) => {},
    [signUpAction.fulfilled]: (state, action) => {
      state.verifyEmail = action.payload.data;
      state.status = apiStatus.SUCCESS;
      state.message = '';
    },
    [signUpAction.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.message = action.payload?.error?.message || 'Server is unavailable';
    },

    [signInAction.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.message = '';
    },
    [signInAction.fulfilled]: (state, action) => {
      const { data } = action.payload;
      localStorage.setItem('accessToken', data.token);

      state.status = apiStatus.SUCCESS;
    },
    [signInAction.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.message = action.payload?.error.message || 'Server is unavailable';
    },

    [verifyAccountAction.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
    },
    [verifyAccountAction.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.message = '';
    },
    [verifyAccountAction.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.message = 'UnAuthorization';
    },

    [resetPasswordAction.pending]: (state, action) => {},
    [resetPasswordAction.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.message = '';
      state.resetSuccess = true;
    },
    [resetPasswordAction.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.message = 'Reset failed';
      state.resetSuccess = false;
    },
    [forgotPasswordAction.pending]: (state, action) => {},
    [forgotPasswordAction.fulfilled]: (state, action) => {
      state.verifyEmail = action.payload.data;
      state.status = apiStatus.SUCCESS;
      state.message = '';
    },
    [forgotPasswordAction.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.message = action.payload?.error.message || 'Server is unavailable';
    },

    [resendEmailAction.pending]: (state, action) => {},
    [resendEmailAction.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.message = '';
    },
    [resendEmailAction.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.message = action.payload?.error.message || 'Server is unavailable';
    }
  }
});

const { reducer, actions } = authenSlice;

const { clearState } = actions;

export { clearState };
export default reducer;
