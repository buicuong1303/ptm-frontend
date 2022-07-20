import axios from 'services/apis/axiosClient';

const getConversationHistory = (data) => {
  return axios.post('/view-history', data);
};

export default {
  getConversationHistory
};
