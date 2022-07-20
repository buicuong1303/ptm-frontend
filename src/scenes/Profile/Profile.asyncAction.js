/* eslint-disable no-unreachable */
/* eslint-disable prettier/prettier */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { profileApi } from 'services/apis';

//*thunk action
const getProfile = createAsyncThunk(
  'profile/getProfile',
  // eslint-disable-next-line no-unused-vars
  async (data, props) => {
    try {
      const response = await profileApi.getProfile();
      const userInfo = response.data;
      return userInfo;

    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  // eslint-disable-next-line no-unused-vars
  async (data, props) => {
    try {
      const response = await profileApi.updateProfile(data.profileUpdate);
      const userInfo = response.data;
      return userInfo;

    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const updateAvatar = createAsyncThunk(
  'profile/updateAvatar',
  // eslint-disable-next-line no-unused-vars
  async (data, props) => {
    try {
      const { avatar } = data;

      const getSignUrl = await profileApi.avatarSignedUrl({
        fileName: avatar.name,
        type: avatar.type
      });

      await profileApi.uploadAvatar(getSignUrl.data.urlUpload, avatar);

      await profileApi.updateAvatar({ avatar: getSignUrl.data.urlAvatar });

      return getSignUrl.data.urlAvatar;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

export { getProfile, updateProfile, updateAvatar };
