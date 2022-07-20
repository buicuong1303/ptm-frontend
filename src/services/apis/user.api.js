import axios from 'services/apis/axiosClient';

const getUsers = () => {
  return axios.get('/users');
};

const changePassword = (data) => {
  return axios.patch('/users/change-password', data);
};

const updateUserApi = (data) => {
  return axios.post(`/users/${data.id}`, data);
};

const createUser = (data) => {
  return axios.post('/users/', data);
};

const deleteUser = (data) => {
  return axios.delete(`/users/${data}`);
};

const getCompaniesOfUser = (userId) => {
  return axios.get(`/users/${userId}/companies`);
};

const getFullInfor = () => {
  return axios.get('/users/permissions/roles');
};

export default {
  getUsers,
  changePassword,
  updateUserApi,
  createUser,
  deleteUser,
  getCompaniesOfUser,
  getFullInfor
};
