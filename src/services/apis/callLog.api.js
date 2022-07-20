/* eslint-disable no-unused-vars */
import axios from 'services/apis/axiosClient';

const getCallLogRecords = (data) => {
  if (data.from && data.to) {
    return axios.get(
      `/call-logs/${data.customerPhone}/company/${data.companyPhone}?dateFrom=${data.from}&dateTo=${data.to}&companyCode=${data.companyCode}`
    );
  } else {
    return axios.get(
      `/call-logs/${data.customerPhone}/company/${data.companyPhone}?companyCode=${data.companyCode}`
    );
  }
};

export default {
  getCallLogRecords
};
