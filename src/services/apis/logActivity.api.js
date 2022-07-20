import axios from 'services/apis/axiosClient';

const getLogActivities = (data) => {
  return axios.get(
    `/log-activities?from=${data.from}&to=${data.to}&userId=${data.userId}&logAction=${data.logAction}&logType=${data.logType}&conversationId=${data.conversationId}&participantId=${data.participantId}&limit=${data.limit}&currentItem=${data.currentItem}`
  );
};

export default {
  getLogActivities
};
