/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import apiStatus from 'utils/apiStatus';
import {
  addCustomersToGroup,
  changeStatusGroupCustomer,
  createGroup,
  deleteCustomerInGroup,
  deleteGroup,
  getCustomersInGroup,
  getGroup,
  readFile,
  updateGroup
} from './Group.asyncAction';

const groupSlice = createSlice({
  initialState: {
    groups: [],
    customersInGroup: [],
    listCustomerToCheck: [],
    status: null,
    backdrop: null,
    message: null
  },
  name: 'group',
  reducers: {
    clearGroupState: (state, action) => {
      state.status = null;
      state.backdrop = null;
      state.message = null;
      state.groups = [];
      state.customersInGroup = [];
      state.listCustomerToCheck = [];
    },
    clearStateDialog: (state, action) => {
      state.status = null;
      state.backdrop = null;
      state.message = null;
      state.listCustomerToCheck = [];
    }
  },
  extraReducers: {
    //*Create Group
    [createGroup.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
      state.message = null;
    },
    [createGroup.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Create group success';
      state.groups.push(action.payload);
    },
    [createGroup.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action.payload?.error?.message || 'Create group failed';
    },

    //*Get Group
    [getGroup.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
      state.message = null;
    },
    [getGroup.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.groups = action.payload;
      state.message = null;
    },
    [getGroup.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action.payload?.error?.message || 'Get group failed';
    },

    //*Get Customer in Group
    [getCustomersInGroup.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
      state.message = null;
    },
    [getCustomersInGroup.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.customersInGroup = action.payload;
      state.message = null;
    },
    [getCustomersInGroup.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action.payload?.error?.message || 'Get customer in group failed';
    },

    //*Change status Customer in Group
    [changeStatusGroupCustomer.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.message = null;
    },
    [changeStatusGroupCustomer.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.customersInGroup = state.customersInGroup.map((item) => {
        if (item.id === action.payload.customerId) {
          item.groupCustomerStatus = action.payload.groupCustomerStatus;
          return item;
        } else {
          return item;
        }
      });
      state.message = 'Change status success';
    },
    [changeStatusGroupCustomer.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.message = 'Change status failed';
    },

    //*Read file
    [readFile.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
      state.message = null;
    },
    [readFile.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.listCustomerToCheck = action.payload;
      state.message = 'File read success';
    },
    [readFile.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action.payload?.error?.message || 'File reading failed';
    },

    //*Add customer to Group
    [addCustomersToGroup.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
      state.message = null;
    },
    [addCustomersToGroup.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Add customers in group success';
    },
    [addCustomersToGroup.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action.payload?.error?.message || 'Add customers in group failed';
    },

    //*Delete Group
    [deleteGroup.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
      state.message = null;
    },
    [deleteGroup.fulfilled]: (state, action) => {
      state.groups = state.groups.filter((item) => {
        return item.id !== action.payload.id;
      });
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Delete group success';
    },
    [deleteGroup.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action.payload?.error?.message || 'Delete group failed';
    },

    //*Delete Customer in Group
    [deleteCustomerInGroup.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
      state.message = null;
    },
    [deleteCustomerInGroup.fulfilled]: (state, action) => {
      state.customersInGroup = state.customersInGroup.filter((item) => {
        return item.id !== action.payload;
      });
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Delete customer in group success';
    },
    [deleteCustomerInGroup.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action.payload?.error?.message || 'Delete customer in group failed';
    },

    //*update Group
    [updateGroup.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
      state.message = null;
    },
    [updateGroup.fulfilled]: (state, action) => {
      state.groups = state.groups.map((item) => {
        if (item.id === action.payload.id) {
          return (item = action.payload);
        } else {
          return item;
        }
      });
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Update group success';
    },
    [updateGroup.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action.payload?.error?.message || 'Update group failed';
    }
  }
});
const { reducer, actions } = groupSlice;
const { clearGroupState, clearStateDialog } = actions;
export { clearGroupState, clearStateDialog };
export default reducer;
