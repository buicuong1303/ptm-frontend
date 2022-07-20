import { createAsyncThunk } from '@reduxjs/toolkit';
import apiStatus from 'constants/apiStatus';
import { permissionApi } from 'services/apis';

const getAllPermission = createAsyncThunk(
  'PermissionAction/getAllPermission',
  async (props) => {
    try {
      const response = await permissionApi.getPermission();
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().permission.status === apiStatus.PENDING) {
        return false;
      }
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);

const updatePermission = createAsyncThunk(
  'PermissionAction/updatePermission',
  async (data, props) => {
    try {
      const action = `${data.newData.action}:${data.newData.procession}`;
      const dataToUpdate = {
        oldObj: data.oldData[0],
        oldAct: data.oldData[1],
        oldEft: data.oldData[2],
        newObj: `/${data.newData.resource}`,
        newAct: action,
        newEft: data.newData.effect
      };
      const response = await permissionApi.updatePermission(dataToUpdate);
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().permission.status === apiStatus.PENDING) {
        return false;
      }
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);

const addPermission = createAsyncThunk(
  'PermissionAction/addPermission',
  async (data, props) => {
    try {
      let action = `${data.action}:${data.procession}`;
      const dataToAdd = {
        obj: `/${data.resource}`,
        act: action,
        eft: data.effect
      };
      const response = await permissionApi.addPermission(dataToAdd);
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().permission.status === apiStatus.PENDING) {
        return false;
      }
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);

const deletePermission = createAsyncThunk(
  'PermissionAction/deletePermission',
  async (data, props) => {
    try {
      const dataToDelete = {
        oldObj: data[0].slice(1),
        oldAct: data[1]
      };
      const response = await permissionApi.deletePermission(dataToDelete);
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().permission.status === apiStatus.PENDING) {
        return false;
      }
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);

const getPermissionOfClient = createAsyncThunk(
  'PermissionAction/getPermissionOfClient',
  async (data, props) => {
    try {
      const response = await permissionApi.getPermissionOfClient(data);
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().permission.status === apiStatus.PENDING) {
        return false;
      }
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);

export {
  getAllPermission,
  updatePermission,
  addPermission,
  deletePermission,
  getPermissionOfClient
};
