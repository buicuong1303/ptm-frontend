import axios from './axiosClient';
// import * as qs from 'query-string';
// const createSignature = async (signature) => {
//   return await axios.post('/sensitives', signature);
// };

const getSensitive = async () => {
  return await axios.get('/sensitives');
};

const updateSensitive = async (data) => {
  return await axios.patch(`/sensitives/${data.sensitiveId}`, data.sensitive);
};

const createSensitive = async (data) => {
  // console.log(data);
  return await axios.post('/sensitives', data.sensitive);
};

const deleteSensitive = async (data) => {
  return await axios.delete(`/sensitives/${data.sensitiveId}`);
};

// const updateSignature = async (signatureId, signature) => {
//   return await axios.patch(`/sensitives/${signatureId}`, signature);
// };

// const deleteSignature = async (signatureId) => {
//   return await axios.delete(`/sensitives/${signatureId}`);
// };

export default {
  getSensitive,
  updateSensitive,
  createSensitive,
  deleteSensitive
};
