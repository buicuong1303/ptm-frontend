/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import axios from './axiosClient';
import * as qs from 'query-string';

const loadMoreMessagesInConversation = async (conversationId, query) => {
  Object.keys(query).forEach((key) => !query[key] && delete query[key]);
  return await axios.get(
    `/messages/conversation/${conversationId}/load-two-way?${qs.stringify(
      query
    )}`
  );
};

const getConversationsOfUser = async (query, body) => {
  Object.keys(query).forEach((key) => !query[key] && delete query[key]);
  return await axios.post(`/conversations/user?${qs.stringify(query)}`, body);
};

const getNewConversationOfUser = async (query) => {
  Object.keys(query).forEach((key) => !query[key] && delete query[key]);
  return await axios.get(
    `/conversations/${query.id}/new?${qs.stringify(query)}`
  );
};

const jumpToMessageInConversation = async (conversationId, messageId) => {
  return await axios.get(
    `/messages/conversation/${conversationId}/jump/${messageId}`
  );
};

const loadTwoWay = async (conversationId, query) => {
  return await axios.get(
    `/messages/conversation/${conversationId}/load-two-way?${qs.stringify(
      query
    )}`
  );
};
const updateUmnConversation = async (participantId, readStatus = 'read') => {
  return await axios.patch(
    `/participants/${participantId}/updateUmnConversation`,
    {
      readStatus
    }
  );
};
const updateUmnConversations = async (participantIds, readStatus = 'read') => {
  return await axios.post('/participants/updateUmnConversations', {
    readStatus,
    participantIds
  });
};
const getPreSignUrl = async (query) => {
  return await axios.get(
    `/messages/attachment-signed-url?${qs.stringify(query)}`
  );
};

const uploadFile = async (url, fileInfo) => {
  return await axios.put(url, fileInfo.data, {
    headers: {
      'Content-Type': fileInfo.type
    }
  });
};

const sendComposeText = async (data) => {
  const formData = new FormData();

  if (data.files.length > 0) {
    data.files.forEach((file) => {
      formData.append('files', file, file.name);
    });
  }

  formData.append('message', data.message);
  formData.append('companyId', data.companyId);
  formData.append('signatureId', data.signatureId);
  formData.append('personalSignature', data.personalSignature);
  if (data.customerPhones.length > 0) {
    data.customerPhones.forEach((phone) => {
      formData.append('customerPhones[]', phone);
    });
  }

  return await axios.post('/messages/compose-text', formData);
};
const getInfoPaginationMessages = async (conversationId) => {
  return await axios.get(`/messages/pagination/conversation/${conversationId}`);
};

export default {
  loadMoreMessagesInConversation,
  getConversationsOfUser,
  getNewConversationOfUser,
  updateUmnConversation,
  updateUmnConversations,
  getPreSignUrl,
  uploadFile,
  sendComposeText,
  getInfoPaginationMessages,
  jumpToMessageInConversation,
  loadTwoWay
};
