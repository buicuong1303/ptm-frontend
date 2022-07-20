import axios from './axiosClient';
import * as qs from 'query-string';
const createSignature = async (signature) => {
  return await axios.post('/signatures', signature);
};

const getSignatures = async (queries = {}) => {
  return await axios.get(`/signatures?${qs.stringify(queries)}`);
};

const getSignaturesActive = async () => {
  return await axios.get('/signatures/active');
};

const getSignature = async (signatureId) => {
  return await axios.get(`/signatures/${signatureId}`);
};

const updateSignature = async (signatureId, signature) => {
  return await axios.patch(`/signatures/${signatureId}`, signature);
};

const deleteSignature = async (signatureId) => {
  return await axios.delete(`/signatures/${signatureId}`);
};

export default {
  createSignature,
  getSignatures,
  getSignature,
  updateSignature,
  deleteSignature,
  getSignaturesActive
};
