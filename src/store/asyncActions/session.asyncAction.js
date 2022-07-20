// import { sessionApi } from 'services/apis';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { profileApi, sessionApi } from 'services/apis';

//*thunk action
const getUserInfo = createAsyncThunk(
  'session/getUserInfo',
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

const login = createAsyncThunk(
  'session/login',
  // eslint-disable-next-line no-unused-vars
  async (data, props) => {
    try {
      const response = await sessionApi.login(data);
      const userInfo = response.data;
      return userInfo;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);
const updateSetting = createAsyncThunk(
  'session/updateSetting',
  async (data, props) => {
    try {
      const response = await sessionApi.updateSetting(data);
      const userInfo = response.data;
      return userInfo;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

export { getUserInfo, login, updateSetting };
