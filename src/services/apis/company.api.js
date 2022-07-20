/* eslint-disable no-unused-vars */
import axios from 'services/apis/axiosClient';

const getCompanies = () => {
  return axios.get('/companies');
};

const createCompany = (data) => {
  return axios.post('/companies', data);
};

const updateCompany = (data) => {
  return axios.patch(`/companies/${data.id}`, data);
};

const deleteCompany = (id) => {
  return axios.delete(`/companies/${id}`);
};

const getLabelsOfCompany = (id) => {
  return axios.get(`/companies/${id}`);
};

export default {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  getLabelsOfCompany
};
