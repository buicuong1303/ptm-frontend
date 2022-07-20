/* eslint-disable prettier/prettier */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { campaignApi } from 'services/apis';

//*thunk action
const getCampaigns = createAsyncThunk(
  'campaign/getCampaigns',
  async (props) => {
    try {
      const response = await campaignApi.getCampaigns();
      const sensitives = response.data;
      return sensitives;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const updateCampaign = createAsyncThunk(
  'campaign/updateCampaign',
  async (data, props) => {
    try {
      const response = await campaignApi.updateCampaign(data);
      const campaign = response.data;
      return campaign;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const createCampaigns = createAsyncThunk(
  'campaign/createCampaigns',
  async (data, props) => {
    try {
      const response = await campaignApi.createCampaign(data);
      const campaigns = response.data;
      return campaigns;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const deleteCampaigns = createAsyncThunk(
  'campaign/deleteCampaigns',
  async (data, props) => {
    try {
      const response = await campaignApi.deleteCampaign(data);
      const sensitives = response.data;
      return sensitives;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

export {
  getCampaigns,
  updateCampaign,
  createCampaigns,
  deleteCampaigns
};
