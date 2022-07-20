import { createSlice } from '@reduxjs/toolkit';
import apiStatus from 'utils/apiStatus';
import { getProfile, updateAvatar, updateProfile } from './Profile.asyncAction';

//*reducer handle
const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    status: null,
    error: null,
    message: null,
    profile: null
  },
  reducers: {
    // eslint-disable-next-line no-unused-vars
    clearStateProfile: (state, action) => {
      state.status = null;
      state.error = null;
      state.message = null;
      state.profile = null;
    }
  },
  extraReducers: {
    //* get profile
    [getProfile.pending]: (state) => {
      state.status = apiStatus.PENDING;
    },
    [getProfile.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.profile = action.payload;
    },
    [getProfile.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.error = action?.error?.message || 'Get profile failed';
    },

    //* update profile
    [updateProfile.pending]: (state) => {
      state.status = apiStatus.PENDING;
    },
    [updateProfile.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.profile = {
        ...state.profile,
        ...action.payload
      };
      state.message = 'Update profile success';
    },
    [updateProfile.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.error = action?.payload?.error?.message || 'Update profile failed';
    },

    //* update profile
    [updateAvatar.pending]: (state) => {
      state.status = apiStatus.PENDING;
    },
    [updateAvatar.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.profile = {
        ...state.profile,
        avatar: action.payload
      };
      state.message = 'Update avatar success';
    },
    [updateAvatar.rejected]: (state) => {
      state.status = apiStatus.ERROR;
      state.error = 'Update avatar failed';
    }
  }
});

const { actions, reducer } = profileSlice;

const { clearStateProfile } = actions;

export { clearStateProfile };

export default reducer;
