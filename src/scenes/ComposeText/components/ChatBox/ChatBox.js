/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { IconButton, Input, Paper, Tooltip } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { Dropzone } from 'components';
import FILE from 'constants/file';
import { promisify } from 'util';
import { useSelector } from 'react-redux';
import { convertUrlToBase64 } from 'utils/convertUrlToBase64';
import { convertBufferToBase64 } from 'utils/convertBufferToBase64';
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 2)
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
  }
}));

const ChatBox = (props) => {
  const { className, dataForward, handleSendMessage, authorPermission, ...rest } = props;

  const classes = useStyles();

  //* init value
  const fileInputRef = useRef(null);
  const [chatValue, setChatValue] = useState('');
  const [files, setFiles] = useState([]);
  const isSending = useSelector((state) => state.composeText.isSending);

  //* handle change message
  const handleChange = (event) => {
    event.persist();
    setChatValue(event.target.value);
  };
  //* click attach button
  const handleClickAttach = () => {
    const ele = document.getElementById('attachment-button');
    ele.click();
  };

  //* handle send message
  const sendMessage = () => {
    const data = {
      message: chatValue ? chatValue.trim() : chatValue,
      files: files
    };
    if (data.message || data.files.length > 0) {
      handleSendMessage(data);
    }
  };

  const checkSendMessage = (event) => {
    event.persist();
    const indexCursor = event.target.selectionStart;
    if (event.keyCode === 13 && event.ctrlKey) {
      let newValue =
        chatValue.slice(0, indexCursor) + '\n' + chatValue.slice(indexCursor);
      setChatValue(newValue);
    }
    if (event.keyCode === 13 && !event.shiftKey && !event.ctrlKey)
      sendMessage();
  };
  useEffect(() => {
    if (isSending) {
      setChatValue('');
      files.forEach((file) => URL.revokeObjectURL(file.url));
      setFiles([]);
    }
  }, [isSending]);
  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type:mime});
  };
  useEffect(() => {
    async function forwardMessage() {
      if(dataForward) {
        setChatValue(dataForward.text);
        if(dataForward.attachments.length > 0) {
          const forwardFiles = dataForward.attachments.map( async (item) => {
            const convertUrlToBase64Promise = promisify(convertUrlToBase64);
            const result = await convertUrlToBase64Promise(item.url);
            const image = convertBufferToBase64(result.data,result.type);
            const file = dataURLtoFile(image, item.name);
            file.url = item.url;
            return file;
          });
          const listFile = await Promise.all(forwardFiles);
          setFiles(listFile);
        }
      }
    }
    forwardMessage();

  }, [dataForward]);

  //* render UI
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
        <Dropzone
          ref={fileInputRef}
          files={files}
          label="label"
          setFiles={setFiles}
        >
          <Paper className={classes.paper} elevation={1}>
            {!authorPermission.canSendMessage ?
              <Input
                id="abc"
                className={classes.input}
                disabled
                disableUnderline
                placeholder="No permission to send message!"
                multiline
                maxRows={10}
                onClick={(event) => event.stopPropagation()}
                onKeyUp={(event) => checkSendMessage(event)}
                onKeyDown={(event) =>
                  event.key === 'Enter' && event.preventDefault()
                }
                value={chatValue}
              />:
              <Input
                id="abc"
                className={classes.input}
                disableUnderline
                onChange={handleChange}
                placeholder="Enter message..."
                multiline
                maxRows={10}
                onClick={(event) => event.stopPropagation()}
                onKeyUp={(event) => checkSendMessage(event)}
                onKeyDown={(event) =>
                  event.key === 'Enter' && event.preventDefault()
                }
                value={chatValue}
              />
            }
          </Paper>
        </Dropzone>
        <IconButton
          className={classes.button}
          disabled={!authorPermission.canSendMessage}
          color={chatValue.length > 0 ? 'primary' : 'default'}
          onClick={authorPermission.canSendMessage ? sendMessage : null}
        >
          <Tooltip title="Send">
            <SendIcon />
          </Tooltip>
        </IconButton>
        <IconButton
          className={classes.button}
          edge="end"
          disabled={!authorPermission.canSendMessage}
          onClick={authorPermission.canSendMessage
            ? files.length >= FILE.NUMBER_OF_FILES ? null : handleClickAttach
            : null
          }
          style={{
            opacity: files.length >= FILE.NUMBER_OF_FILES ? '.3' : 1,
            cursor:
                files.length >= FILE.NUMBER_OF_FILES ? 'not-allowed' : 'pointer'
          }}
        >
          <Tooltip
            title={
              files.length >= FILE.NUMBER_OF_FILES
                ? `up to ${FILE.NUMBER_OF_FILES} files`
                : 'Attach file'
            }
          >
            <AttachFileIcon />
          </Tooltip>
        </IconButton>
      </div>
    </div>
  );
};

ChatBox.propTypes = {
  className: PropTypes.string,
  handleSendMessage: PropTypes.func
};

export default ChatBox;
