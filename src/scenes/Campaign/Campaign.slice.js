/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';

import apiStatus from 'utils/apiStatus';
import { createCampaigns, deleteCampaigns, getCampaigns, updateCampaign } from './Campaign.asyncAction';

//*reducer handle
const campaignSlice = createSlice({
  name: 'campaign',
  initialState: {
    status: null,
    message: null,
    backdrop: null,
    campaigns: [],
  },
  reducers: {
    clearStateCampaign: (state, action) => {
      state.status = null;
      state.message = null;
      state.backdrop = null;
    }
  },
  extraReducers: {
    //* get campaign
    [getCampaigns.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [getCampaigns.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'get campaign success';
      state.campaigns = action.payload;
    },
    [getCampaigns.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action?.payload?.error?.message || 'get campaign failed';
    },

    //* create campaign
    [createCampaigns.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [createCampaigns.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Create campaign success';
      state.campaigns = [action.payload, ...state.campaigns];
    },
    [createCampaigns.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action?.payload?.error?.message || 'Create campaign failed';
    },

    //* update campaign
    [updateCampaign.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [updateCampaign.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Update campaign success';
      state.campaigns = state.campaigns.map(item => {
        if(item.id === action.payload.id){
          item = action.payload;
          return item;
        }else{
          return item;
        }
      });
    },
    [updateCampaign.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action?.payload?.error?.message || 'Update campaign failed';
    },

    //* update campaign
    [deleteCampaigns.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
      state.backdrop = apiStatus.PENDING;
    },
    [deleteCampaigns.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.backdrop = null;
      state.message = 'Delete campaign success';
      state.campaigns = state.campaigns.filter(item => {
        if(item.id === action.payload.id){
          item = action.payload;
          return false;
        }else{
          return true;
        }
      });
    },
    [deleteCampaigns.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.backdrop = null;
      state.message = action?.payload?.error?.message || 'Delete campaign failed';
    },
  }
});

const { actions, reducer } = campaignSlice;

const { clearStateCampaign } = actions;

export { clearStateCampaign };

export default reducer;
