/* eslint-disable no-unused-vars */
import axios from 'services/apis/axiosClient';
import * as qs from 'query-string';
const getNotificationsOfUser = ({ userId, _page, _limit = 5, filters }) => {
  const query = { ...filters, _page, _limit };
  Object.keys(query).forEach((key) => query[key]);
  return axios.get(`/notifications/users/${userId}?${qs.stringify(query)}`);
};

const readNotifications = ({ userId, notificationIds }) => {
  return axios.patch(`/notifications/users/${userId}`, { notificationIds });
};
const readAllNotifications = ({ userId }) => {
  return axios.patch(`/notifications/users/${userId}/readAll`);
};
const updateNotification = ({ userId, notificationId, readStatus }) => {
  return axios.patch(`/notifications/${notificationId}/users/${userId}`, {
    readStatus
  });
};
export default {
  getNotificationsOfUser,
  readNotifications,
  readAllNotifications,
  updateNotification
};
