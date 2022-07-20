/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  Avatar,
  colors,
  IconButton,
  Tooltip,
  MenuItem,
  Menu,
  Button
} from '@material-ui/core';
import { GetApp } from '@material-ui/icons';
import iconFileZip from 'images/zip.png';
import iconVideo from 'images/video-file.png';
import iconFile from 'images/file.png';
import moment from 'moment';
import * as FileSaver from 'file-saver';
import Highlighter from 'react-highlight-words';
import { useSelector } from 'react-redux';
import TooltipCustom from 'components/TooltipCustom';
import PhoneMissedIcon from '@material-ui/icons/PhoneMissed';

const useStyles = makeStyles((theme) => ({
  message: {},
  outbound: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(4),

    '& $body': {
      color: theme.palette.primary.contrastText
    }
  },
  inbound: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing(4),

    '& $body': {
      color: theme.palette.primary.contrastText
    }
  },
  textOutbound: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(1, 2),
    borderRadius: '5px',
    position: 'relative',
    display: 'inline-block',
    wordBreak: 'break-word',
    textAlign: 'start',
    fontWeight: 400,
    fontSize: '14px',
    [theme.breakpoints.down('xs')]: {
      maxWidth: '250px !important'
    }
  },
  textInbound: {
    fontSize: '14px',
    backgroundColor: colors.grey[100],
    color: theme.palette.text.primary,
    padding: theme.spacing(1, 2),
    fontWeight: 400,
    borderRadius: '5px',
    wordBreak: 'break-word',
    textAlign: 'start',
    [theme.breakpoints.down('xs')]: {
      maxWidth: '250px !important'
    }
  },
  inner: {
    maxWidth: 500
  },
  footer: {
    marginTop: 3,
    textAlign: 'end'
  },
  footerInbound: {
    textAlign: 'start'
  },
  avatar: {
    marginLeft: theme.spacing(1),
    position: 'relative',
    right: '0',
    top: 0,
    width: 35,
    height: 35
  },
  sender: {
    color: 'black',
    fontWeight: '400',
    fontSize: 12,
    paddingBottom: 3
  },
  body: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius
  },
  content: {
    position: 'relative'
  },
  attachments: {
    display: 'flex',
    flexDirection: 'column'
  },
  attachmentInbound: {
    alignItems: 'flex-start'
  },
  attachmentOutbound: {
    alignItems: 'flex-end'
  },
  groupImage: {
    flexDirection: 'column',
    padding: theme.spacing(1, 1, 0, 1),
    backgroundColor: '#ffffff',
    margin: theme.spacing(1, 0)
  },
  fileItem: {
    float: 'left',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: theme.spacing(1, 0),
    borderRadius: theme.spacing(1),
    border: '1px solid #eee',
    '&:hover': {
      borderColor: '#c1c1c1',
      '& > svg': {
        display: 'block'
      }
    }
  },
  infoFile: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '10px',
    position: 'relative'
  },
  fileName: {
    fontSize: '14px',
    lineHeight: '15px',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    wordBreak: 'break-all',
    width: '100%',
    color: 'black'
  },
  fileSize: {
    fontSize: '11px',
    color: 'grey'
  },
  image: {
    cursor: 'pointer',
    marginTop: '10px',
    maxWidth: '300px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'column',
    borderRadius: '15px'
  },

  button: {
    color: 'red'
  },
  icon: {
    height: 40,
    width: 40,
    marginLeft: theme.spacing(2)
  },
  error: {
    backgroundColor: '#ce1515'
  },
  missedCall: {
    width: 210,
    backgroundColor: '#f5f5f5',
    fontWeight: 400,
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    height: 70,
    fontSize: 14,
    padding: '0px 10px'
  },
  iconMissedCall: {
    borderRadius: '50%',
    backgroundColor: '#f3425f',
    color: '#fff',
    height: 30,
    width: 30,
    padding: 5
  },
  missedCallContent: {
    fontWeight: 'bold',
    fontSize: 14
  },
  wrapperContentMissedCall: {
    paddingLeft: 10,
    fontSize: 12
  },
  wrapperMissedCall: {
    display: 'flex',
    flexDirection: 'column'
  },
  isPolling: {
    color: 'red'
  }
}));

const initialState = {
  mouseX: null,
  mouseY: null
};

const ConversationMessageItem = (props) => {
  const {
    className,
    message,
    user,
    onOpen,
    handleOpenDocumentViewing,
    match,
    onOpenMakeOptSuggestionOrSensitiveWord,
    ...rest
  } = props;

  const classes = useStyles();

  const [state, setState] = useState(initialState);
  const [menuOpen, setMenuOpen] = useState(false);

  const searchValue = useSelector(
    (state) => state.message.jumpMessages.manager.searchValue
  );
  const highlights = useSelector(
    (state) => state.message.jumpMessages.manager.highlights
  );

  const handleClick = (event) => {
    if (!menuOpen) {
      event.preventDefault();
      setState({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4
      });
      setMenuOpen(true);
    }
    if (menuOpen) {
      event.preventDefault();
      setState(initialState);
      setMenuOpen(false);
    }
  };

  const handleClose = () => {
    setMenuOpen(false);
    setState(initialState);
  };

  const handleForward = () => {
    setMenuOpen(false);
    setState(initialState);
  };
  const handleMakeOptSuggestionOrSensitiveWord = () => {
    setMenuOpen(false);
    if (!onOpenMakeOptSuggestionOrSensitiveWord) return;
    onOpenMakeOptSuggestionOrSensitiveWord(message);
  };
  const renderCreationTime = (message) => {
    if (!message.exCreationTime) {
      if (
        new Date(message.creationTime).toISOString().slice(0, 10) ===
        new Date().toISOString().slice(0, 10)
      )
        return moment(message.creationTime).fromNow();
      return moment(message.creationTime).format('MM-DD-YYYY hh:mm A');
    }
    if (
      new Date(message.exCreationTime).toISOString().slice(0, 10) ===
      new Date().toISOString().slice(0, 10)
    )
      return moment(message.exCreationTime).fromNow();
    return moment(message.exCreationTime).format('MM-DD-YYYY hh:mm A');
  };

  const handleDownloadFile = async (attachment) => {
    const url = attachment.url.replace('s3.', 's3-'); //* to download file
    FileSaver.saveAs(url, attachment.name);
  };

  return (
    <div
      {...rest}
      className={clsx(
        classes.message,
        {
          [classes.outbound]: message.direction == 'outbound',
          [classes.inbound]: message.direction == 'inbound'
        },
        className
      )}
      id={message.id}
    >
      {message.type !== 'call' ? (
        <div className={classes.inner}>
          {/* message */}
          {/* body */}
          <div className={classes.body}>
            <div
              className={classes.content}
              onContextMenu={handleClick}
              style={{ cursor: 'context-menu', display: 'flex' }}
            >
              <div>
                <div style={{ textAlign: 'end' }}>
                  {/* name */}
                  <div className={classes.sender}>
                    {message.direction == 'outbound' ? (
                      <>
                        {message.sender
                          ? message.sender.id === user.id
                            ? 'Me'
                            : message.sender.name
                          : ''}
                      </>
                    ) : null}
                  </div>
                  {/* end name */}

                  {/* message */}
                  {message.text && (
                    <div
                      color="inherit"
                      variant="body1"
                      style={{ whiteSpace: 'pre-wrap', position: 'relative' }}
                      className={clsx(
                        message.direction == 'outbound'
                          ? classes.textOutbound
                          : classes.textInbound,
                        {
                          [classes.error]:
                            message.exMessageStatus === 'sendingfailed' ||
                            message.exMessageStatus === 'deliveryfailed' ||
                            message.messageStatus === 'error'
                        }
                      )}
                    >
                      {message.match ? (
                        <Highlighter
                          highlightClassName="YourHighlightClass"
                          autoEscape
                          textToHighlight={message.text}
                          searchWords={highlights['text'] || []}
                        />
                      ) : (
                        <>{message.text}</>
                      )}
                    </div>
                  )}
                  {/* end message */}
                </div>

                <Menu
                  classes={classes.formMenu}
                  keepMounted
                  open={menuOpen}
                  onClose={handleClose}
                  anchorReference="anchorPosition"
                  anchorPosition={
                    state.mouseY !== null && state.mouseX !== null
                      ? { top: state.mouseY, left: state.mouseX }
                      : undefined
                  }
                >
                  <MenuItem
                    classes={classes.menuItemForward}
                    onClick={handleForward}
                    component={RouterLink}
                    to={{ pathname: '/compose-text', state: message }}
                  >
                    <h4 style={{ fontWeight: 'bold' }}>Forward</h4>
                  </MenuItem>
                  {message.direction === 'inbound' ? (
                    <MenuItem
                      classes={classes.menuItemForward}
                      onClick={handleMakeOptSuggestionOrSensitiveWord}
                    >
                      <h4 style={{ fontWeight: 'bold' }}>
                        Make opt suggestion
                      </h4>
                    </MenuItem>
                  ) : (
                    <MenuItem
                      classes={classes.menuItemForward}
                      onClick={handleMakeOptSuggestionOrSensitiveWord}
                    >
                      <h4 style={{ fontWeight: 'bold' }}>
                        Make sensitive word
                      </h4>
                    </MenuItem>
                  )}
                </Menu>

                {message.attachments.length > 0 && (
                  <div
                    className={clsx(classes.attachments, {
                      [classes.attachmentInbound]:
                        message.direction === 'inbound',
                      [classes.attachmentOutbound]:
                        message.direction === 'outbound'
                    })}
                  >
                    {message.attachments.map((attachment, index) => {
                      return attachment.category === 'image' &&
                        attachment.format !== 'tiff' &&
                        attachment.format !== 'tif' ? (
                          <div
                            key={`${index}_${message.id}`}
                            className={classes.image}
                          >
                            {[
                              'jpg',
                              'jpeg',
                              'gif',
                              'png',
                              'bmp',
                              'svg+xml',
                              'tiff',
                              'tif'
                            ].includes(attachment.format) ? (
                                <img
                                  key={`${index}_${message.id}`}
                                  src={attachment.url}
                                  alt={
                                    'Grapefruit slice atop a pile of other slices'
                                  }
                                  style={{
                                    maxWidth: '100%',
                                    borderRadius: 5,
                                    maxHeight: 200,
                                    height: +attachment.height
                                  }}
                                  onClick={() => {
                                    if (onOpen)
                                      onOpen({
                                        url: attachment.url,
                                        name: attachment.name,
                                        width: attachment.width
                                      });
                                  }}
                                />
                              ) : (
                                <img alt="img" />
                              )}
                            <div
                              className={classes.fileName}
                              style={{
                                textAlign:
                                message.direction === 'inbound'
                                  ? 'left'
                                  : 'right'
                              }}
                            >
                              {message.match ? (
                                <Highlighter
                                  searchWords={
                                    highlights['attachments.name'] || []
                                  }
                                  autoEscape
                                  textToHighlight={
                                    attachment.name ||
                                  `Untitled.${attachment.format}`
                                  }
                                />
                              ) : (
                                <>
                                  {attachment.name ||
                                  `Untitled.${attachment.format}`}
                                </>
                              )}
                              <Tooltip title="Download File">
                                <IconButton
                                  className={classes.button}
                                  onClick={() => handleDownloadFile(attachment)}
                                >
                                  <GetApp />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </div>
                        ) : attachment.category === 'application' ? (
                          <div
                            className={classes.fileItem}
                            style={{
                              color: '#000000',
                              cursor:
                              attachment.format === 'rtf' ? 'pointer' : 'unset'
                            }}
                            key={`${index}_${message.id}`}
                          >
                            <img
                              src={
                                attachment.format === 'zip'
                                  ? iconFileZip
                                  : iconFile
                              }
                              className={classes.icon}
                              onClick={() => {
                                if (
                                  handleOpenDocumentViewing &&
                                attachment.format === 'rtf'
                                )
                                  handleOpenDocumentViewing({
                                    url: attachment.url,
                                    name: attachment.name
                                  });
                              }}
                            />
                            <div
                              className={classes.infoFile}
                              onClick={() => {
                                if (
                                  handleOpenDocumentViewing &&
                                attachment.format === 'rtf'
                                )
                                  handleOpenDocumentViewing({
                                    url: attachment.url,
                                    name: attachment.name
                                  });
                              }}
                            >
                              <div className={classes.fileName}>
                                {attachment.name ||
                                attachment.url.slice(
                                  attachment.url.lastIndexOf('/') + 1
                                )}
                              </div>
                              <span
                                className={classes.fileSize}
                                style={{ fontSize: '11px' }}
                              >
                                {attachment.size} KB
                              </span>
                            </div>
                            <Tooltip title="Download File">
                              <a href={attachment.url}>
                                <IconButton className={classes.button}>
                                  <GetApp />
                                </IconButton>
                              </a>
                            </Tooltip>
                          </div>
                        ) : attachment.category === 'audio' ? (
                          <div
                            className={classes.fileItem}
                            style={{
                              color: '#000000',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-end'
                            }}
                            key={`${index}_${message.id}`}
                          >
                            <audio
                              style={{
                                height: 40,
                                background: '#f1f3f4',
                                borderRadius: '8px 8px 0px 0px'
                              }}
                              controls
                              src={message.attachments[0].url}
                            >
                            Your browser does not support the
                              <code>audio</code>
                            </audio>
                            <div
                              className={classes.infoFile}
                              style={{
                                color: '#000000',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                              }}
                            >
                              <div
                                className={classes.fileName}
                                style={{ marginTop: '0px' }}
                              >
                                {attachment.name ||
                                attachment.url.slice(
                                  attachment.url.lastIndexOf('/') + 1
                                )}
                              </div>
                              <Tooltip title="Download File">
                                <IconButton
                                  className={classes.button}
                                  onClick={() => handleDownloadFile(attachment)}
                                >
                                  <GetApp />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </div>
                        ) : attachment.category === 'video' ? (
                          message.attachments[0].url.split('.')[
                            message.attachments[0].url.split('.').length - 1
                          ] === 'mp4' ? (
                              <div
                                className={classes.fileItem}
                                style={{
                                  color: '#000000',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'flex-end',
                                  marginTop: '8px'
                                }}
                                key={`${index}_${message.id}`}
                              >
                                <video
                                  width="450"
                                  controls
                                  style={{ borderRadius: '8px 8px 0px 0px' }}
                                >
                                  <source
                                    src={message.attachments[0].url}
                                    type="video/mp4"
                                  />
                              Your browser does not support the video tag.
                                </video>
                                <div
                                  className={classes.infoFile}
                                  style={{
                                    color: '#000000',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                  }}
                                >
                                  <div
                                    className={classes.fileName}
                                    style={{ marginTop: '0px' }}
                                  >
                                    {attachment.name ||
                                  attachment.url.slice(
                                    attachment.url.lastIndexOf('/') + 1
                                  )}
                                  </div>
                                  <Tooltip title="Download File">
                                    <IconButton
                                      className={classes.button}
                                      onClick={() => handleDownloadFile(attachment)}
                                    >
                                      <GetApp />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                              </div>
                            ) : (
                              <div
                                className={classes.fileItem}
                                style={{ color: '#000000' }}
                                key={`${index}_${message.id}`}
                              >
                                <img src={iconVideo} className={classes.icon} />
                                <div className={classes.infoFile}>
                                  <div className={classes.fileName}>
                                    {attachment.name ||
                                  attachment.url.slice(
                                    attachment.url.lastIndexOf('/') + 1
                                  )}
                                  </div>
                                  <span
                                    className={classes.fileSize}
                                    style={{ fontSize: '11px' }}
                                  >
                                    {attachment.size} KB
                                  </span>
                                </div>
                                <Tooltip title="Download File">
                                  <IconButton
                                    className={classes.button}
                                    onClick={() => handleDownloadFile(attachment)}
                                  >
                                    <GetApp />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            )
                        ) : (
                          <div
                            className={classes.fileItem}
                            style={{ color: '#000000' }}
                            key={`${index}_${message.id}`}
                          >
                            <img
                              src={
                                attachment.format === 'zip'
                                  ? iconFileZip
                                  : iconFile
                              }
                              className={classes.icon}
                            />
                            <div className={classes.infoFile}>
                              <div className={classes.fileName}>
                                {attachment.name ||
                                attachment.url.slice(
                                  attachment.url.lastIndexOf('/') + 1
                                )}
                              </div>
                              <span
                                className={classes.fileSize}
                                style={{ fontSize: '11px' }}
                              >
                                {attachment.size} KB
                              </span>
                            </div>
                            <Tooltip title="Download File">
                              <a href={attachment.url}>
                                <IconButton className={classes.button}>
                                  <GetApp />
                                </IconButton>
                              </a>
                            </Tooltip>
                          </div>
                        );
                    })}
                  </div>
                )}

                {/* footer */}
                <div
                  className={clsx(classes.footer, {
                    [classes.footerInbound]: message.direction === 'inbound'
                  })}
                >
                  <Typography
                    className={clsx(
                      {
                        [classes.isPolling]: message.isPolling
                      },
                      classes.time
                    )}
                    variant="body2"
                  >
                    {renderCreationTime(message)}
                  </Typography>
                </div>
                {/* end footer */}
              </div>
              <div>
                {/* avatar */}
                {message.direction == 'outbound' &&
                  (message?.sender?.id === user?.id ? (
                    <TooltipCustom
                      icon={
                        <Avatar
                          className={classes.avatar}
                          component={RouterLink}
                          src={message.sender ? message.sender.avatar : ''}
                          to=""
                        />
                      }
                      style={{ minHeight: 'unset', minWidth: 'unset' }}
                    >
                      My profile
                    </TooltipCustom>
                  ) : (
                    <Avatar
                      className={classes.avatar}
                      src={message.sender ? message.sender.avatar : ''}
                      to=""
                    />
                  ))}
                {/* end avatar */}
              </div>
            </div>
          </div>
          {/* end body */}
        </div>
      ) : (
        <div className={classes.wrapperMissedCall}>
          <div className={classes.missedCall}>
            <PhoneMissedIcon className={classes.iconMissedCall} />
            <div className={classes.wrapperContentMissedCall}>
              <p className={classes.missedCallContent}>Missed incoming call</p>
              <span>
                {`0${Math.floor(message.call.duration / 60)}`.slice(-2)}:
                {`0${
                  message.call.duration -
                  Math.floor(message.call.duration / 60) * 60
                }`.slice(-2)}
              </span>
              <div>{message.call.externalCallStatus}</div>
            </div>
          </div>
          {message.attachments[0] && (
            <audio
              style={{ margin: '5px 0px', height: 35 }}
              controls
              src={message.attachments[0].url}
            >
              Your browser does not support the
              <code>audio</code>
            </audio>
          )}

          <div
            className={clsx(classes.footer, {
              [classes.footerInbound]: message.direction === 'inbound'
            })}
          >
            <Typography className={classes.time} variant="body2">
              {renderCreationTime(message)}
            </Typography>
          </div>
        </div>
      )}

      {/* end message */}
    </div>
  );
};
(ConversationMessageItem.defaultProp = {
  onOpen: null,
  handleOpenDocumentViewing: null,
  match: false
}),
(ConversationMessageItem.propTypes = {
  className: PropTypes.string,
  message: PropTypes.object.isRequired,
  user: PropTypes.object,
  onOpen: PropTypes.func,
  handleOpenDocumentViewing: PropTypes.func,
  match: PropTypes.bool
});

export default ConversationMessageItem;
