/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit';
import apiStatus from 'utils/apiStatus';
import compareDate from 'utils/compareDate';
import {
  getConversationsOfUser,
  loadMoreMessagesInConversation,
  getInfoPaginationMessages,
  jumpToMessageInConversation,
  loadPreviousMessages,
  loadNextMessages,
  getNewConversationOfUser,
  getListSignatureActive,
  updateUmnConversation,
  updateUmnConversations,
  getCallLogRecords,
  assignLabels,
  editConversations
} from './Message.asyncAction';
import { omit } from 'lodash';
import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { getLogActivities } from 'scenes/LogActivity/LogActivity.asyncAction';

const MessagesSlice = createSlice({
  name: 'message',
  initialState: {
    conversations: {
      manager: {}
    },
    selectedConversation: {},
    currentMessages: {},
    listSignature: [],
    jumpMessages: {
      data: [],
      manager: {
        pagination: {},
        jumpStatus: null,
        hasNext: true,
        hasPrevious: true,
        isJumpingLatest: false,
        jumpMessageId: null,
        conversationId: null,
        highlights: {}
      }
    },
    inputting: null,
    typingUsers: [],
    loadingConversations: null,
    isLoadingNextMessage: null,
    isLoadingPreviousMessages: null,
    notificationMessage: null,
    status: null,
    message: null,
    firstLoadingAfterFilter: false,
    jumping: false,
    callLogs: {
      records: [],
      navigation: null
    },
    isEditingLabels: false,
    activitiesLog: {
      records: [],
      navigation: null
    }
  },
  reducers: {
    deselectConversation: (state, action) => {
      state.selectedConversation = {};
    },

    clearJumpingLatest: (state, action) => {
      state.jumpMessages.manager.isJumpingLatest = false;
    },

    clearJump: (state, action) => {
      state.jumpMessages = {
        data: [],
        manager: {
          pagination: {},
          jumpStatus: null,
          hasNext: true,
          hasPrevious: true,
          highlights: {}
        }
      };
    },

    setSearchValue: (state, action) => {
      const data = action.payload;
      state.jumpMessages.manager = {
        ...state.jumpMessages.manager,
        searchValue: data
      };
    },

    setFilters: (state, action) => {
      let { companyCode, ...rest } = action.payload;
      if (rest.types?.length > 0) {
        if (rest.types[rest.types.length - 1].value === 'new') {
          rest.types = rest.types.filter((item) => item.value !== 'existing');
        }
        if (rest.types[rest.types.length - 1].value === 'existing') {
          rest.types = rest.types.filter((item) => item.value !== 'new');
        }
        if (rest.types[rest.types.length - 1].value === 'completed') {
          rest.types = rest.types.filter((item) => item.value !== 'incomplete');
        }
        if (rest.types[rest.types.length - 1].value === 'incomplete') {
          rest.types = rest.types.filter((item) => item.value !== 'completed');
        }
      }
      state.conversations.manager[companyCode].filters = {
        ...state.conversations.manager[companyCode].filters,
        ...rest
      };
      state.conversations.manager[companyCode].hasNext = true;
      state.conversations.manager[companyCode].page = 1;
    },

    clearFilters: (state, action) => {
      const { companyCode } = action.payload;
      state.conversations.manager[companyCode].filters = {
        types: [],
        labels: [],
        search: '',
        users: []
      };
    },

    resetLoadingConversations(state, action) {
      state.loadingConversations = null;
    },

    resetLoadingMessages(state, action) {
      state.isLoadingNextMessage = null;
    },

    setFirstLoadingAfterFilter(state, action) {
      state.firstLoadingAfterFilter = action.payload;
    },

    setIsEmptyPage(state, action) {
      const { companyCode } = action.payload;
      state.conversations.manager[companyCode].isEmptyPage = false;
    },

    setHasNext: (state, action) => {
      const { companyCode, hasNext } = action.payload;
      state.conversations.manager[companyCode].hasNext = hasNext;
    },

    setPage: (state, action) => {
      const { companyCode, page } = action.payload;
      state.conversations.manager[companyCode].page = page;
    },

    initConversations(state, action) {
      const companies = action.payload;
      companies.map((item) => {
        state.conversations.manager[item.code] = {
          page: 1,
          hasNext: true,
          pagination: {},
          filters: {
            types: [],
            labels: [],
            search: '',
            users: []
          }
        };
        state.conversations[item.code] = [];
      });
    },

    selectConversation(state, action) {
      if (!action.payload) return; // neu khong co payload -> khong lam gi ca
      const { conversationId, company } = action.payload;
      if (!state.conversations[company.code]) return; // neu khong co conversation cua company -> khong lam gi ca
      const indexOfConversation = state.conversations[company.code]
        .map((item) => item.id)
        .indexOf(conversationId);
      if (!conversationId) {
        state.selectedConversation[company.code] = {};
        state.currentMessages[company.code] = { data: [], manager: {} };
        return;
      }
      state.conversations[company.code][indexOfConversation][
        'isJumping'
      ] = false;
      if (action.payload.isJumping)
        state.conversations[company.code][indexOfConversation][
          'isJumping'
        ] = true;
      state.selectedConversation[company.code] = omit(
        state.conversations[company.code][indexOfConversation],
        ['messages']
      );

      state.currentMessages[company.code] = {
        data: state.conversations[company.code][indexOfConversation].messages,
        manager: {
          hasPrevious: false,
          pagination: null
        }
      };
    },

    addNewMessage(state, action) {
      if (!action.payload) return; // neu khong co payload -> khong lam gi ca
      const { message: newMessage } = action.payload;
      if (!state.conversations[newMessage.companyCode]) return; // neu khong co conversation cua company -> khong lam gi ca
      const indexOfConversation = state.conversations[
        newMessage.companyCode
      ].findIndex(
        (conversation) => conversation.id === newMessage.conversationId
      );

      //* start set up new conversation data
      const conversation = {
        ...state.conversations[newMessage.companyCode][indexOfConversation],
        lastModifiedTime: JSON.parse(JSON.stringify(new Date())),
        messages: [
          ...state.conversations[newMessage.companyCode][indexOfConversation]
            .messages,
          newMessage
        ],
        //TODO need review
        lastUser: newMessage?.sender?.name
          ? newMessage?.sender
          : // eslint-disable-next-line indent
            state.conversations[newMessage.companyCode][indexOfConversation]
            ?.lastUser,
        lastMessage: newMessage
      };
      state.conversations[newMessage.companyCode][indexOfConversation] =
        conversation;

      state.conversations[newMessage.companyCode][
        indexOfConversation
      ].lastModifiedTime = JSON.parse(JSON.stringify(new Date()));
      if (newMessage.direction === 'inbound') {
        state.conversations[newMessage.companyCode][
          indexOfConversation
        ].isCompleted = false;
      }

      if (state.selectedConversation[newMessage.companyCode]) {
        //* start update lastMessage in selectedConversation
        if (
          newMessage.conversationId ===
          state.selectedConversation[newMessage.companyCode].id
        ) {
          state.selectedConversation[newMessage.companyCode].lastMessage =
            newMessage;
          state.currentMessages[newMessage.companyCode].data.push(newMessage);
        }
        //* end update lastMessage in selectedConversation
      }
      if (
        action.payload.currentUser.id !== newMessage.sender?.id ||
        newMessage.direction === 'inbound'
      ) {
        conversation.umn += 1;
        state.conversations.manager[newMessage.companyCode].pagination.umn += 1;
      }

      //* start update conversation
      state.conversations[newMessage.companyCode][indexOfConversation] =
        conversation;
      //* end update conversation

      //* start sort conversation list

      state.conversations[newMessage.companyCode] = state.conversations[
        newMessage.companyCode
      ].sort((item1, item2) => {
        if (!item1.lastMessage.mode) return 1;
        if (!item2.lastMessage.mode) return -1;
        if (item1.lastMessage.mode > item2.lastMessage.mode) return 1;
        else if (item1.lastMessage.mode < item2.lastMessage.mode) return -1;
        else {
          if (
            new Date(item2.lastModifiedTime) > new Date(item1.lastModifiedTime)
          )
            return 1;
          else if (
            new Date(item2.lastModifiedTime) < new Date(item1.lastModifiedTime)
          )
            return -1;
          return 0;
        }
      });

      //* end sort conversation list
    },

    updateOutboundMessage(state, action) {
      if (!action.payload) return; // neu khong co payload -> khong lam gi ca
      const { message: updateMessage } = action.payload;
      if (!state.conversations[updateMessage.companyCode]) return; // neu khong co conversation cua company -> khong lam gi ca
      let oldIndexMessage = -1;

      const indexOfConversation = state.conversations[
        updateMessage.companyCode
      ].findIndex(
        (conversation) => conversation.id === updateMessage.conversationId
      );
      if (indexOfConversation < 0) return;
      oldIndexMessage = state.conversations[updateMessage.companyCode][
        indexOfConversation
      ].messages.findIndex(
        (message) =>
          message.id === updateMessage.tempId || message.id === updateMessage.id
      );

      //*------- start update conversation------------
      state.conversations[updateMessage.companyCode][
        indexOfConversation
      ].messages[oldIndexMessage] = _.merge(
        state.conversations[updateMessage.companyCode][indexOfConversation]
          .messages[oldIndexMessage],
        updateMessage
      );
      state.conversations[updateMessage.companyCode][
        indexOfConversation
      ].lastModifiedTime = JSON.parse(JSON.stringify(new Date()));

      //*---------end update conversation-------------

      //*------------------ start update selected conversation-------------
      if (state.selectedConversation[updateMessage.companyCode]) {
        if (
          updateMessage.conversationId ===
          state.selectedConversation[updateMessage.companyCode].id
        ) {
          state.selectedConversation[
            updateMessage.companyCode
          ].lastModifiedTime = JSON.parse(JSON.stringify(new Date()));

          //* start update current message
          const newMessage = _.merge(
            state.currentMessages[updateMessage.companyCode].data[
              oldIndexMessage
            ],
            updateMessage
          );
          state.currentMessages[updateMessage.companyCode].data[
            oldIndexMessage
          ] = newMessage;
          //* end update new message to currentMessages
        }
      }
    },

    readMessage(state, action) {
      if (!action.payload) return; // neu khong co payload -> khong lam gi ca
      const { conversationId, company, umn } = action.payload;
      if (!state.conversations[company.code]) return; // neu khong co conversation cua company -> khong lam gi ca

      const indexOfConversation = state.conversations[company.code]
        .map((item) => item.id)
        .indexOf(conversationId);

      //* update umn company
      state.conversations.manager[company.code].pagination.umn -= umn || 0;
      
      //* update umn in conversation
      if (indexOfConversation > -1) {
        state.conversations[company.code][indexOfConversation] = {
          ...state.conversations[company.code][indexOfConversation],
          umn: 0
        };
      }
    },

    addConversation(state, action) {
      if (!action.payload) return;
      const newConversation = action.payload;
      state.conversations[newConversation.company] = [
        {
          id: newConversation.id,
          isCompleted: newConversation.isCompleted,
          newOrExisting: newConversation.newOrExisting,
          participantId: newConversation.participant.participantId,
          umn: newConversation.participant.umn,
          lastModifiedTime: newConversation.lastModifiedTime,
          lastUser: newConversation.lastUser ? newConversation.lastUser : {},
          lastMessage: newConversation.lastMessage,
          customer: {
            id: newConversation.customer.id,
            phone: newConversation.customer.phoneNumber,
            email: newConversation.customer.emailAddress,
            status: newConversation.customer.status,
            companies: [newConversation.company],
            fullName: newConversation.customer.fullName
          },
          messages: [...newConversation.messages],
          labels: Array.isArray(newConversation.labels)
            ? [...newConversation.labels]
            : []
        },
        ...state.conversations[newConversation.company]
      ];
      state.conversations.manager[newConversation.company].pagination.umn +=
        newConversation.participant.umn;
    },

    addNotifyMissMessage(state, action) {
      const message = action.payload;
      const tempId = uuid();
      //* start update conversation
      const indexOfConversation = state.conversations[message.companyCode]
        .map((item) => item.id)
        .indexOf(message.conversationId);
      const conversation = {
        ...state.conversations[message.companyCode][indexOfConversation],
        messages: [
          ...state.conversations[message.companyCode][indexOfConversation]
            .messages,
          message
        ],
        //TODO need review
        lastUser: message.sender,

        lastMessage: message
      };

      state.conversations[message.companyCode][indexOfConversation] =
        conversation;

      state.conversations[message.companyCode][
        indexOfConversation
      ].lastModifiedTime = JSON.parse(JSON.stringify(new Date()));
      //* end update conversation

      //TODO: update unm for conversation
      state.conversations[message.companyCode] = [
        ...state.conversations[message.companyCode]
      ].map((conversation) => {
        if (conversation.id === message.conversationId) {
          state.conversations.manager[message.companyCode].pagination.umn += 1;
          return {
            ...conversation,
            umn: conversation.umn + 1
          };
        } else {
          return { ...conversation };
        }
      });
      //* start sort conversation list
      state.conversations[message.companyCode] = state.conversations[
        message.companyCode
      ].sort((item1, item2) => {
        if (
          compareDate(item1.lastModifiedTime, item2.lastModifiedTime, true) ===
          true
        )
          return -1;
        else if (
          compareDate(item1.lastModifiedTime, item2.lastModifiedTime, true) ===
          false
        )
          return 1;
        else return 0;
      });
      //* end sort conversation list
    },

    inputtingMessage(state, action) {
      if (action.payload.value) {
        state.inputting = action.payload.value;
        const index = state.typingUsers.indexOf(action.payload.user);
        if (index < 0) {
          state.typingUsers.push(action.payload.user);
        }
      } else {
        state.inputting = null;
        state.typingUsers = [];
      }
    },

    stopInputMessage(state, action) {
      if (action.payload) {
        state.typingUsers = state.typingUsers.filter((item) => {
          return item !== action.payload.user;
        });
      } else {
        state.typingUsers = [];
      }
    },

    setEditingLabels(state, action) {
      state.isEditingLabels = action.payload.status;
    },

    updateConversation: (state, action) => {
      const { company, conversation } = action.payload;

      const indexConversation = state.conversations[company.code].findIndex(
        (item) =>
          conversation?.id
            ? item.id === conversation?.id
            : item.participantId === conversation?.participant?.id
      );

      //* update umn in company
      if (conversation?.participant?.type === 'read')
        state.conversations.manager[company.code].pagination.umn -= conversation?.participant?.umn || 0;
      if (conversation?.participant?.type === 'unread')
        state.conversations.manager[company.code].pagination.umn += 1;        
      
      //* update conversation item
      if (indexConversation > -1) {
        //* update another property
        state.conversations[company.code][indexConversation] = {
          ...state.conversations[company.code][indexConversation],
          ..._.omit(conversation, ['umn']),
          customer: {
            ...state.conversations[company.code][indexConversation].customer,
            ...conversation.customer
          }
        };

        //* update umn
        if (conversation?.participant?.type === 'read') {
          state.conversations[company.code][indexConversation] = {
            ...state.conversations[company.code][indexConversation],
            umn: 0
          };
        }
        if (conversation?.participant?.type === 'unread') {
          if (state.conversations[company.code][indexConversation].umn === 0) {
            state.conversations[company.code][indexConversation] = {
              ...state.conversations[company.code][indexConversation],
              umn: 1
            };
          }
        }
      }
    }
  },
  extraReducers: {
    //* get signature active
    [getListSignatureActive.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
    },
    [getListSignatureActive.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.listSignature = action.payload;
    },
    [getListSignatureActive.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
    },

    //* new conversation when jump
    [getNewConversationOfUser.pending]: (state, action) => {
      if (action.meta.arg.isJumping)
        state.jumpMessages.manager.jumpStatus = apiStatus.PENDING;
    },
    [getNewConversationOfUser.fulfilled]: (state, action) => {
      state.jumpMessages.manager.jumpStatus = apiStatus.SUCCESS;
    },
    [getNewConversationOfUser.rejected]: (state, action) => {
      state.jumpMessages.manager.jumpStatus = apiStatus.ERROR;
    },

    //* conversation
    [getConversationsOfUser.pending]: (state) => {
      state.status = apiStatus.PENDING;
      state.loadingConversations = true;
    },
    [getConversationsOfUser.fulfilled]: (state, action) => {
      state.loadingConversations = false;
      state.firstLoadingAfterFilter = false;
      if (action.payload) {
        const companyCode = action.payload.company.code;

        state.conversations.manager[companyCode].page += 1;
        state.conversations.manager[companyCode].pagination = {
          ...state.conversations.pagination,
          ...action.payload.pagination
        };
        if (action.payload.conversations.length === 0)
          state.loadingConversations = undefined;

        if (!state.conversations[companyCode])
          state.conversations[companyCode] = [];
        const newConversations = action.payload.conversations.reduce(
          (total, newItem) => {
            const index = state.conversations[companyCode].findIndex(
              (oldItem) => oldItem.id === newItem.id
            );
            if (index === -1) return (total = [...total, newItem]);
            return total;
          },
          []
        );
        if (
          action.payload.conversations.length !== 0 &&
          newConversations.length === 0 &&
          state.conversations.manager[companyCode].page > 2
        ) {
          state.conversations.manager[companyCode].isEmptyPage = true;
        }
        state.conversations[companyCode] = [
          ...state.conversations[companyCode],
          ...newConversations
        ];

        state.status = apiStatus.SUCCESS;
        state.notificationMessage = 'Get conversations successful';
      }
    },
    [getConversationsOfUser.rejected]: (state, action) => {
      // state.firstLoadingAfterFilter = false;
      // state.loadingConversations = false;
      // state.status = apiStatus.ERROR;
      // state.notificationMessage =
      //   action?.payload?.error?.message || 'Get conversations failed';
    },

    //* load more message in conversations
    [loadMoreMessagesInConversation.pending]: (state) => {
      state.isLoadingPreviousMessages = true;
    },
    [loadMoreMessagesInConversation.fulfilled]: (state, action) => {
      state.isLoadingPreviousMessages = false;

      if (action.payload) {
        const companyCode = action.payload.company.code;
        const conversationId = action.payload.conversationId;
        const messages = action.payload.messages;
        const indexOfConversation = state.conversations[companyCode]
          .map((item) => item.id)
          .indexOf(conversationId);

        if (messages.length === 0) state.isLoadingPreviousMessages = undefined;

        //* add messages to conversation in conversation list
        if (indexOfConversation !== -1) {
          state.conversations[companyCode][indexOfConversation].messages = [
            ...messages,
            ...state.conversations[companyCode][indexOfConversation].messages
          ];
        }

        //* add messages to currentMessages
        if (state.currentMessages[companyCode]) {
          state.currentMessages[companyCode].data = [
            ...messages,
            ...state.currentMessages[companyCode].data
          ];
          state.currentMessages[companyCode].manager.pagination =
            action.payload.pagination;
        }

        if (
          state.currentMessages[companyCode].data[0].index ===
          action.payload.pagination.oldest
        ) {
          state.currentMessages[companyCode].manager.hasPrevious = false;
        }
      }
    },
    [loadMoreMessagesInConversation.rejected]: (state, action) => {
      state.isLoadingPreviousMessages = false;
      state.status = apiStatus.ERROR;
    },

    //* load previous messages when search and jump
    [loadPreviousMessages.pending]: (state, action) => {
      state.isLoadingPreviousMessages = true;
    },
    [loadPreviousMessages.fulfilled]: (state, action) => {
      state.isLoadingPreviousMessages = false;
      const { messages, pagination } = action.payload;
      state.jumpMessages.data = [...messages, ...state.jumpMessages.data];
      if (state.jumpMessages.data[0].index === pagination.oldest)
        state.jumpMessages.manager.hasPrevious = false;

      state.jumpMessages.manager.pagination = pagination;
    },
    [loadPreviousMessages.rejected]: (state, action) => {
      state.isLoadingPreviousMessages = false;
    },

    //* load next messages when search and jump
    [loadNextMessages.pending]: (state, action) => {
      state.isLoadingNextMessage = true;
      state.isLoadingPreviousMessages = false;
    },
    [loadNextMessages.fulfilled]: (state, action) => {
      state.isLoadingNextMessage = false;
      const { messages, pagination, company, conversationId } = action.payload;
      state.jumpMessages.data = [...state.jumpMessages.data, ...messages];

      if (
        state.jumpMessages.data[state.jumpMessages.data.length - 1].index ===
        pagination.latest
      ) {
        const newMessages = state.jumpMessages.data.reduce((total, newItem) => {
          const index = state.currentMessages[company.code].data.findIndex(
            (oldItem) => oldItem.id === newItem.id
          );
          if (index === -1) return (total = [...total, newItem]);
          return total;
        }, []);
        //* sync with currentMessages and message in conversation
        state.currentMessages[company.code].data = [
          ...newMessages,
          ...state.currentMessages[company.code].data
        ];
        const indexOfConversation = state.conversations[company.code]
          .map((item) => item.id)
          .indexOf(conversationId);
        state.conversations[company.code][indexOfConversation]['messages'] = [
          ...newMessages,
          ...state.conversations[company.code][indexOfConversation]['messages']
        ];

        state.jumpMessages.manager.hasNext = false;
      }
      if (
        state.currentMessages[company.code].data[0].index ===
        state.currentMessages[company.code].manager.pagination.oldest
      )
        state.currentMessages[company.code].manager.hasPrevious = false;

      state.jumpMessages.manager.pagination = pagination;
    },
    [loadNextMessages.rejected]: (state, action) => {
      state.isLoadingNextMessage = false;
      state.status = apiStatus.ERROR;
    },

    //* jump to message in conversation
    [jumpToMessageInConversation.pending]: (state, action) => {
      state.jumpMessages.manager.jumpStatus = apiStatus.PENDING;
    },
    [jumpToMessageInConversation.fulfilled]: (state, action) => {
      state.jumpMessages.manager.jumpStatus = apiStatus.SUCCESS;
      const {
        messages,
        pagination,
        messageId,
        company,
        highlights,
        conversationId
      } = action.payload;

      state.jumpMessages.manager.jumpMessageId = messageId;
      state.jumpMessages.manager.conversationId = conversationId;
      state.jumpMessages.manager.highlights = highlights;
      if (messages.length === 0) return;
      state.jumpMessages.data = messages;
      //* update matched message for jumpMessages
      const indexJumpMessages = state.jumpMessages.data.findIndex(
        (item) => item.id === messageId
      );
      //! need refactoring
      if (indexJumpMessages > -1)
        state.jumpMessages.data[indexJumpMessages]['match'] = true;

      //* update matched message for currentMessages
      const indexCurrentMessages = state.currentMessages[
        company.code
      ].data.findIndex((item) => item.id === messageId);
      if (indexCurrentMessages > -1) {
        state.currentMessages[company.code].data[
          indexCurrentMessages
        ].match = true;
      }

      //* if jump to a range of oldest
      if (messages[0].index === pagination.oldest)
        state.jumpMessages.manager.hasPrevious = false;
      //* if jump to a range of latest
      if (messages[messages.length - 1].index === pagination.latest) {
        state.jumpMessages.manager.hasNext = false;
        const newMessages = state.jumpMessages.data.reduce((total, newItem) => {
          const index = state.currentMessages[company.code].data.findIndex(
            (oldItem) => oldItem.id === newItem.id
          );
          if (index === -1) return (total = [...total, newItem]);
          return total;
        }, []);
        const indexOfConversation = state.conversations[company.code]
          .map((item) => item.id)
          .indexOf(conversationId);
        //* sync with currentMessages and message in conversation
        state.conversations[company.code][indexOfConversation]['messages'] = [
          ...newMessages,
          ...state.conversations[company.code][indexOfConversation]['messages']
        ];
        state.currentMessages[company.code].data = [
          ...newMessages,
          ...state.currentMessages[company.code].data
        ];
        state.jumpMessages.manager.isJumpingLatest = true;
      }
      state.jumpMessages.manager.pagination = pagination;
      state.currentMessages[company.code].manager.pagination = pagination;
    },
    [jumpToMessageInConversation.rejected]: (state, action) => {
      state.jumpMessages.manager.jumpStatus = apiStatus.ERROR;
      state.mes;
    },

    //* pagination messages
    [getInfoPaginationMessages.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
    },
    [getInfoPaginationMessages.fulfilled]: (state, action) => {
      if (!action.payload) return; // neu khong co payload -> khong lam gi ca
      state.status = apiStatus.SUCCESS;
      const { company, pagination } = action.payload;
      state.currentMessages[company.code].manager.pagination = pagination;
      state.currentMessages[company.code].manager.hasPrevious = true;
      if (
        pagination.oldest === state.currentMessages[company.code].data[0]?.index
      )
        state.currentMessages[company.code].manager.hasPrevious = false;
    },
    [getInfoPaginationMessages.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
    },

    [updateUmnConversation.fulfilled]: (state, action) => {
      const { company, participantId, readStatus } = action.payload;
      const indexOfConversation = state.conversations[company.code].findIndex(
        (item) => item.participantId === participantId
      );
      if (readStatus === 'read') {
        state.conversations.manager[company.code].pagination.umn -=
          state.conversations[company.code][indexOfConversation]['umn'];
        state.conversations[company.code][indexOfConversation]['umn'] = 0;
      } else {
        state.conversations.manager[company.code].pagination.umn += 1;
        state.conversations[company.code][indexOfConversation]['umn'] = 1;
      }
    },
    [updateUmnConversations.fulfilled]: (state, action) => {
      const { company, participantIds, readStatus } = action.payload;
      participantIds.forEach((participantId) => {
        const indexOfConversation = state.conversations[company.code].findIndex(
          (item) => item.participantId === participantId
        );
        if (
          readStatus === 'read' &&
          state.conversations[company.code][indexOfConversation]['umn'] > 0
        ) {
          state.conversations.manager[company.code].pagination.umn -=
            state.conversations[company.code][indexOfConversation]['umn'];
          state.conversations[company.code][indexOfConversation]['umn'] = 0;
        } else if (
          readStatus === 'unread' &&
          state.conversations[company.code][indexOfConversation]['umn'] === 0
        ) {
          state.conversations.manager[company.code].pagination.umn += 1;
          state.conversations[company.code][indexOfConversation]['umn'] = 1;
        } else return;
      });
    },

    //* get call log records
    [getCallLogRecords.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
    },
    [getCallLogRecords.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.callLogs = action.payload;
    },
    [getCallLogRecords.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
    },

    [assignLabels.fulfilled]: (state, action) => {
      const { companyCode, conversationId, labels } = action.payload;
      const indexOfConversation = state.conversations[companyCode].findIndex(
        (item) => item.id === conversationId
      );
      if (indexOfConversation > -1) {
        state.conversations[companyCode][indexOfConversation]['labels'] =
          labels;
        state.status = apiStatus.SUCCESS;
      }
    },
    [assignLabels.rejected]: (state) => {
      state.status = apiStatus.ERROR;
      state.message = 'Assign label error!';
    },

    [editConversations.fulfilled]: (state, action) => {
      const { ids, company, ...rest } = action.payload;
      ids.forEach((conversationId) => {
        const indexOfConversation = state.conversations[company.code].findIndex(
          (item) => item.id === conversationId
        );
        if (indexOfConversation > -1) {
          state.conversations[company.code][indexOfConversation][
            Object.entries(rest)[0][0]
          ] = Object.entries(rest)[0][1];
        }
      });
      state.status = apiStatus.SUCCESS;
    },

    //* get call log records
    [getLogActivities.pending]: (state, action) => {
      state.status = apiStatus.PENDING;
    },
    [getLogActivities.fulfilled]: (state, action) => {
      state.status = apiStatus.SUCCESS;
      state.activitiesLog = {
        ...state.activitiesLog,
        records: action?.payload?.records || [],
      };
    },
    [getLogActivities.rejected]: (state, action) => {
      state.status = apiStatus.ERROR;
      state.message =
        action?.payload?.error?.message || 'Get conversation log activities failed';
    },
  }
});

const { actions, reducer } = MessagesSlice;

const {
  initConversations,
  selectConversation,
  addNewMessage,
  updateOutboundMessage,
  readMessage,
  addConversation,
  inputtingMessage,
  stopInputMessage,
  resetLoadingConversations,
  resetLoadingMessages,
  setFilters,
  setHasNext,
  setPage,
  setIsEmptyPage,
  setFirstLoadingAfterFilter,
  clearJump,
  clearJumpingLatest,
  setSearchValue,
  deselectConversation,
  setEditingLabels,
  updateConversation,
  addNotifyMissMessage,
  clearFilters
} = actions;

export {
  initConversations,
  selectConversation,
  addNewMessage,
  updateOutboundMessage,
  readMessage,
  addConversation,
  inputtingMessage,
  stopInputMessage,
  resetLoadingConversations,
  resetLoadingMessages,
  setFilters,
  setHasNext,
  setPage,
  setIsEmptyPage,
  setFirstLoadingAfterFilter,
  clearJump,
  clearJumpingLatest,
  setSearchValue,
  deselectConversation,
  setEditingLabels,
  updateConversation,
  addNotifyMissMessage,
  clearFilters
};

export default reducer;
