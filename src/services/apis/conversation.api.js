/* eslint-disable no-unused-vars */
import axios from 'services/apis/axiosClient';

const editConversation = (id, data) => {
  return axios.patch(`/conversations/${id}`, data);
};

const assignLabelToConversation = (id, data) => {
  return axios.put(`/conversations/${id}`, data);
};

const editConversations = (ids, data) => {
  return axios.patch('/conversations', { ids: ids, ...data });
};
export default {
  editConversation,
  assignLabelToConversation,
  editConversations
};
