/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { createAsyncThunk } from '@reduxjs/toolkit';
import apiStatus from 'utils/apiStatus';
import {
  callLogApi,
  messageApi,
  signatureApi,
  customerApi,
  conversationApi
} from 'services/apis';
import { convertFileSize } from 'utils/convertFileSize';

const getConversationsOfUser = createAsyncThunk(
  'message/conversationsOfUser',
  async (data, props) => {
    try {
      const query = {
        page: data.page,
        limitConversations: data.limitConversations,
        limitMessageInConversations: data.limitMessageInConversations,
        companyId: data.company.id
      };
      const body = {
        types: data.types,
        search: data.search,
        labels: data.labels,
        users: data.users
      };
      const response = await messageApi.getConversationsOfUser(query, body);
      const conversations = response.data.data.map((item) => {
        return {
          id: item.id,
          isCompleted: item.isCompleted,
          newOrExisting: item.newOrExisting,
          participantId: item.participantId,
          umn: item.umn,
          name: item.name,
          lastModifiedTime: item.lastModifiedTime,
          lastUser: {
            id: item.lastUser ? item.lastUser.id : '',
            name: item.lastUser
              ? item.lastUser.firstName + ' ' + item.lastUser.lastName
              : '',
            email: item.lastUser ? item.lastUser.email : '',
            avatar: item.lastUser ? item.lastUser.avatar : '',
            phone: item.lastUser ? item.lastUser.phone : '',
            company: item.lastUser ? item.lastUser.company : '',
            department: item.lastUser ? item.lastUser.department : '',
            lastActivity: item.lastUser ? item.lastUser.lastActivity : '',
            status: item.lastUser ? item.lastUser.status : ''
          },
          lastMessage: {
            id: item.lastMessage ? item.lastMessage.id : '',
            text: item.lastMessage ? item.lastMessage.text : '',
            direction: item.lastMessage ? item.lastMessage.direction : '',
            mode: item.lastMessage ? item.lastMessage.mode : '',
            exCreationTime: item.lastMessage
              ? item.lastMessage.exCreationTime
              : '',
            exMessageStatus: item.lastMessage
              ? item.lastMessage.exMessageStatus
              : '',
            lastModifiedUserId: item.lastMessage
              ? item.lastMessage.lastModifiedUserId
              : '',
            creationTime: item.lastMessage ? item.lastMessage.creationTime : '',
            status: item.lastMessage ? item.lastMessage.messageStatus : '',
            type: item.lastMessage ? item.lastMessage.type : ''
          },
          customer: {
            id: item.customer ? item.customer.id : '',
            fullName: item.customer ? item.customer.fullName : '',
            phone: item.customer ? item.customer.phoneNumber : '',
            email: item.customer ? item.customer.emailAddress : '',
            status: item.customer ? item.customer.status : '',
            companies: item.customer.companies ? item.customer.companies : [],
            campaigns: item.customer.campaigns ? item.customer.campaigns : []
          },
          messages: item.messages.reverse().map((message) => {
            return {
              id: message.id,
              text: message.text,
              attachments: message.attachments,
              direction: message.direction,
              call: message.call,
              mode: message.mode,
              sender: {
                id: message.creationUserId ? message.creationUserId.id : '',
                name: message.creationUserId
                  ? message.creationUserId.firstName +
                    ' ' +
                    message.creationUserId.lastName
                  : '',
                email: message.creationUserId
                  ? message.creationUserId.email
                  : '',
                avatar: message.creationUserId
                  ? message.creationUserId.avatar
                  : ''
              },
              creationTime: message.creationTime,
              exCreationTime: message.exCreationTime,
              messageStatus: message.messageStatus,
              exMessageStatus: message.exMessageStatus,
              conversationId: message.conversationId,
              index: message.index,
              type: message.type,
              companyCode: message.companyCode,
              isPolling: message.isPolling
            };
          }),
          labels: item.labels
        };
      });

      return {
        conversations: conversations,
        company: data.company,
        pagination: response.data.pagination
      };
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data, company: data.company };
      return props.rejectWithValue(payload);
    }
  }
);

const loadMoreMessagesInConversation = createAsyncThunk(
  'message/messagesInConversation',
  async (data, props) => {
    try {
      const query = {
        topBoundary: data.topBoundary,
        limitMessageInConversations: data.limitMessageInConversations
      };
      const response = await messageApi.loadMoreMessagesInConversation(
        data.conversationId,
        query
      );

      const messages = response.data.messages.map((item) => {
        return {
          id: item.id,
          text: item.text,
          attachments: item.attachments,
          direction: item.direction,
          sender: {
            id: item.creationUserId ? item.creationUserId.id : '',
            name: item.creationUserId
              ? item.creationUserId.firstName +
                ' ' +
                item.creationUserId.lastName
              : '',
            email: item.creationUserId ? item.creationUserId.email : '',
            avatar: item.creationUserId ? item.creationUserId.avatar : ''
          },
          creationTime: item.creationTime,
          exCreationTime: item.exCreationTime,
          messageStatus: item.messageStatus,
          exMessageStatus: item.exMessageStatus,
          conversationId: item.conversationId,
          index: item.index,
          isPolling: item.isPolling
        };
      });
      return {
        conversationId: data.conversationId,
        company: data.company,
        messages: messages,
        pagination: response.data.pagination
      };
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().message.isLoadingPreviousMessages === true) return false;
    },
    dispatchConditionRejection: false //* default false: don't dispatch reject action
  }
);

const loadPreviousMessages = createAsyncThunk(
  'message/loadPreviousMessagesInconversations',
  async (data, props) => {
    try {
      const { conversationId, query } = data;
      const response = await messageApi.loadTwoWay(conversationId, query);
      const messages = response.data.messages.map((item) => {
        return {
          id: item.id,
          text: item.text,
          attachments: item.attachments,
          direction: item.direction,
          sender: {
            id: item.creationUserId ? item.creationUserId.id : '',
            name: item.creationUserId
              ? item.creationUserId.firstName +
                ' ' +
                item.creationUserId.lastName
              : '',
            email: item.creationUserId ? item.creationUserId.email : '',
            avatar: item.creationUserId ? item.creationUserId.avatar : ''
          },
          creationTime: item.creationTime,
          exCreationTime: item.exCreationTime,
          messageStatus: item.messageStatus,
          exMessageStatus: item.exMessageStatus,
          conversationId: item.conversationId,
          index: item.index,
          isPolling: item.isPolling
        };
      });
      return {
        pagination: response.data.pagination,
        messages: messages
      };
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().message.isLoadingPreviousMessages === true) return false;
    },
    dispatchConditionRejection: true //* default false: don't dispatch reject action
  }
);

const loadNextMessages = createAsyncThunk(
  'message/isLoadingNextMessagesInconversations',
  async (data, props) => {
    try {
      const { conversationId, query } = data;
      const response = await messageApi.loadTwoWay(conversationId, query);
      const messages = response.data.messages.map((item) => {
        return {
          id: item.id,
          text: item.text,
          attachments: item.attachments,
          direction: item.direction,
          sender: {
            id: item.creationUserId ? item.creationUserId.id : '',
            name: item.creationUserId
              ? item.creationUserId.firstName +
                ' ' +
                item.creationUserId.lastName
              : '',
            email: item.creationUserId ? item.creationUserId.email : '',
            avatar: item.creationUserId ? item.creationUserId.avatar : ''
          },
          creationTime: item.creationTime,
          exCreationTime: item.exCreationTime,
          messageStatus: item.messageStatus,
          exMessageStatus: item.exMessageStatus,
          conversationId: item.conversationId,
          index: item.index,
          isPolling: item.isPolling
        };
      });
      return {
        company: data.company,
        pagination: response.data.pagination,
        messages: messages,
        conversationId
      };
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().message.isLoadingNextMessages === true) return false;
    },
    dispatchConditionRejection: true //* default false: don't dispatch reject action
  }
);

const jumpToMessageInConversation = createAsyncThunk(
  'message/jumpToMessageInConversation',
  async (data, props) => {
    try {
      const { messageId, company, conversationId, highlights } = data;
      const response = await messageApi.jumpToMessageInConversation(
        conversationId,
        messageId
      );
      const messages = response.data.messages.map((item) => {
        return {
          id: item.id,
          text: item.text,
          attachments: item.attachments,
          direction: item.direction,
          sender: {
            id: item.creationUserId ? item.creationUserId.id : '',
            name: item.creationUserId
              ? item.creationUserId.firstName +
                ' ' +
                item.creationUserId.lastName
              : '',
            email: item.creationUserId ? item.creationUserId.email : '',
            avatar: item.creationUserId ? item.creationUserId.avatar : ''
          },
          creationTime: item.creationTime,
          exCreationTime: item.exCreationTime,
          messageStatus: item.messageStatus,
          exMessageStatus: item.exMessageStatus,
          conversationId: item.conversationId,
          index: item.index,
          isPolling: item.isPolling
        };
      });
      return {
        messages: messages,
        pagination: response.data.pagination,
        messageId,
        highlights,
        company,
        conversationId
      };
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const updateUmnConversation = createAsyncThunk(
  'message/updateUmnConversation',
  async (data, props) => {
    try {
      //* data = { conversationId: selectedNewConversationId, participantId: participantId }
      await messageApi.updateUmnConversation(
        data.participantId,
        data.readStatus
      );

      return data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().message.status === apiStatus.PENDING) {
        return false;
      }
    },
    dispatchConditionRejection: true //* default false: don't dispatch reject action
  }
);

const updateUmnConversations = createAsyncThunk(
  'message/updateUmnConversations',
  async (data, props) => {
    try {
      //* data = { conversationId: selectedNewConversationId, participantId: participantId }
      const result = await messageApi.updateUmnConversations(
        data.participantIds,
        data.readStatus
      );

      return data;
    } catch (err) {
      const newError = { ...err };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  },
  {
    condition: (data, { getState }) => {
      if (getState().message.status === apiStatus.PENDING) {
        return false;
      }
    },
    dispatchConditionRejection: true //* default false: don't dispatch reject action
  }
);

const uploadAttachments = createAsyncThunk(
  'message/uploadAttachments',
  async (data, props) => {
    try {
      const getSignUrl = data.map((file) => {
        return messageApi.getPreSignUrl({
          fileName: file.detail.name,
          type: file.detail.type
        });
      });
      const listSignedUrl = await Promise.all(getSignUrl);
      const uploadFiles = listSignedUrl.map((file, index) => {
        return messageApi.uploadFile(file.data, data[index].detail);
      });

      const infoFileAfterUpload = await Promise.all(uploadFiles);

      return listSignedUrl.map((url, index) => ({
        url: url.data,
        type: data[index].detail.type,
        name: data[index].detail.name,
        size: convertFileSize(
          infoFileAfterUpload[index].config.data.byteLength
        ),
        height: data[index].detail.height,
        width: data[index].detail.width
      }));
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const getInfoPaginationMessages = createAsyncThunk(
  'message/getInfoPaginationMessages',
  async (data, props) => {
    try {
      const res = await messageApi.getInfoPaginationMessages(
        data.conversationId
      );
      return {
        ...data,
        pagination: res.data.pagination
      };
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const getNewConversationOfUser = createAsyncThunk(
  'message/getNewConversationOfUser',
  async (data, props) => {
    try {
      const response = await messageApi.getNewConversationOfUser({
        id: data.conversationId,
        companyCode: data.companyCode,
        limitMessageInConversations: 13
      });
      const newConversation = {
        ...response.data,
        company: data.companyCode,
        messages: response.data.messages.reverse().map((message) => ({
          ...message,
          sender: {
            id: message.creationUserId ? message.creationUserId.id : '',
            name: message.creationUserId
              ? message.creationUserId.firstName +
                ' ' +
                message.creationUserId.lastName
              : '',
            email: message.creationUserId ? message.creationUserId.email : '',
            avatar: message.creationUserId ? message.creationUserId.avatar : ''
          }
        }))
      };
      if (response.data.lastUser) {
        newConversation['lastUser'] = {
          ...response.data.lastUser,
          name:
            response.data.lastUser &&
            response.data.lastUser.firstName +
              ' ' +
              response.data.lastUser.lastName
        };
      }
      return newConversation;
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const getListSignatureActive = createAsyncThunk(
  'message/getListSignatureActive',
  async (data, props) => {
    try {
      const res = await signatureApi.getSignaturesActive();
      return res.data;
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const getCallLogRecords = createAsyncThunk(
  'message/getCallLogRecords',
  async (data, props) => {
    try {
      const res = await callLogApi.getCallLogRecords(data);
      return res.data;
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const editInfoClient = createAsyncThunk(
  'message/editInfoClient',
  async (data, props) => {
    try {
      const { customerId, ...rest } = data;
      const res = await customerApi.editCustomer(customerId, rest);
      const newCampaigns = res.data;
      data.campaigns = data.campaigns.map((item) => {
        const infoNewCampaign = newCampaigns.find(
          (newItem) => newItem.campaign.id === item.value
        );
        if (infoNewCampaign)
          return {
            ...item,
            id: infoNewCampaign.id
          };
        return item;
      });
      return data;
    } catch (error) {
      console.log(error);
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const editConversation = createAsyncThunk(
  'message/editConversation',
  async (data, props) => {
    try {
      const { id, ...rest } = data;
      const res = await conversationApi.editConversation(id, rest);
      // console.log(res);
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

const assignLabels = createAsyncThunk(
  'conversation/assignLabels',
  async (data, props) => {
    try {
      const res = await conversationApi.assignLabelToConversation(
        data.conversationId,
        { labels: data.labelIds }
      );
      return res.data;
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);
const editConversations = createAsyncThunk(
  'message/editConversations',
  async (data, props) => {
    try {
      const { ids, company, ...rest } = data;
      const res = await conversationApi.editConversations(ids, rest);
      return data;
    } catch (error) {
      const newError = { ...error };
      const payload = { error: newError.response.data };
      return props.rejectWithValue(payload);
    }
  }
);

export {
  loadMoreMessagesInConversation,
  updateUmnConversation,
  updateUmnConversations,
  getConversationsOfUser,
  uploadAttachments,
  getInfoPaginationMessages,
  jumpToMessageInConversation,
  loadPreviousMessages,
  loadNextMessages,
  getNewConversationOfUser,
  getListSignatureActive,
  getCallLogRecords,
  editInfoClient,
  editConversation,
  assignLabels,
  editConversations
};
