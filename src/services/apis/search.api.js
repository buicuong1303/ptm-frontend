import axios from './axiosClient';
const searchAll = async (data) => {
  return await axios.post('/messages/search-scroll', data);
};
const loadMoreResult = async (data) => {
  return await axios.post('/messages/scroll', data);
};
const clearScroll = async (data) => {
  return await axios.post('/messages/search-scroll/clear', data);
};
export default { searchAll, loadMoreResult, clearScroll };
