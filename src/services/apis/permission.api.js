import axios from 'services/apis/axiosClient';

const getPermission = async () => {
  return await axios.get('/permissions');
};

const updatePermission = async (data) => {
  return await axios.patch('/permissions', data);
};

const addPermission = async (data) => {
  return await axios.post('/permissions', data);
};

const deletePermission = async (data) => {
  return await axios.delete(
    `/permissions/${data.oldObj}/actions/${data.oldAct}`
  );
};

const getPermissionOfClient = async (data) => {
  return await axios.get(`/permissions/client/${data}`);
};

export default {
  getPermission,
  updatePermission,
  addPermission,
  deletePermission,
  getPermissionOfClient
};
