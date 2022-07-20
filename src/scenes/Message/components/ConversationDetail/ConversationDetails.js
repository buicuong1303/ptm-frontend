/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider } from '@material-ui/core';
import { clearJump, stopInputMessage } from 'scenes/Message/Message.slice';

import { ConversationToolbar, ConversationMessageList } from '..';
import TypingForm from '../TypingForm';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import ChatBox from '../ChatBox/ChatBox';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.white
  }
}));

const ConversationDetail = (props) => {
  const {
    onBack,
    company,
    className,
    conversations,
    selectedConversation,
    loadMoreMessages,
    loadPreviousMessages,
    loadNextMessages,
    authorPermission,
    onOpenMakeOptSuggestionOrSensitiveWord,
    ...rest
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const inputting = useSelector((state) => state.message.inputting);
  const listTypingUsers = useSelector((state) => state.message.typingUsers);
  const listSignature = useSelector((state) => state.message.listSignature);
  const [input, setInput] = useState(false);
  const [showScrollBot, setShowScrollBot] = useState(false);
  const handleStopTyping = () => {
    setInput(false);
    dispatch(stopInputMessage());
  };

  const debounceTyping = useRef(debounce(() => handleStopTyping(), 1500));
  const [typingUsers, setTypingUsers] = useState([]);
  const [signature, setSignature] = useState();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (inputting) {
      setInput(true);
    }
    //TODO: start debounce
    debounceTyping.current();
  }, [inputting]);

  useEffect(() => {
    if (listTypingUsers.length > 0) {
      setTypingUsers(listTypingUsers);
    } else {
      setInput(false);
    }
  }, [listTypingUsers]);
  useEffect(() => {
    return () => dispatch(clearJump());
  }, []);

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <ConversationToolbar
        listSignature={listSignature}
        setSignature={setSignature}
        company={company}
        onBack={onBack}
        selectedConversation={selectedConversation}
        setChecked={setChecked}
      />
      <Divider />
      <ConversationMessageList
        onScrollBot={(value) => setShowScrollBot(value)}
        loadMoreMessages={loadMoreMessages}
        loadPreviousMessages={loadPreviousMessages}
        loadNextMessages={loadNextMessages}
        onOpenMakeOptSuggestionOrSensitiveWord={
          onOpenMakeOptSuggestionOrSensitiveWord
        }
      />
      <Divider />
      {input ? <TypingForm typingUsers={typingUsers.join()} /> : ''}
      <ChatBox
        signature={signature}
        listSignature={listSignature}
        company={company}
        checked={checked}
        conversations={conversations}
        selectedConversation={selectedConversation}
        showScrollBot={showScrollBot}
        onScrollBot={(value) => setShowScrollBot(value)}
        authorPermission={authorPermission}
      />
    </div>
  );
};

ConversationDetail.propTypes = {
  className: PropTypes.string,
  company: PropTypes.object.isRequired,
  handleSendMessage: PropTypes.func,
  onBack: PropTypes.func,
  selectedConversation: PropTypes.object,
  loadMoreMessages: PropTypes.func,
  loadPreviousMessages: PropTypes.func,
  loadNextMessages: PropTypes.func
};

export default ConversationDetail;
