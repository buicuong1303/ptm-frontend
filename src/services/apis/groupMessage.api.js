import axios from 'services/apis/axiosClient';

const getGroupMessages = (page, pageSize, searchQuery, current, isReload) => {
  return axios.get('/group-messages', {
    params: { page, pageSize, searchQuery, current, isReload }
  });
};

export default {
  getGroupMessages
};
