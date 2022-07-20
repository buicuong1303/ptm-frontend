/* eslint-disable no-unused-vars */
import axios from 'services/apis/axiosClient';
import * as qs from 'query-string';

const getOptSuggestions = async (query) => {
  Object.keys(query).forEach((key) => query[key]);
  return axios.get(`/opt-suggestions?${qs.stringify(query)}`);
};

const updateOptSuggestion = (data) => {
  return axios.patch('/opt-suggestions', data);
};

const getSuggestionHistory = (query) => {
  Object.keys(query).forEach((key) => query[key]);
  return axios.get(`/opt-suggestions/customer-campaign?${qs.stringify(query)}`);
};

const getSuggestionHistoryDetail = (data) => {
  return axios.get(
    `/opt-suggestions/customers/${data.customerId}/campaigns/${data.campaignId}`
  );
};
const createOptSuggestion = (data) => {
  return axios.post('/opt-suggestions', data);
};

const updateReasonOptSuggestion = (data) => {
  return axios.patch('/opt-suggestions/reason', data);
};

export default {
  getOptSuggestions,
  updateOptSuggestion,
  getSuggestionHistory,
  getSuggestionHistoryDetail,
  createOptSuggestion,
  updateReasonOptSuggestion
};
