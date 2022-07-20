import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
export const loginWidget = createAsyncThunk('widget/login', async () => {
  const response = await axios.get(
    `${window._env_.REACT_APP_BASE_URL}/auth/rc-widget`
  );
  return response.data;
});
