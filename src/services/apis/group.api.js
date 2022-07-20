/* eslint-disable no-unused-vars */
import axios from 'services/apis/axiosClient';

const createGroup = (data) => {
  return axios.post('/groups', data);
};

const getGroup = async () => {
  return axios.get('/groups');
};

const updateGroup = (data) => {
  return axios.patch(`/groups/${data.groupId}`, data.newGroup);
};

const getCustomersInGroup = (groupId) => {
  return axios.get(`/groups/${groupId}`);
};

const deleteGroup = (groupId) => {
  return axios.delete(`/groups/${groupId}`);
};

const deleteCustomerInGroup = (data) => {
  return axios.delete(`/groups/${data.groupId}/customers/${data.customerId}`);
};

const changeStatusGroupCustomer = (data) => {
  return axios.post('/groups-customers', data);
};

const readFile = (file, groupId) => {
  var formData = new FormData();
  formData.append('file', file[0]);
  return axios.post(`/groups/${groupId}/file`, formData);
};

const addCustomersToGroup = (data) => {
  return axios.post(`/customers/groups/${data.groupId}`, data.data);
};

export default {
  createGroup,
  getGroup,
  getCustomersInGroup,
  changeStatusGroupCustomer,
  readFile,
  addCustomersToGroup,
  deleteGroup,
  deleteCustomerInGroup,
  updateGroup
};
