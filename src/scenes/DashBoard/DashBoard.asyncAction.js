/* eslint-disable no-unused-vars */
import { createAsyncThunk } from '@reduxjs/toolkit';
import dashBoardApi from 'services/apis/dashBoard.api';
import apiStatus from 'utils/apiStatus';
const getDashBoard = createAsyncThunk(
  'dashBoard/getDashBoard',
  async (data, props) => {
    try {
      const response = await dashBoardApi.getDashBoard(data);
      // const messages = response.data.customers;
      // const totalCustomers = response.data.totalCustomers;
      // return {
      //   currentItem: data.currentItem,
      //   customers: customers,
      //   totalCustomers: totalCustomers
      // };
      return response.data;
    } catch (err) {
      console.log(err);
      // const newError = { ...err };
      // const payload = { error: newError.response.data };
      // return props.rejectWithValue(payload);
    }
  }
);
const getLastContactCustomers = createAsyncThunk(
  'dashBoard/getLastContactCustomer',
  async (data, props) => {
    try {
      const response = await dashBoardApi.getLastContactCustomers(data);
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);
const getMoreLastContactCustomers = createAsyncThunk(
  'dashBoard/getMoreLastContactCustomer',
  async (data, props) => {
    try {
      const response = await dashBoardApi.getLastContactCustomers(data);
      return response.data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);
export { getDashBoard, getLastContactCustomers, getMoreLastContactCustomers };
