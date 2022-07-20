/* eslint-disable no-unused-vars */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { scheduleApi, messageApi } from 'services/apis';
import { promisify } from 'util';
import { convertUrlToBase64 } from 'utils/convertUrlToBase64';
import * as xlsx from 'xlsx';

const validateScheduleMessage = createAsyncThunk(
  'schedule/validateScheduleMessage',
  async (data, props) => {
    try {
      const response = await scheduleApi.validateScheduleMessage(data);

      return response.data;
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const createScheduleMessage = createAsyncThunk(
  'schedule/createScheduleMessage',
  async (data, props) => {
    try {
      const templatePreSign = {};
      if (data.customerUrl.data)
        templatePreSign['customerFile'] = {
          fileName: data.customerUrl.name,
          type: data.customerUrl.type
        };

      if (data.attachmentUrls.length > 0)
        templatePreSign['attachments'] = data.attachmentUrls.map((item) => ({
          fileName: item.detail.name,
          type: item.detail.type
        }));
      const preSignUrl = await scheduleApi.getPreSignUrl(templatePreSign);

      const finalData = {
        content: data.content,
        name: data.name,
        companyId: data.company,
        campaignId: data.campaign,
        isCronExpression: data.isCronExpression,
        cronExpression: data.cronExpression,
        customFields: data.customFields,
        dateTime: data.dateTime,
        canRetry: data.canRetry
      };

      if (preSignUrl.data.attachmentUrls) {
        const uploadAttachments = preSignUrl.data.attachmentUrls.map(
          (url, index) =>
            messageApi.uploadFile(url, data.attachmentUrls[index].detail)
        );
        let uploadedAttachmentUrls = await Promise.all(uploadAttachments);

        uploadedAttachmentUrls = uploadedAttachmentUrls.map((item, index) => ({
          url: item.config.url.slice(0, item.config.url.indexOf('?')),
          type: data.attachmentUrls[index].detail.type,
          name: data.attachmentUrls[index].detail.name,
          size: item.config.data.byteLength,
          width: data.attachmentUrls[index].detail.width,
          height: data.attachmentUrls[index].detail.height
        }));
        finalData['attachmentUrls'] = uploadedAttachmentUrls;
      }
      if (preSignUrl.data.customerUrl) {
        let uploadedCustomerFile = await messageApi.uploadFile(
          preSignUrl.data.customerUrl,
          data.customerUrl
        );
        uploadedCustomerFile = {
          url: uploadedCustomerFile.config.url.slice(
            0,
            uploadedCustomerFile.config.url.indexOf('?')
          ),
          type: data.customerUrl.type,
          name: data.customerUrl.name,
          size: uploadedCustomerFile.config.data.byteLength
        };
        finalData['customerUrl'] = uploadedCustomerFile;
      }
      await scheduleApi.createScheduleMessage(finalData);
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const getScheduleMessages = createAsyncThunk(
  'schedule/getScheduleMessages',
  async (data, props) => {
    try {
      const response = await scheduleApi.getScheduleMessages(data);
      return {
        firstLoad: data.firstLoad,
        data: response.data
      };
      // return response.data;
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const getPullingScheduleMessages = createAsyncThunk(
  'schedule/getPullingScheduleMessages',
  async (data, props) => {
    try {
      const response = await scheduleApi.getPullingScheduleMessages(data);
      return response.data;
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const getScheduleMessage = createAsyncThunk(
  'schedule/getScheduleMessage',
  async (data, props) => {
    try {
      const response = await scheduleApi.getScheduleMessage(data);

      const convertUrlToBase64Promise = promisify(convertUrlToBase64);
      const result = await convertUrlToBase64Promise(
        response.data.customerUrl.url
      );
      const workbook = xlsx.read(result.data, { type: 'buffer' });
      const ws = workbook.Sheets[workbook.SheetNames[0]];
      const arrayJson = xlsx.utils.sheet_to_json(ws, { raw: false });
      if (arrayJson.length > 0) {
        const headers = Object.keys(arrayJson[0]) || [];
        response.data.customFields = headers.reduce((total, header) => {
          const infoField = response.data.customFields.find(
            (field) => field.column === header
          );
          if (infoField) return [...total, { ...infoField, status: 'active' }];
          else return [...total, { column: header, status: 'inactive' }];
        }, []);
      }

      return response.data;
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const getMessageSetOfScheduleRetry = createAsyncThunk(
  'schedule/getMessageSetOfScheduleRetry',
  async (data, props) => {
    try {
      const response = await scheduleApi.getMessageSetOfScheduleRetry(data);
      return response.data;
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const updateScheduleMessage = createAsyncThunk(
  'schedule/updateScheduleMessage',
  async (data, props) => {
    try {
      const templatePreSign = {};
      if (data.customerUrl.data)
        templatePreSign['customerFile'] = {
          fileName: data.customerUrl.name,
          type: data.customerUrl.type
        };
      const attachmentsToUpload = [];
      const attachmentsNotToUpload = [];
      if (data.attachmentUrls) {
        data.attachmentUrls.forEach((item) => {
          if (item.detail) attachmentsToUpload.push(item);
          else attachmentsNotToUpload.push(item);
        });
        if (attachmentsToUpload.length > 0)
          templatePreSign['attachments'] = attachmentsToUpload.map((item) => ({
            fileName: item.detail.name,
            type: item.detail.type
          }));
      }
      const finalData = {
        content: data.content,
        name: data.name,
        companyId: data.company,
        campaignId: data.campaign,
        customerUrl: data.customerUrl,
        cronExpression: data.cronExpression,
        customFields: data.customFields,
        attachmentUrls: data.attachmentUrls ? data.attachmentUrls : [],
        dateTime: data.dateTime,
        isCronExpression: data.isCronExpression,
        creationUserId: data.creationUserId,
        canRetry: data.canRetry
      };
      if (Object.keys(templatePreSign).length > 0) {
        const preSignUrl = await scheduleApi.getPreSignUrl(templatePreSign);

        if (preSignUrl.data.attachmentUrls) {
          const uploadAttachments = preSignUrl.data.attachmentUrls.map(
            (url, index) =>
              messageApi.uploadFile(url, attachmentsToUpload[index].detail)
          );

          let uploadedAttachmentUrls = await Promise.all(uploadAttachments);
          uploadedAttachmentUrls = uploadedAttachmentUrls.map(
            (item, index) => ({
              url: item.config.url.slice(0, item.config.url.indexOf('?')),
              type: attachmentsToUpload[index].detail.type,
              name: attachmentsToUpload[index].detail.name,
              size: item.config.data.byteLength
            })
          );
          finalData['attachmentUrls'] = [
            ...attachmentsNotToUpload,
            ...uploadedAttachmentUrls
          ];
        }
        if (preSignUrl.data.customerUrl) {
          let uploadedCustomerFile = await messageApi.uploadFile(
            preSignUrl.data.customerUrl,
            data.customerUrl
          );
          uploadedCustomerFile = {
            url: uploadedCustomerFile.config.url.slice(
              0,
              uploadedCustomerFile.config.url.indexOf('?')
            ),
            type: data.customerUrl.type,
            name: data.customerUrl.name,
            size: uploadedCustomerFile.config.data.byteLength
          };
          finalData['customerUrl'] = uploadedCustomerFile;
        }
      }
      await scheduleApi.updateScheduleMessage(data.id, finalData);
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const stopScheduleMessage = createAsyncThunk(
  'schedule/stopScheduleMessage',
  async (data, props) => {
    try {
      const response = await scheduleApi.stopSchedule(data);
      return response.data;
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const pauseScheduleMessage = createAsyncThunk(
  'schedule/pauseScheduleMessage',
  async (data, props) => {
    try {
      const response = await scheduleApi.pauseSchedule(data);
      return response.data;
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const resumeScheduleMessage = createAsyncThunk(
  'schedule/resumeScheduleMessage',
  async (data, props) => {
    try {
      const response = await scheduleApi.resumeSchedule(data);
      return response.data;
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const deleteScheduleMessage = createAsyncThunk(
  'schedule/deleteScheduleMessage',
  async (data, props) => {
    try {
      const response = await scheduleApi.deleteScheduleMessage(data);
      return data;
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const getMessageSetsOfSchedule = createAsyncThunk(
  'schedule/getMessageSetsOfSchedule',
  async (data, props) => {
    try {
      const response = await scheduleApi.getMessageSetsOfSchedule(data);
      return response.data;
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

export {
  validateScheduleMessage,
  createScheduleMessage,
  getScheduleMessages,
  updateScheduleMessage,
  getScheduleMessage,
  stopScheduleMessage,
  resumeScheduleMessage,
  pauseScheduleMessage,
  deleteScheduleMessage,
  getMessageSetsOfSchedule,
  getPullingScheduleMessages,
  getMessageSetOfScheduleRetry
};
