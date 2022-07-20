import axios from 'services/apis/axiosClient';
import qs from 'query-string';
const getPreSignUrl = (data) => {
  return axios.post('/schedule-messages/signed-url', data);
};

const validateScheduleMessage = async (data) => {
  const isFile = !!data?.customerUrl?.path;
  let formData = new FormData();
  formData.append('file', data?.customerUrl);
  formData.append('isFile', isFile);
  formData.append(
    'fileInformation',
    !isFile ? JSON.stringify(data?.customerUrl) : ''
  );
  formData.append('campaignId', data?.campaignId);
  formData.append('content', data?.content);
  formData.append('customFields', JSON.stringify(data?.customFields));

  return await axios.post('/schedule-messages/validate', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const createScheduleMessage = (data) => {
  console.log(data);
  return axios.post('/schedule-messages', data);
};

const updateScheduleMessage = (id, data) => {
  return axios.put(`/schedule-messages/update/${id}`, data);
};

const getScheduleMessages = (queries) => {
  return axios.get(`/schedule-messages?${qs.stringify(queries)}`);
};

const getPullingScheduleMessages = (queries) => {
  return axios.get(`/schedule-messages/pulling?${qs.stringify(queries)}`);
};

const getScheduleMessage = (id) => {
  return axios.get(`/schedule-messages/${id}`);
};

const deleteScheduleMessage = (id) => {
  return axios.delete(`/schedule-messages/${id}`);
};

const stopSchedule = (data) => {
  // console.log(data);
  return axios.patch(`/schedule-messages/stop/${data.id}`, {
    creationUserId: data.creationUserId
  });
};

const pauseSchedule = (data) => {
  return axios.patch(`/schedule-messages/pause/${data.id}`, {
    creationUserId: data.creationUserId
  });
};

const resumeSchedule = (data) => {
  return axios.patch(`/schedule-messages/resume/${data.id}`, {
    creationUserId: data.creationUserId
  });
};

const getMessageSetsOfSchedule = (id) => {
  return axios.get(`/schedule-messages/${id}/message-sets`);
};

const getMessageSetOfScheduleRetry = (id) => {
  return axios.get(`/schedule-messages/${id}/message-sets/retry`);
};

export default {
  getPreSignUrl,
  validateScheduleMessage,
  createScheduleMessage,
  getScheduleMessages,
  getScheduleMessage,
  updateScheduleMessage,
  stopSchedule,
  pauseSchedule,
  resumeSchedule,
  deleteScheduleMessage,
  getMessageSetsOfSchedule,
  getPullingScheduleMessages,
  getMessageSetOfScheduleRetry
};
