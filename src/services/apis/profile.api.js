/* eslint-disable no-unused-vars */
import axios from 'services/apis/axiosClient';
import * as qs from 'query-string';

const getProfile = async () => {
  return await axios.get('/users/profile');
};

const updateProfile = async (profile) => {
  return await axios.patch('/users/profile', profile);
};

const avatarSignedUrl = async (query) => {
  return await axios.get(`/users/avatar-signed-url?${qs.stringify(query)}`);
};

const uploadAvatar = async (url, fileInfo) => {
  return await axios.put(url, fileInfo.data, {
    headers: {
      'Content-Type': fileInfo.type
    }
  });
};

const updateAvatar = async (query) => {
  return await axios.patch(`/users/avatar?${qs.stringify(query)}`);
};

export default {
  getProfile,
  updateProfile,
  avatarSignedUrl,
  uploadAvatar,
  updateAvatar
};
