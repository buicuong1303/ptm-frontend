/* eslint-disable no-unused-vars */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { permissionApi, roleApi, usersApi } from 'services/apis';
import apiStatus from 'utils/apiStatus';

const getAllUser = createAsyncThunk(
  'management/users',
  async (props) => {
    try {
      const response = await usersApi.getUsers();
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().users.status === apiStatus.PENDING) {
        return false;
      }
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);

const changePasswordAction = createAsyncThunk(
  'management/change-password',
  async (data, props) => {
    try {
      const response = await usersApi.changePassword(data);
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().users.status === apiStatus.PENDING) {
        return false;
      }
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);

const getAllRoleForUser = createAsyncThunk(
  'management/getAllRolesForUser',
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
      if (getState().users.status === apiStatus.PENDING) {
        return false;
      }
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);

const getAllPermissionForUser = createAsyncThunk(
  'management/getAllPermissionForUser',
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
      if (getState().users.status === apiStatus.PENDING) {
        return false;
      }
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);

const getFullInfor = createAsyncThunk(
  'management/getFullInfor',
  async (props) => {
    try {
      const response = await usersApi.getFullInfor();
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().users.status === apiStatus.PENDING) {
        return false;
      }
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);

const updateUser = createAsyncThunk(
  'management/updateUser',
  async (data, props) => {
    try {
      const { formValues, currentCompanies } = data;
      const roleToAdd = [];
      const roleToDelete = [];
      let permissionToAdd = [];
      let permissionToDelete = [];
      let companyToAdd = [];
      let companyToDelete = [];
      companyToAdd = formValues.companies.filter(
        (item) => !currentCompanies.includes(item)
      );
      companyToDelete = currentCompanies.filter(
        (item) => !formValues.companies.includes(item)
      );
      formValues.roleExisted.forEach((item) => {
        const currentIndex = formValues.role.indexOf(item);
        if (currentIndex < 0) {
          roleToDelete.push(item.slice(5));
        }
      });
      formValues.role.forEach((item) => {
        const currentIndex = formValues.roleExisted.indexOf(item);
        if (currentIndex < 0) {
          roleToAdd.push(item.slice(5));
        }
      });
      formValues.permissionExisted.forEach((item) => {
        const currentIndex = formValues.permission.indexOf(item);
        if (currentIndex < 0) {
          permissionToDelete.push(item);
        }
      });
      formValues.permission.forEach((item) => {
        const currentIndex = formValues.permissionExisted.indexOf(item);
        if (currentIndex < 0) {
          permissionToAdd.push(item);
        }
      });
      permissionToAdd = permissionToAdd.map((item) => {
        const arrSplit = item.split(' ', 4);
        return {
          obj: `/${arrSplit[3]}`,
          act: `${arrSplit[2]}:${arrSplit[1]}`,
          eft: arrSplit[0]
        };
      });
      permissionToDelete = permissionToDelete.map((item) => {
        const arrSplit = item.split(' ', 4);
        return {
          obj: `/${arrSplit[3]}`,
          act: `${arrSplit[2]}:${arrSplit[1]}`,
          eft: arrSplit[0]
        };
      });
      const dataToUpdate = {
        id: formValues.id,
        permission: permissionToAdd,
        permissionDelete: permissionToDelete,
        role: roleToAdd,
        roleDelete: roleToDelete,
        firstName: formValues.firstName,
        gender: formValues.gender,
        lastName: formValues.lastName,
        status: formValues.status,
        username: formValues.username,
        email: formValues.email,
        companyToAdd,
        companyToDelete
      };
      const response = await usersApi.updateUserApi(dataToUpdate);
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().users.status === apiStatus.PENDING) {
        return false;
      }
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);

const createUser = createAsyncThunk(
  'management/createUser',
  async (data, props) => {
    try {
      const listPermissionAdd = data.permission.map((item) => {
        const arrSplit = item.split(' ', 4);
        return {
          obj: `/${arrSplit[3]}`,
          act: `${arrSplit[2]}:${arrSplit[1]}`,
          eft: arrSplit[0]
        };
      });
      const listRoleAdd = data.role.map((item) => {
        return item.slice(5);
      });
      const dataToUpdate = {
        permissions: listPermissionAdd,
        permissionDeletes: [],
        roles: listRoleAdd,
        roleDeletes: [],
        firstName: data.firstName,
        gender: data.gender,
        lastName: data.lastName,
        status: data.status,
        username: data.username,
        email: data.email,
        department: data.department,
        companies: data.companies
      };
      const response = await usersApi.createUser(dataToUpdate);
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().users.status === apiStatus.PENDING) {
        return false;
      }
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);

const deleteUser = createAsyncThunk(
  'management/deleteUser',
  async (data, props) => {
    try {
      const response = await usersApi.deleteUser(data);
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().users.status === apiStatus.PENDING) {
        return false;
      }
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);

const getCompaniesOfUser = createAsyncThunk(
  'management/getCompaniesOfUser',
  async (data, props) => {
    try {
      const response = await usersApi.getCompaniesOfUser(data.userId);
      const companiesOfUser = response.data;
      const companies = companiesOfUser.map((item) => item.company);
      return companies;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().users.status === apiStatus.PENDING) return false;
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);

export {
  getAllUser,
  changePasswordAction,
  getAllRoleForUser,
  getAllPermissionForUser,
  updateUser,
  createUser,
  deleteUser,
  getCompaniesOfUser,
  getFullInfor
};
