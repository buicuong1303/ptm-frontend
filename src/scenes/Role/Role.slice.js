/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit';
import apiStatus from 'utils/apiStatus';
import {
  addRole,
  deleteRole,
  getAllPermissionForRole,
  getAllRole,
  updateRole
} from './Role.asyncActions';

const RolesSlice = createSlice({
  name: 'authentication/Role',
  initialState: {
    role: [],
    permission: [],
    activeStatus: null,
    status: null,
    backdrop: null,
    message: null
  },
  reducers: {
    resetRole(state) {
      state.role = [];
      state.permission = [];
      state.activeStatus = null;
      state.status = null;
      state.backdrop = null;
      state.message = null;
    }
  },
  extraReducers: {
    //*Get Roles
    [getAllRole.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      if (!action?.meta?.arg?.isReload) state.backdrop = apiStatus.PENDING;
    },
    [getAllRole.fulfilled]: (state, action) => {
      state.role = action.payload;
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = null;
    },
    [getAllRole.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action?.payload?.error?.message || 'Get roles failed';
    },

    //*Get All Permission for Role
    [getAllPermissionForRole.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
    },
    [getAllPermissionForRole.fulfilled]: (state, action) => {
      state.permission = action.payload;
      state.status = apiStatus.SUCCESS;
      state.message = null;
    },
    [getAllPermissionForRole.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.message =
        action?.payload?.error?.message || 'Get permission for role failed';
    },

    //*Update Role
    [updateRole.pending]: (state, action) => {
      state.activeStatus = apiStatus.PENDING;
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [updateRole.fulfilled]: (state, action) => {
      state.activeStatus = apiStatus.SUCCESS;
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Update role success';
    },
    [updateRole.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action?.payload?.error?.message || 'Update role failed';
    },

    //*Add Role
    [addRole.pending]: (state, action) => {
      state.activeStatus = apiStatus.PENDING;
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [addRole.fulfilled]: (state, action) => {
      state.activeStatus = apiStatus.SUCCESS;
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Create role success';
    },
    [addRole.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action?.payload?.error?.message || 'Create role failed';
    },

    //*Delete Role
    [deleteRole.pending]: (state, action) => {
      state.activeStatus = apiStatus.PENDING;
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [deleteRole.fulfilled]: (state, action) => {
      state.activeStatus = apiStatus.SUCCESS;
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Delete role success';
    },
    [deleteRole.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action?.payload?.error?.message || 'Delete role failed';
    }
  }
});

const { actions, reducer} = RolesSlice;
const { resetRole } = actions;
export { resetRole };
export default reducer;
