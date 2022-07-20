import axios from 'services/apis/axiosClient';

const getRole = async () => {
  return await axios.get('/roles');
};

const updateRole = async (data) => {
  return await axios.patch('/roles/permissions', data);
};

const updateRoleName = async (data) => {
  return await axios.patch('/roles/', data);
};

const addRole = async (data) => {
  return await axios.post('/roles/', data);
};

const deleteRole = async (data) => {
  return await axios.delete(`/roles/${data}`);
};

export default {
  getRole,
  updateRole,
  updateRoleName,
  addRole,
  deleteRole
};
