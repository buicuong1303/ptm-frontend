import { createSlice } from '@reduxjs/toolkit';
import apiStatus from 'constants/apiStatus';
import {
  addPermission,
  deletePermission,
  getAllPermission,
  getPermissionOfClient,
  updatePermission
} from './Permission.asyncActions';

const PermissionsSlice = createSlice({
  name: 'authentication/Permission',
  initialState: {
    permission: [],
    permissionHold: false,

    status: null,
    backdrop: null,
    error: null,
    message: null
  },
  reducers: {
    updateStatePermission(state, data) {
      state.permission = state.permission.map((item) => {
        if (
          `${item[0]} ${item[1]} ${item[2]}` ===
          `${data.payload.oldData[0]} ${data.payload.oldData[1]} ${data.payload.oldData[2]}`
        ) {
          return [
            `/${data.payload.newData.resource}`,
            `${data.payload.newData.action}:${data.payload.newData.procession}`,
            data.payload.newData.effect
          ];
        }
        return item;
      });
    },
    resetPermission(state) {
      state.permission = [];
      state.status = null;
      state.backdrop = null;
      state.message = null;
    }
  },
  extraReducers: {
    //*Get Permission
    // eslint-disable-next-line
    [getAllPermission.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [getAllPermission.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.permission = action.payload;
      state.message = null;
    },
    [getAllPermission.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message =
        action?.payload?.error?.message || 'Get Permission failed';
    },

    //*Update Permission
    // eslint-disable-next-line
    [updatePermission.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    // eslint-disable-next-line
    [updatePermission.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Update permission success';
    },
    [updatePermission.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message =
        action?.payload?.error?.message || 'Update Permission failed';
    },

    //*Add Permission
    // eslint-disable-next-line
    [addPermission.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    // eslint-disable-next-line
    [addPermission.fulfilled]: (state, action) => {
      state.permission.push(action.payload);
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Create permission success';
    },
    [addPermission.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message =
        action?.payload?.error?.message || 'Create Permission failed';
    },

    //*Delete Permission
    // eslint-disable-next-line
    [deletePermission.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    // eslint-disable-next-line
    [deletePermission.fulfilled]: (state, action) => {
      if (action.payload) {
        state.permission = state.permission.filter((item) => {
          return (
            `${item[0]} ${item[1]} ${item[2]}` !==
            `${action.payload[0]} ${action.payload[1]} ${action.payload[2]}`
          );
        });
      }
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Delete permission success';
    },
    [deletePermission.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message =
        action?.payload?.error?.message || 'Delete Permission failed';
    },

    //*Get Permission of Client
    // eslint-disable-next-line
    [getPermissionOfClient.pending]: (state, action) => {
    },
    // eslint-disable-next-line
    [getPermissionOfClient.fulfilled]: (state, action) => {
      state.permissionHold = true;
      state.message = 'Get permission of client success';
    },
    // eslint-disable-next-line
    [getPermissionOfClient.rejected]: (state, action) => {
      // state.message = action.payload
      //   ? action.payload.error.message
      //   : 'Get Permission of Client fail !!';
    }
  }
});

// eslint-disable-next-line
const { actions, reducer} = PermissionsSlice;
const { updateStatePermission, resetPermission } = actions;

export { updateStatePermission, resetPermission };
export default reducer;
