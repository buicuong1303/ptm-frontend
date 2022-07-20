import axios from './axiosClient';

const getCampaigns = async () => {
  return await axios.get('/campaigns');
};

const updateCampaign = async (data) => {
  return await axios.patch(`/campaigns/${data.campaignId}`, data.campaign);
};

const createCampaign = async (data) => {
  return await axios.post('/campaigns', data.campaign);
};

const deleteCampaign = async (data) => {
  return await axios.delete(`/campaigns/${data.campaignId}`);
};

export default {
  getCampaigns,
  updateCampaign,
  createCampaign,
  deleteCampaign
};
