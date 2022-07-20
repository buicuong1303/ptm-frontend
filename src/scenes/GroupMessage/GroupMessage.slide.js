import { createSlice } from '@reduxjs/toolkit';
import apiStatus from 'utils/apiStatus';
import { getGroupMessages } from './GroupMessage.asyncAction';

//*reducer handle
const groupMessageSlide = createSlice({
  name: 'groupMessage',
  initialState: {
    status: null,
    toastMessage: null
  },
  reducers: {
    clearState: (state) => {
      state.status = null;
      state.toastMessage = null;
      state.messages = [];
    }
  },
  extraReducers: {
    //* get groupMessages
    [getGroupMessages.pending]: (state) => {
      state.status = apiStatus.PENDING;
    },
    [getGroupMessages.fulfilled]: (state) => {
      state.status = apiStatus.SUCCESS;
    },
    [getGroupMessages.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.toastMessage =
        action?.error?.message || 'Get group message list error!';
    }
  }
});

const { actions, reducer } = groupMessageSlide;

const { clearState } = actions;

export { clearState };

export default reducer;
