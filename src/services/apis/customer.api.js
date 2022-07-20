import axios from './axiosClient';
import * as qs from 'query-string';

const createCustomer = async (customer) => {
  return await axios.post(`/customers/${true}`, customer);
};

const addCustomerFromExcel = async (data) => {
  return await axios.post('/customers/excel', data);
};

const getCustomers = async (query) => {
  Object.keys(query).forEach((key) => query[key]);
  return await axios.get(`/customers?${qs.stringify(query)}`);
};

const getCustomersComposeText = async (query) => {
  Object.keys(query).forEach(
    (key) => (query[key] === '' || query[key] === null) && delete query[key]
  );
  return await axios.get(`/customers/compose-text?${qs.stringify(query)}`);
};

const getCustomer = async (customerId) => {
  return await axios.get(`/customers/${customerId}`);
};

const updateCustomer = async (customerId, data) => {
  return await axios.patch(`/customers/${customerId}`, data);
};

const deleteCustomer = async (customerId) => {
  return await axios.delete(`/customers/${customerId}`);
};

const editCustomer = async (customerId, data) => {
  return await axios.post(`/customers/${customerId}/edit`, data);
};

const readFile = async (file) => {
  var formData = new FormData();
  formData.append('file', file[0]);
  return await axios.post('/customers/file', formData);
};

const validateCustomerCampaign = async (selectedPhones) => {
  return await axios.post('/customers/validate/composeText', selectedPhones);
};

export default {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomersComposeText,
  editCustomer,
  readFile,
  addCustomerFromExcel,
  validateCustomerCampaign
};
