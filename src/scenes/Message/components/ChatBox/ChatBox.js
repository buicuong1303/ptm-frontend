/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  IconButton,
  Input,
  Paper,
  Tooltip,
  Fab,
  colors
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import FILE from 'constants/file';
import { useSnackbar } from 'notistack';
import { PreSignDropzone } from 'components';
import { useSelector, useDispatch } from 'react-redux';
import { SocketChatContext } from 'services/socket/SocketChat';
import { CompanyContext } from 'contexts/CompanyProvider';
import { debounce, throttle } from 'lodash';
import { readMessage } from 'scenes/Message/Message.slice';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import getExp from 'utils/getExp';
import { signOut } from 'store/slices/session.slice';
import { DialogWarning } from 'components';
import { useRouter } from 'hooks';
import decodeToken from 'utils/decodeToken';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    position: 'relative'
  },
  paper: {
    flexGrow: 1,
    margin: 'auto'
  },
  button: {
    color: theme.palette.primary.main,
    transition: 'all .5s',
    '&:hover': {
      transition: 'all .3s'
      // transform: 'scale(1.1)'
    }
  },
  input: {
    width: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    width: 1,
    height: 24
  },
  fileInput: {
    display: 'none'
  },
  iconButton: {
    color: colors.grey[700]
  },
  scrollBottom: {
    position: 'absolute',
    top: '-60px',
    left: '50%',
    // transform: 'translateX(-%50)',
    transform: 'rotateZ(90deg)',
    color: '#283593'
  }
}));
Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};
function scrollTo(element, to, duration) {
  var start = element.scrollTop,
    change = to - start,
    currentTime = 0,
    increment = 20;

  var animateScroll = function () {
    currentTime += increment;
    var val = Math.easeInOutQuad(currentTime, start, change, duration);
    element.scrollTop = val;
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };
  animateScroll();
}

const ChatBox = (props) => {
  const {
    className,
    company,
    conversations,
    signature,
    listSignature,
    selectedConversation,
    showScrollBot,
    onScrollBot,
    checked,
    authorPermission,
    ...rest
  } = props;

  const {
    sendMessage: chatSendMessage,
    handelInputNotify: handelInputNotify,
    handelReadMessage: handelReadMessage,
    handelStopInputNotify: handelStopInputNotify
  } = useContext(SocketChatContext);

  const user = useSelector((state) => state.session.user);
  //* init value
  const [chatValue, setChatValue] = useState('');
  const [blobFiles, setBlobFiles] = useState([]);
  const [valueSignature, setValueSignature] = useState('');
  const [signatureId, setSignatureId] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { history } = useRouter();

  const classes = useStyles();
  const { company: companyContext } = useContext(CompanyContext);

  //* show notification
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  //* Dialog Warning
  const initWarningValue = { open: false, title: '', message: '' };
  const [dialogWarningValue, setDialogWarningValue] =
    useState(initWarningValue);
  const handleOpenDialogWarning = (title, message) => {
    setDialogWarningValue({
      open: true,
      title: title,
      message: message
    });
  };
  const handleCloseDialogWarning = () => {
    setDialogWarningValue(initWarningValue);
    handleLogout();
  };

  const throttled = useRef(
    throttle(
      (value) =>
        handelInputNotify({
          roomId: value.roomId,
          value: value.text,
          typingUser: value.typingUser
        }),
      750,
      { trailing: false }
    )
  );
  const debounceTypings = useRef(
    debounce(
      (value) =>{
        handelStopInputNotify({
          roomId: value.roomId,
          value: value.text,
          typingUser: value.typingUser
        });
        setActiveSend(true);
      },
      1500
    )
  );

  //* handle logout
  const handleLogout = () => {
    history.push('/auth/sign-in');
    localStorage.removeItem('accessToken');
    dispatch(signOut());
  };

  //* handle change message
  const [activeSend, setActiveSend] = useState(true);
  const handleChange = (event) => {
    event.persist();
    setActiveSend(false);
    throttled.current({
      text: event.target.value,
      roomId: selectedConversation.id,
      typingUser: user
    });
    debounceTypings.current({
      text: event.target.value,
      roomId: selectedConversation.id,
      typingUser: user
    });
    setChatValue(event.target.value);
  };
  const handleScrollBot = () => {
    const ele = document.getElementById('messages');
    scrollTo(ele, ele.scrollHeight, 750);
    if (onScrollBot) onScrollBot(false);
  };
  const handleReadMessage = (selectedNewConversationId) => {
    //* update unm -> 0
    const currentConversations =
      conversations[
        conversations.map((item) => item.id).indexOf(selectedNewConversationId)
      ];
    const participantId = currentConversations.participantId;
    const umn = currentConversations.umn;

    if (umn > 0) {
      dispatch(
        readMessage({
          conversationId: selectedNewConversationId,
          company: companyContext,
          umn: umn
        })
      );
      handelReadMessage({
        participantId: participantId,
        company: {
          code: companyContext?.code
        },
        conversationId: selectedNewConversationId,
        umn: umn
      });
    }
  };
  //* click attach button
  const handleClickAttach = () => {
    const ele = document.getElementById('preSign-attachment-button');
    ele.click();
  };

  //* handle confirm send message has campaign 
  const [confirmMessage, setConfirmMessage] = useState();
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const handleCancelDialog = () => setDialogConfirm(false);
  const handleConfirmDialog = () => {
    setDialogConfirm(false);
    const decodedToken = decodeToken(localStorage.getItem('accessToken'));

    const time = getExp(decodedToken?.exp);
  
    if (!time || time <= 0) {
      handleOpenDialogWarning(
        'Your login session is invalid',
        'Please login again to continue using the app'
      );
  
      return;
    }
  
    const message = {
      text: chatValue ? chatValue.trim() : chatValue,
      files: blobFiles
    };
    const tempMessage = valueSignature !== ''
      ? chatValue.trim() !== ''
        ? chatValue +
          '\n' + valueSignature
        : valueSignature
      : chatValue;
      // console.log(tempMessage);
    let tempMessageValidate = tempMessage;
    if(checked){
      tempMessageValidate = tempMessageValidate + `${user.firstName} ${user.lastName}`;
    }
    if (tempMessageValidate.length > 990) {
      showSnackbar('Text must be less than 990 characters', 'error');
      return;
    }
    if (message.text || message.files.length > 0) {
      const data = {
        conversationId: selectedConversation.id,
        message,
        checked,
        sender: user,
        company: company,
        signature: valueSignature,
        signatureId: signatureId,
        participantId: selectedConversation.participantId
      };
        //* chat socket trigger
      chatSendMessage(data);
    }
    setChatValue('');
    setBlobFiles([]);
  };

  //* handle send message
  const sendMessage = () => {
    if(selectedConversation.customer.campaigns && selectedConversation.customer.campaigns.length > 0) {
      const listCampaignOut = selectedConversation.customer.campaigns.filter(item => {
        if(item.status === 'active'){
          return true;
        } return false;
      });
      if(listCampaignOut.length > 0){
        const listOut = selectedConversation.customer.campaigns.filter((item) => {
          if(item.status === 'active'){
            return true;
          }
        });
        setConfirmMessage(listOut);
        setDialogConfirm(true);
      } else {
        const decodedToken = decodeToken(localStorage.getItem('accessToken'));

        const time = getExp(decodedToken?.exp);
  
        if (!time || time <= 0) {
          handleOpenDialogWarning(
            'Your login session is invalid',
            'Please login again to continue using the app'
          );
  
          return;
        }
  
        const message = {
          text: chatValue ? chatValue.trim() : chatValue,
          files: blobFiles
        };
        const tempMessage = valueSignature !== ''
          ? chatValue.trim() !== ''
            ? chatValue +
          '\n' + valueSignature
            : valueSignature
          : chatValue;
        // console.log(tempMessage);
        let tempMessageValidate = tempMessage;
        if(checked){
          tempMessageValidate = tempMessageValidate + `${user.firstName} ${user.lastName}`;
        }
        if (tempMessageValidate.length > 990) {
          showSnackbar('Text must be less than 990 characters', 'error');
          return;
        }
        if (message.text || message.files.length > 0) {
          const data = {
            conversationId: selectedConversation.id,
            message,
            checked,
            sender: user,
            company: company,
            signature: valueSignature,
            signatureId: signatureId,
            participantId: selectedConversation.participantId
          };
          //* chat socket trigger
          chatSendMessage(data);
        }
        setChatValue('');
        setBlobFiles([]);
      }
    } else {
      const decodedToken = decodeToken(localStorage.getItem('accessToken'));

      const time = getExp(decodedToken?.exp);
  
      if (!time || time <= 0) {
        handleOpenDialogWarning(
          'Your login session is invalid',
          'Please login again to continue using the app'
        );
  
        return;
      }
  
      const message = {
        text: chatValue ? chatValue.trim() : chatValue,
        files: blobFiles
      };
      const tempMessage = valueSignature !== ''
        ? chatValue.trim() !== ''
          ? chatValue +
          '\n' + valueSignature
          : valueSignature
        : chatValue;
      // console.log(tempMessage);
      let tempMessageValidate = tempMessage;
      if(checked){
        tempMessageValidate = tempMessageValidate + `${user.firstName} ${user.lastName}`;
      }
      if (tempMessageValidate.length > 990) {
        showSnackbar('Text must be less than 990 characters', 'error');
        return;
      }
      if (message.text || message.files.length > 0) {
        const data = {
          conversationId: selectedConversation.id,
          message,
          checked,
          sender: user,
          company: company,
          signature: valueSignature,
          signatureId: signatureId,
          participantId: selectedConversation.participantId
        };
        //* chat socket trigger
        chatSendMessage(data);
      }
      setChatValue('');
      setBlobFiles([]);
    }
  };

  const checkSendMessage = (event) => {
    const indexCursor = event.target.selectionStart;
    if (event.keyCode === 13 && event.ctrlKey) {
      let newValue =
        chatValue.slice(0, indexCursor) + '\n' + chatValue.slice(indexCursor);
      setChatValue(newValue);
    }
    if (event.keyCode === 13 && !event.shiftKey && !event.ctrlKey && activeSend) {
      sendMessage();
    }
  };
  useEffect(() => {
    setChatValue('');
    setBlobFiles([]);
  }, [selectedConversation.id]);
  useEffect(() => {
    if(listSignature.length > 0){
      for(let i = 0; i< listSignature.length; i ++){
        if(listSignature[i].id === signature){
          setValueSignature(listSignature[i].value);
          setSignatureId(listSignature[i]);
        }
        if(signature === '')
        {
          setSignatureId('');
          setValueSignature('');
        }
      }
    }
  }, [signature]);


  //* render UI
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
        <PreSignDropzone
          blobFiles={blobFiles}
          label="label"
          setBlobFiles={setBlobFiles}
        >
          <Paper className={classes.paper} elevation={1}>
            {!authorPermission.canCreate ?
              <Input
                id="abcd"
                disabled
                className={classes.input}
                disableUnderline
                placeholder={'No permission to send message!'}
                multiline
                maxRows={10}
                onClick={(event) => {
                  event.stopPropagation();
                  handleReadMessage(selectedConversation.id);
                }}
                value={chatValue}
              />:
              <Input
                id="abc"
                className={classes.input}
                disableUnderline
                onChange={handleChange}
                placeholder={'Enter message...'}
                multiline
                maxRows={10}
                onClick={(event) => {
                  event.stopPropagation();
                  handleReadMessage(selectedConversation.id);
                }}
                onKeyUp={(event) => checkSendMessage(event)}
                onKeyDown={(event) =>
                  event.key === 'Enter' && event.preventDefault()
                }
                value={chatValue}
              />
            }
          </Paper>
        </PreSignDropzone>
        <Tooltip title="Send">
          <IconButton
            className={classes.button}
            disabled={!authorPermission.canCreate || !activeSend}
            color={chatValue.length > 0 ? 'primary' : 'default'}
            onClick={authorPermission.canCreate ? sendMessage : null}
          >
            <SendIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={
            blobFiles.length >= FILE.NUMBER_OF_FILES
              ? `up to ${FILE.NUMBER_OF_FILES} files`
              : 'Attach file support: .jpg, .jpeg, .png, .gif, .tif, .tiff, .bmp, .mp4, .mpeg, .mp3, .vcf, .vcard, .rtf, .zip, .svg'
          }
        >
          <IconButton
            className={classes.button}
            edge="end"
            disabled={!authorPermission.canCreate}
            onClick={authorPermission.canCreate
              ? blobFiles.length >= FILE.NUMBER_OF_FILES
                ? null
                : handleClickAttach
              : null
            }
            style={{
              opacity: blobFiles.length >= FILE.NUMBER_OF_FILES ? '.3' : 1,
              cursor:
                blobFiles.length >= FILE.NUMBER_OF_FILES
                  ? 'not-allowed'
                  : 'pointer'
            }}
          >
            <AttachFileIcon />
          </IconButton>
        </Tooltip>
        {showScrollBot && (
          <div className={classes.scrollBottom}>
            <Fab
              size="small"
              variant="round"
              style={{
                boxShadow: 'none',
                border: '1px solid #283593',
                backgroundColor: '#fff'
              }}
              onClick={handleScrollBot}
            >
              <DoubleArrowIcon style={{ color: '#283593' }} />
            </Fab>
          </div>
        )}
      </div>

      <DialogWarning
        onClose={handleCancelDialog}
        handleConfirm={handleConfirmDialog}
        // message={confirmMessage}
        listCampaignOut={confirmMessage}
        open={dialogConfirm}
        title={'Do you want to continue?'}
      />
      
      <DialogWarning
        onClose={handleCloseDialogWarning}
        message={dialogWarningValue.message}
        open={dialogWarningValue.open}
        title={dialogWarningValue.title}
        submitTitle="I Got It"
      />
    </div>
  );
};

ChatBox.propTypes = {
  className: PropTypes.string,
  handleSendMessage: PropTypes.func
};

export default React.memo(ChatBox);
