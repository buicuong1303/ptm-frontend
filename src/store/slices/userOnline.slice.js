/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import apiStatus from 'utils/apiStatus';
import { getUsers } from 'store/asyncActions/userOnline.asyncAction';
//*reducer handle
const userOnline = createSlice({
  name: 'userOnline',
  initialState: {
    status: null,
    message: null,
    users: []
  },
  reducers: {
    // eslint-disable-next-line no-unused-vars
    clearStateUserOnline: (state, action) => {
      state.status = null;
      state.message = null;
      state.users = [];
    },

    updateUserOnlineStatus: (state, action) => {
      if (action.payload) {
        const user = action.payload;

        const indexOfUser = state.users.map((item) => item.id).indexOf(user.id);
        if (indexOfUser !== -1)
          state.users[indexOfUser] = {
            ...state.users[indexOfUser],
            ...user
          };

        state.users = state.users
          .sort((user1, user2) => {
            if (user1.lastActivity > user2.lastActivity) return -1;
            else if (user1.lastActivity < user2.lastActivity) return 1;
            else return 0;
          })
          .sort((user1, user2) => {
            if (user1.onlineStatus > user2.onlineStatus) return -1;
            else if (user1.onlineStatus < user2.onlineStatus) return 1;
            else return 0;
          });
      }
    }
  },
  extraReducers: {
    //* get user information
    [getUsers.pending]: (state) => {},
    [getUsers.fulfilled]: (state, action) => {
      if (action.payload) state.users = action.payload;
    },
    [getUsers.rejected]: (state, action) => {}
  }
});

const { actions, reducer } = userOnline;

const { clearStateUserOnline, updateUserOnlineStatus } = actions;

export { clearStateUserOnline, updateUserOnlineStatus };

export default reducer;
