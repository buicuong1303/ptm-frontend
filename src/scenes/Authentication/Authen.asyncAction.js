/* eslint-disable no-unused-vars */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { authenApi } from 'services/apis';
export const signUpAction = createAsyncThunk(
  'authentication/sign-up',
  async (data, props) => {
    try {
      const response = await authenApi.signUp(data);
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

export const verifyAccountAction = createAsyncThunk(
  'authentication/verifyAccount',
  async (token, props) => {
    try {
      const response = await authenApi.verifyAccount(token);
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

export const signInAction = createAsyncThunk(
  'authentication/sign-in',
  async (data, props) => {
    try {
      const response = await authenApi.signIn(data);
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

export const forgotPasswordAction = createAsyncThunk(
  'authentication/forgot-password',
  async (data, props) => {
    try {
      const response = await authenApi.forgotPassword(data);
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

export const resetPasswordAction = createAsyncThunk(
  'authentication/reset-password',
  async (data, props) => {
    try {
      const response = await authenApi.resetPassword(data);
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

export const resendEmailAction = createAsyncThunk(
  'authentication/resend-email',
  async (data, props) => {
    try {
      const response = await authenApi.resendEmail(data);
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);
