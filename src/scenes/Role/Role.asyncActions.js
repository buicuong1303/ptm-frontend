/* eslint-disable no-debugger */
import { createAsyncThunk } from '@reduxjs/toolkit';
import apiStatus from 'constants/apiStatus';
import { permissionApi, roleApi } from 'services/apis';

const getAllRole = createAsyncThunk(
  'RolesAction/getAllRoles',
  async (props) => {
    try {
      const response = await roleApi.getRole();
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

const getAllPermissionForRole = createAsyncThunk(
  'RolesAction/getAllPermission',
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

const updateRole = createAsyncThunk(
  'RolesAction/updateRole',
  async (data, props) => {
    try {
      let dataAdd = [];
      const indexDataAdded = [];
      const dataDelete = [];
      data.permissionExisted.forEach((item) => {
        const currentIndex = data.permissionChecked.indexOf(
          `${item[2]} ${item[3]} ${item[1]} ${item[0].slice(1)}`
        );
        if (currentIndex < 0) {
          dataDelete.push({
            obj: `${item[0]}`,
            act: `${item[1]}:${item[3]}`
          });
        } else {
          indexDataAdded.push(currentIndex);
        }
      });
      dataAdd = data.permissionChecked.filter((item, index) => {
        return indexDataAdded.indexOf(index) < 0;
      });
      dataAdd = dataAdd.map((item) => {
        const arrSplit = item.split(' ', 4);
        return {
          obj: `/${arrSplit[3]}`,
          act: `${arrSplit[2]}:${arrSplit[1]}`
        };
      });
      //   roleName: data.name,
      //   listPermissionDelete: dataDelete,
      //   listPermissionAdd: dataAdd
      // });
      await roleApi.updateRoleName({
        oldRole: data.oldName,
        newRole: data.name
      });
      const response = await roleApi.updateRole({
        roleName: data.name,
        listPermissionDelete: dataDelete,
        listPermissionAdd: dataAdd
      });
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const addRole = createAsyncThunk('RolesAction/addRole', async (data, props) => {
  try {
    let dataAdd = [];
    dataAdd = data.permissionAdd.map((item) => {
      const arrSplit = item.split(' ', 4);
      return {
        obj: `/${arrSplit[3]}`,
        act: `${arrSplit[2]}:${arrSplit[1]}`
      };
    });
    const response = await roleApi.addRole({
      role: data.name,
      listPermissionDelete: [],
      listPermissionAdd: dataAdd
    });
    // const response = await roleApi.updateRole({
    //   roleName: data.name,
    //   listPermissionDelete: [],
    //   listPermissionAdd: dataAdd
    // });
    return response.data;
  } catch (err) {
    const newError = { ...err };
    const payload = { error: newError.response.data };
    return props.rejectWithValue(payload);
  }
});

const deleteRole = createAsyncThunk(
  'RolesAction/deleteRole',
  async (data, props) => {
    try {
      const response = await roleApi.deleteRole(data);
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

export { getAllRole, getAllPermissionForRole, updateRole, addRole, deleteRole };
