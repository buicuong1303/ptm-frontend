import { createAsyncThunk } from '@reduxjs/toolkit';
import { groupMessageApi } from 'services/apis';

//*thunk action
const getGroupMessages = createAsyncThunk(
  'groupMessage/getGroupMessages',
  async ({ page, pageSize, searchQuery, current, isReload }, props) => {
    try {
      const response = await groupMessageApi.getGroupMessages(
        page,
        pageSize,
        searchQuery,
        current,
        isReload
      );
      const groupMessages = response.data;
      return groupMessages;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

export { getGroupMessages };
