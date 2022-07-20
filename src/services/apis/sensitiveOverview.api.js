import axios from './axiosClient';
import qs from 'query-string';

const getSensitiveOverview = async (queries) => {
  return await axios.get(`/sensitive-detects?${qs.stringify(queries)}`);
};

const getAllSensitiveOverview = async () => {
  return await axios.get('/sensitive-detects/export');
};

const searchSensitiveOverviews = async (queries) => {
  return await axios.get(`/sensitive-detects/search?${qs.stringify(queries)}`);
};

const createSensitiveWord = async (data) => {
  return await axios.post('/sensitive-detects', data);
};
export default {
  getSensitiveOverview,
  getAllSensitiveOverview,
  searchSensitiveOverviews,
  createSensitiveWord
};
