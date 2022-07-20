// import { sessionApi } from 'services/apis';
import { createAsyncThunk } from '@reduxjs/toolkit';
import userApi from 'services/apis/user.api';

//*thunk action
const getUsers = createAsyncThunk(
  'userOnline/getUsers',
  // eslint-disable-next-line no-unused-vars
  async (data, props) => {
    try {
      const response = await userApi.getUsers();

      const users = response.data
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

      return users;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

export { getUsers };
