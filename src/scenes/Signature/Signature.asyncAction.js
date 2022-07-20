/* eslint-disable prettier/prettier */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { signatureApi } from 'services/apis';
import apiStatus from 'utils/apiStatus';

//*thunk action
const createSignature = createAsyncThunk(
  'signature/createSignature',
  async (data, props) => {
    try {
      const response = await signatureApi.createSignature(data.signature);
      const signature = response.data;
      return signature;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const getSignatures = createAsyncThunk(
  'signature/getSignatures',
  async (data, props) => {
    try {
      const response = await signatureApi.getSignatures();
      const signatures = response.data;
      return signatures;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }, {
    condition: (data, { getState }) => {
      if (getState().signature.status === apiStatus.PENDING) return false;
    },
    dispatchConditionRejection: true  //* default false: don't dispatch reject action
  }
);

const getSignature = createAsyncThunk(
  'signature/getSignature',
  async (data, props) => {
    try {
      const response = await signatureApi.getSignature(data.signatureId);
      const signature = response.data;
      return signature;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const updateSignature = createAsyncThunk(
  'signature/updateSignature',
  async (data, props) => {
    try {
      const response = await signatureApi.updateSignature(
        data.signatureId,
        {
          name: data.signature.name,
          value: data.signature.value,
          status: data.signature.status,
        }
      );
      const signature = response.data;
      return signature;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const deleteSignature = createAsyncThunk(
  'signature/deleteSignature',
  async (data, props) => {
    try {
      await signatureApi.deleteSignature(data.signatureId);
      const signatureId = data.signatureId;
      return signatureId;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

export {
  createSignature,
  getSignatures,
  getSignature,
  updateSignature,
  deleteSignature
};
