import axios from './axiosClient';
import * as qs from 'query-string';
const getDashBoard = async (query) => {
  Object.keys(query).forEach((key) => !query[key] && delete query[key]);
  return await axios.get(`/dashboard?${qs.stringify(query)}`);
};
const getLastContactCustomers = async (query) => {
  Object.keys(query).forEach((key) => !query[key] && delete query[key]);
  return await axios.get(
    `/dashboard/last-contact-customers?${qs.stringify(query)}`
  );
};

export default { getDashBoard, getLastContactCustomers };
