/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import apiStatus from 'utils/apiStatus';
import {
  changePasswordAction,
  createUser,
  deleteUser,
  getAllPermissionForUser,
  getAllRoleForUser,
  getAllUser,
  updateUser,
  getFullInfor
} from './User.asyncActions';

const UsersSlice = createSlice({
  name: 'management/users',
  initialState: {
    listUser: [],
    permission: [],
    role: [],
    activeStatus: null,
    status: null,
    backdrop: null,
    message: null
  },
  reducers: {
    clearStatus: (state, action) => {
      state.status = null;
    },
    clearState: (state, action) => {
      state.listUser = [];
      state.permission = [];
      state.role = [];
      state.activeStatus = null;
      state.status = null;
      state.backdrop = null;
      state.message = null;
    }
  },
  extraReducers: {
    //*Get User
    // eslint-disable-next-line
    [getAllUser.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [getAllUser.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.listUser = action.payload;
      state.message = null;
    },
    [getAllUser.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.error = action?.payload?.error?.message || 'Get user failed';
    },

    //*Change Password
    [changePasswordAction.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
    },
    [changePasswordAction.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.message = 'Change password success';
    },
    [changePasswordAction.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.message =
        action?.payload?.error?.message || 'Change password failed';
    },

    //*get all role for User
    [getAllRoleForUser.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
    },
    [getAllRoleForUser.fulfilled]: (state, action) => {
      state.role = action.payload;
      state.status = apiStatus.SUCCESS;
      state.message = null;
    },
    [getAllRoleForUser.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.message =
        action?.payload?.error?.message || 'Get roles for user failed';
    },

    //*get permission role for User
    [getAllPermissionForUser.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
    },
    [getAllPermissionForUser.fulfilled]: (state, action) => {
      state.permission = action.payload;
      state.status = apiStatus.SUCCESS;
      state.message = null;
    },
    [getAllPermissionForUser.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.message =
        action?.payload?.error?.message || 'Get permissions for user failed';
    },

    //*get full information
    [getFullInfor.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      if (!action?.meta?.arg?.isReload) state.backdrop = apiStatus.PENDING;
    },
    [getFullInfor.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.permission = action.payload.permissions;
      state.role = action.payload.roles;
      state.listUser = action.payload.users;
      state.message = null;
    },
    [getFullInfor.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message =
        action?.payload?.error?.message || 'Get full information failed';
    },

    //*Update User
    [updateUser.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
      state.activeStatus = apiStatus.PENDING;
    },
    [updateUser.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.activeStatus = apiStatus.SUCCESS;
      state.message = 'Update user success';
    },
    [updateUser.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.activeStatus = apiStatus.ERROR;
      state.message = action?.payload?.error?.message || 'Update user failed';
    },

    //*Create User
    [createUser.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
      state.activeStatus = apiStatus.PENDING;
    },
    [createUser.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.activeStatus = apiStatus.SUCCESS;
      state.message = 'Create user success';
    },
    [createUser.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.activeStatus = apiStatus.ERROR;
      state.message = action?.payload?.error?.message || 'Create user failed';
    },

    //*Delete User
    [deleteUser.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
      state.activeStatus = apiStatus.PENDING;
    },
    [deleteUser.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.activeStatus = apiStatus.SUCCESS;
      state.message = 'Delete user success';
    },
    [deleteUser.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.activeStatus = apiStatus.ERROR;
      state.message = action?.payload?.error?.message || 'Delete user failed';
    }
  }
});

// eslint-disable-next-line
const { actions, reducer } = UsersSlice;
const { clearStatus, clearState } = actions;

export { clearStatus, clearState };
export default reducer;
