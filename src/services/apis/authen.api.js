/* eslint-disable no-unused-vars */
import axios from 'services/apis/axiosClient';

const signUp = (data) => {
  return axios.post('/auth/sign-up', data);
};

const signIn = (data) => {
  return axios.post('/auth/sign-in', data);
};

const verifyAccount = (token) => {
  return axios.get(`/auth/verify?token=${token}`);
};
const forgotPassword = (data) => {
  return axios.post('/auth/forgot-password', data);
};

const resendEmail = (data) => {
  return axios.post('/auth/resend-email', data);
};

const resetPassword = (data) => {
  return axios.patch('/auth/reset-password', data);
};

export default {
  signUp,
  verifyAccount,
  signIn,
  forgotPassword,
  resendEmail,
  resetPassword
};
