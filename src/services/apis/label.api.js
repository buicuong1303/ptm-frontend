/* eslint-disable no-unused-vars */
import axios from 'services/apis/axiosClient';

const createLabel = (data) => {
  return axios.post('/labels', data);
};

const getLabels = () => {
  return axios.get('/labels');
};
const getLabel = (id) => {
  return axios.get(`/labels/${id}`);
};

const updateLabel = (id, data) => {
  return axios.put(`/labels/${id}`, data);
};
const deleteLabel = (id) => {
  return axios.patch(`/labels/${id}`);
};

export default {
  createLabel,
  getLabel,
  getLabels,
  updateLabel,
  deleteLabel
};
