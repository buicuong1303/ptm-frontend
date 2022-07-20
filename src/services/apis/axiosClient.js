/* eslint-disable no-undef */
import axios from 'axios';

const instance = axios.create({
  baseURL: window._env_.REACT_APP_BASE_URL
});

instance.interceptors.request.use(
  (config) => {
    //TODO: ignore Authorization in header if Origin AWS S3

    //* Do something before request is sent
    const token = localStorage.getItem('accessToken');
    if (
      config.headers['Authorization'] === null ||
      config.headers['Authorization'] === '' ||
      config.headers['Authorization'] === undefined
    ) {
      if (token && !config.url.includes(window._env_.REACT_APP_S3_BUCKET_URL)) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    //Any status code that lie within the rage of 2xx cause this function to trigger
    //Do something with response data
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = `${window.location.origin}/auth/sign-in`;
    }
    return Promise.reject(error);
  }
);
export default instance;
