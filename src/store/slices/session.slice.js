/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import {
  getUserInfo,
  login,
  updateSetting
} from 'store/asyncActions/session.asyncAction';
import apiStatus from 'utils/apiStatus';
import setStateAuthen from 'store/actions/setStateAuthen.action';
import {
  updateAvatar,
  updateProfile
} from 'scenes/Profile/Profile.asyncAction';

//*reducer handle
const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    status: null,
    message: null,
    isSignIn: false,
    user: {}
  },
  reducers: {
    // eslint-disable-next-line no-unused-vars
    clearStateSession: (state, action) => {
      state.status = null;
      state.error = null;
      state.message = null;
      state.isSignIn = null;
    },
    signOut: (state) => {
      state.isSignIn = false;
    },
    setStateSignIn: (state, action) => {
      state.isSignIn = action.payload;
    }
  },
  extraReducers: {
    //* get user information
    [getUserInfo.pending]: (state) => {
      state.status = apiStatus.PENDING;
    },
    [getUserInfo.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.user = {
        ...action.payload,
        permissions: action.payload.permissions
      };
    },
    [getUserInfo.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.message = action.error.message;
    },

    [updateProfile.pending]: (state) => {},
    [updateProfile.fulfilled]: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload
      };
    },
    [updateProfile.rejected]: (state, action) => {},

    [updateAvatar.pending]: (state) => {},
    [updateAvatar.fulfilled]: (state, action) => {
      state.user = {
        ...state.user,
        avatar: action.payload
      };
    },
    [updateAvatar.rejected]: (state) => {},

    [updateSetting.fulfilled]: (state, action) => {
      const { payload } = action;
      state.user = { ...state.user, ...payload };
    },
    [updateSetting.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.message = action?.payload?.error?.message || 'Something wrong';
    }
  }
});

const { actions, reducer } = sessionSlice;

const { clearStateSession, signOut, setStateSignIn } = actions;

export { clearStateSession, signOut, setStateSignIn };

export default reducer;
