/* eslint-disable no-unused-vars */
import axios from './axiosClient';

const userInfo = {
  id: '72af4eeb-4b0f-40f0-a7e9-63efa7661004',
  username: 'brandon',
  password: '11111111',
  email: 'brandon@phpbroker.com',
  firstName: 'Brandon',
  lastName: 'Nguyen',
  gender: 'male',
  phone: '0358432533',
  department: 'IT - Software Team',
  company: 'PHP Group VN',
  resetPasswordToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJyYW5kb25AcGhwYnJva2VyLmNvbSIsImlhdCI6MTYwMTI2NDg4NSwiZXhwIjoxNjAxMjY4NDg1fQ._XA8pHfb-qsw50CQzVTjN_gVFfRzZdoLd9Pr3CxYcKM',
  creationUserId: '138a7c47-172f-4d07-8cb2-9c72fa4323d6',
  lastModifiedUserId: '138a7c47-172f-4d07-8cb2-9c72fa4323d6',
  creationTime: '2020-06-04T08:15:19.949Z',
  lastModifiedTime: '2020-11-13T09:57:01.641Z',
  status: 'active',
  avatar:
    'http://127.0.0.1:3000/public/images/avatars/72af4eeb-4b0f-40f0-a7e9-63efa7661004.png'
};

const fakeApi = (resolve = true, dataReturn, timeDelay) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (resolve) return res({ data: dataReturn });
      return rej();
    }, timeDelay);
  });
};

const getUserInfo = () => {
  // return axios.get('/auth/user-info');
  fakeApi(userInfo, 1000);
};

const login = (data) => {
  if (data.username === 'brandon') return fakeApi(true, { data: true }, 100);
  return fakeApi(false, { data: false }, 100);
};

const updateSetting = async (data) => {
  return await axios.patch('/users/setting', data);
};

export default {
  getUserInfo,
  login,
  updateSetting
};
