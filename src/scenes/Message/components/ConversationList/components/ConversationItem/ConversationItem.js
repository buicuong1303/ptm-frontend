/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  ListItem,
  ListItemText,
  colors,
  Badge,
  ListItemIcon,
  Typography,
  Checkbox,
  Menu,
  MenuItem,
  Tooltip
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import PendingIcon from '@material-ui/icons/HourglassEmptyRounded';
import DoneIcon from '@material-ui/icons/Done';
import TooltipCustom from 'components/TooltipCustom';
import { StringFormat } from 'components';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Labels from '../Labels';
import LabelsSelect from '../LabelsSelect';
import EditClient from '../EditClient';
const useStyles = makeStyles((theme) => ({
  root: {
    height: '85px',
    padding: 0,
    display: 'flex',
    flexDirection: 'row',
    '&:hover': {
      backgroundColor: `${colors.grey[300]}`
    }
  },
  active: {
    boxShadow: `inset 4px 0px 0px ${theme.palette.primary.main}`,
    backgroundColor: `${colors.grey[300]} !important`
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '260px',
    minWidth: '0px',
    // overflow: 'hidden', //* to trigger minWidth: '0px'
    '& > div:nth-child(2)': {
      width: '100%'
    },
    '& > div:nth-child(2) > p': {
      whiteSpace: 'nowrap',
      flex: '0 1 auto',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    }
  },
  listItemTextInner: {
    marginTop: '1px',
    marginBottom: '1px'
  },
  contentTextInbound: {
    color: '#FF4343'
  },
  contentTextOutbound: {
    color: '#6D6D6D'
  },
  details: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    minWidth: '0px'
  },
  toolTipIconColor: {
    color: colors.grey[600]
  },
  checkingWrapperStatus: {},
  checking: {
    display: 'block !important'
  },
  hide: {
    display: 'none'
  },
  wrapperStatus: {
    maxWidth: 40,
    display: 'flex',
    paddingTop: '8px',
    margin: '0px 16px',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    '&:hover #status': {
      display: 'none'
    },
    '&:hover .MuiCheckbox-root ': {
      display: 'block'
    }
  },
  wrapperInfoLastMessage: {
    display: 'flex',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
    height: '100%',
    padding: '8px 8px 8px 0px',
    marginLeft: 22
  },
  customerNameText: {
    maxWidth: '55px',
    fontSize: '12px',
    color: colors.indigo[800],
    textAlign: 'center',
    /* autoprefixer: off */
    '-webkit-box-orient': 'vertical',
    /* autoprefixer: on */
    '-webkit-line-clamp': 2,
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
    display: '-webkit-box'
  },
  agentName: {
    fontWeight: '600',
    maxWidth: '110px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginRight: '5px',
    height: 'min-content'
  },
  labels: {
    flex: 1
  },
  labelsSelect: {
    flex: 1
  },
  formControl: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textField: {
    width: 130,
    marginRight: '10px',
    height: 40
  },
  selectField: {
    width: 100
  },
  label: {
    marginRight: 10
  },
  icon: {
    fontSize: 18,
    '&:hover': {
      transform: 'scale(1.25)',
      transition: 'transform 0.2s'
    }
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 10
  },
  updateClientWrapper: {
    height: '80px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'row',
    fontSize: '13px',
    borderBottom: '1px solid #eeee'
  },
  new: {
    '& > span': {
      backgroundColor: '#f9e8ee',
      color: colors.red[400],
      right: '-5px'
    }
  },
  exist: {
    '& > span': {
      backgroundColor: colors.blue[50],
      color: colors.blue[700],
      right: '-10px'
    }
  },
  completedIcon: {
    margin: '5px 12px',
    color: colors.indigo[800]
  },
  incompleteIcon: {
    margin: '5px 12px',
    color: colors.orange[700]
  }
}));

const initialState = {
  mouseX: null,
  mouseY: null
};

const ConversationItem = (props) => {
  const user = useSelector((state) => state.session.user);
  const isEditingLabels = useSelector((state) => state.message.isEditingLabels);
  const { enqueueSnackbar } = useSnackbar();
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  const {
    company,
    getCallLogs,
    active,
    onClick,
    conversation,
    className,
    onCheckConversation,
    checked,
    isChecking,
    onMarkRead,
    onMarkUnRead,
    setOpenCallLog,
    setCallLogConversation,
    setOpenActivitiesLog,
    setActivitiesLogConversation,
    getActivitiesLog,
    onEditLabel,
    editingClient,
    onEditClient,
    onSubmitEditClient,
    onEditConversation,
    onAssignLabels,
    labels,
    onEditConversations,
    authorPermission,
    ...rest
  } = props;
  const [lastMessage, setLastMessage] = useState({
    text: ''
  });
  const [contentLastMessage, setContentLastMessage] = useState('');
  const [lastUserName, setLastUserName] = useState('');
  const [state, setState] = useState(initialState);
  const [menuOpen, setMenuOpen] = useState(false);

  const classes = useStyles();
  const [enableEditLabels, setEnableEditLabels] = useState(false);
  const [labelsAssigned, setLabelsAssigned] = useState([]);
  const [campaignOptOut, setCampaignOptOut] = useState([]);

  useEffect(() => {
    setLastMessage(conversation.lastMessage);
    if (conversation.lastUser) {
      const currentUser = user.firstName + ' ' + user.lastName;
      if (currentUser === conversation.lastUser.name) setLastUserName('Me');
      else setLastUserName(conversation.lastUser.name);
    } else setLastUserName('');

    if (conversation) {
      if (conversation.customer.campaigns) {
        if (conversation.customer.campaigns.length > 0) {
          const listOptOut = [];
          conversation.customer.campaigns.forEach((item) => {
            if (item.status === 'active') {
              listOptOut.push(item);
            }
          });
          setCampaignOptOut(listOptOut);
        }
      }
      setLabelsAssigned(
        conversation.labels?.map((label) => {
          return {
            label: label.title,
            color: label.bgColor,
            value: label.id
          };
        })
      );
    }
  }, [conversation]);

  useEffect(() => {
    if (conversation) {
      const messageCount = conversation.messages.length;
      if (
        conversation.lastMessage.mode === 'normal' &&
        conversation.lastMessage.text === '' &&
        conversation.lastMessage.type === 'text' &&
        messageCount > 0
      ) {
        setContentLastMessage(
          `Attachment: ${
            conversation.messages[messageCount - 1].attachments.length
          } files`
        );
      } else if (conversation.lastMessage.type === 'call') {
        if (conversation.lastMessage.exMessageStatus == 'Voicemail')
          setContentLastMessage('Voicemail');
        else setContentLastMessage('Missed call');
      } else {
        setContentLastMessage('');
      }
    }
  }, [lastMessage]);

  const handleOpenContextMenu = (event) => {
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

  const handleCloseContextMenu = () => {
    setMenuOpen(false);
    setState(initialState);
  };

  const handleOnClick = () => {
    if (checkLabelsEditing()) return;
    onClick(conversation.id);
  };

  const handleMarkRead = (conversation) => {
    if (!onMarkRead) return;
    if (conversation) onMarkRead(conversation.participantId, conversation.umn);
    else onMarkRead();
    handleCloseContextMenu();
  };

  const handleMarkUnRead = (conversation) => {
    if (!onMarkRead) return;
    if (conversation)
      onMarkUnRead(conversation.participantId, conversation.umn);
    else onMarkUnRead();
    handleCloseContextMenu();
  };

  const handleReadCallLogs = () => {
    const data = {
      customerPhone: conversation.customer.phone.slice(1),
      companyPhone: company.phone.slice(1),
      companyCode: company.code
    };
    setCallLogConversation(conversation);
    getCallLogs(data);
    setOpenCallLog(true);
    handleCloseContextMenu();
  };

  const renderCreationTime = (message) => {
    if (message.exCreationTime) {
      if (
        new Date(message.exCreationTime).toISOString().slice(0, 10) ===
        new Date().toISOString().slice(0, 10)
      )
        return moment(message.exCreationTime).fromNow();
      return moment(message.exCreationTime).format('MM-DD-YYYY hh:mm A');
    } else if (message.creationTime) {
      if (
        new Date(message.creationTime).toISOString().slice(0, 10) ===
        new Date().toISOString().slice(0, 10)
      )
        return moment(message.creationTime).fromNow();
      return moment(message.creationTime).format('MM-DD-YYYY hh:mm A');
    }
  };

  const handleEditLabels = () => {
    if (checkLabelsEditing()) return;
    setEnableEditLabels(true);
    onEditLabel(true);

    handleCloseContextMenu();
  };

  const handleOnSaveLabels = (labels) => {
    const labelIds = labels.map((label) => {
      return label['value'];
    });
    //* internal labels status
    setLabelsAssigned(labels);

    onAssignLabels(conversation, labelIds);

    setEnableEditLabels(false);
    onEditLabel(false);
  };

  const handleOnCancelLabels = () => {
    setEnableEditLabels(false);
    onEditLabel(false);
  };

  const handleEditClient = () => {
    if (!onEditClient) return;
    onEditClient(conversation);
    handleCloseContextMenu();
    setState(initialState);
  };

  const checkLabelsEditing = () => {
    if (isEditingLabels) {
      showSnackbar('1 item is editing', 'warning');
      return true;
    } else {
      return false;
    }
  };

  const handleEditConversation = (action) => {
    switch (action) {
      case 'completed':
        onEditConversation({ id: conversation.id, isCompleted: true });
        break;
      case 'incomplete':
        onEditConversation({ id: conversation.id, isCompleted: false });
        break;
      case 'new': {
        onEditConversation({ id: conversation.id, newOrExisting: 'new' });
        break;
      }
      case 'existing': {
        onEditConversation({ id: conversation.id, newOrExisting: 'existing' });
        break;
      }
      default:
        break;
    }
    handleCloseContextMenu();
  };

  const handleEditConversations = (action) => {
    switch (action) {
      case 'completed':
        onEditConversations({ isCompleted: true });
        break;
      case 'incomplete':
        onEditConversations({ isCompleted: false });
        break;
      case 'new': {
        onEditConversations({ newOrExisting: 'new' });
        break;
      }
      case 'existing': {
        onEditConversations({ newOrExisting: 'existing' });
        break;
      }
      default:
        break;
    }
    handleCloseContextMenu();
  };

  const handleReadActivitiesLog = (conversation) => {
    const filters = {
      conversationId: conversation?.id,
      participantId: conversation?.participantId,
      from: new Date(),
      to: new Date()
    };
    setActivitiesLogConversation(conversation);
    getActivitiesLog(filters);
    setOpenActivitiesLog(true);
    handleCloseContextMenu();
  };
  return (
    <>
      {editingClient?.id !== conversation?.id ? (
        <ListItem
          {...rest}
          button
          onContextMenu={handleOpenContextMenu}
          className={clsx(
            classes.root,
            {
              [classes.active]: active
            },
            className
          )}
          component="button"
          style={{
            zIndex: enableEditLabels ? '1' : 'unset'
            // backgroundColor:
            //   conversation.customer.campaigns.length > 0 ? '#C9C8C8' : null
          }}
        >
          <>
            <Menu
              classes={classes.formMenu}
              keepMounted
              open={state.mouseY !== null}
              onClose={handleCloseContextMenu}
              anchorReference="anchorPosition"
              anchorPosition={
                state.mouseY !== null && state.mouseX !== null
                  ? { top: state.mouseY, left: state.mouseX }
                  : undefined
              }
            >
              {isChecking ? (
                <div>
                  <MenuItem
                    classes={classes.menuItemForward}
                    onClick={handleMarkRead}
                  >
                    <span>Mark as read</span>
                  </MenuItem>
                  <MenuItem
                    classes={classes.menuItemForward}
                    onClick={handleMarkUnRead}
                  >
                    <span>Mark as unread</span>
                  </MenuItem>
                  <MenuItem
                    classes={classes.menuItemForward}
                    onClick={() => handleEditConversations('completed')}
                  >
                    <span>Mark as completed</span>
                  </MenuItem>
                  <MenuItem
                    classes={classes.menuItemForward}
                    onClick={() => handleEditConversations('incomplete')}
                  >
                    <span>Mark as incomplete</span>
                  </MenuItem>
                  <MenuItem
                    classes={classes.menuItemForward}
                    onClick={() => handleEditConversations('new')}
                  >
                    <span>Mark as new</span>
                  </MenuItem>
                  <MenuItem
                    classes={classes.menuItemForward}
                    onClick={() => handleEditConversations('existing')}
                  >
                    <span>Mark as existing</span>
                  </MenuItem>
                </div>
              ) : (
                <div>
                  {conversation.umn !== 0 ? (
                    <MenuItem
                      classes={classes.menuItemForward}
                      onClick={() => handleMarkRead(conversation)}
                    >
                      <span>Mark as read</span>
                    </MenuItem>
                  ) : (
                    <MenuItem
                      onClick={() => handleMarkUnRead(conversation)}
                      classes={classes.menuItemForward}
                    >
                      <span>Mark as unread</span>
                    </MenuItem>
                  )}

                  {conversation.isCompleted ? (
                    <MenuItem
                      onClick={() => handleEditConversation('incomplete')}
                      classes={classes.menuItemForward}
                    >
                      <span>Mark as incomplete</span>
                    </MenuItem>
                  ) : (
                    <MenuItem
                      onClick={() => handleEditConversation('completed')}
                      classes={classes.menuItemForward}
                    >
                      <span>Mark as completed</span>
                    </MenuItem>
                  )}

                  {conversation.newOrExisting === '' ? (
                    <>
                      <MenuItem
                        onClick={() => handleEditConversation('new')}
                        classes={classes.menuItemForward}
                      >
                        <span>Mark as new</span>
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleEditConversation('existing')}
                        classes={classes.menuItemForward}
                      >
                        <span>Mark as existing</span>
                      </MenuItem>
                    </>
                  ) : conversation.newOrExisting === 'new' ? (
                    <MenuItem
                      onClick={() => handleEditConversation('existing')}
                      classes={classes.menuItemForward}
                    >
                      <span>Mark as existing</span>
                    </MenuItem>
                  ) : (
                    <MenuItem
                      onClick={() => handleEditConversation('new')}
                      classes={classes.menuItemForward}
                    >
                      <span>Mark as new</span>
                    </MenuItem>
                  )}

                  {/* <MenuItem
                    onClick={() => handleReadCallLogs(conversation)}
                    classes={classes.menuItemForward}
                  >
                    <span>Call logs</span>
                  </MenuItem> */}

                  <MenuItem
                    onClick={() => handleEditLabels()}
                    classes={classes.menuItemForward}
                  >
                    <span>Select labels</span>
                  </MenuItem>

                  <MenuItem
                    onClick={handleEditClient}
                    classes={classes.menuItemForward}
                  >
                    <span>Update client</span>
                  </MenuItem>

                  {authorPermission?.canReadLogActivities && (
                    <MenuItem
                      onClick={() => handleReadActivitiesLog(conversation)}
                      classes={classes.menuItemForward}
                    >
                      <span>Activity log</span>
                    </MenuItem>
                  )}
                </div>
              )}
            </Menu>
            <div className={clsx(classes.wrapperStatus)}>
              <Badge
                color="error"
                badgeContent={conversation.umn}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
              >
                {/* TODO: handle new/ existed */}
                <Badge
                  color="primary"
                  badgeContent={
                    conversation.newOrExisting ? conversation.newOrExisting : 0
                  }
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  className={clsx({
                    [classes.new]: conversation.newOrExisting === 'new',
                    [classes.exist]: conversation.newOrExisting === 'existing'
                  })}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <Checkbox
                      className={clsx(classes.hide, {
                        [classes.checking]: isChecking === true
                      })}
                      checked={checked}
                      onChange={(e) => {
                        onCheckConversation(e, conversation);
                      }}
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                      // label
                    />
                    <div
                      id="status"
                      className={clsx({
                        [classes.hide]: isChecking === true
                      })}
                    >
                      {conversation.isCompleted ? (
                        <DoneIcon className={classes.completedIcon} />
                      ) : (
                        <PendingIcon className={classes.incompleteIcon} />
                      )}
                    </div>
                  </div>
                </Badge>
              </Badge>
              <Tooltip title={conversation.customer.fullName}>
                <div className={classes.customerNameText}>
                  {conversation.customer.fullName}
                </div>
              </Tooltip>
            </div>

            <div
              className={classes.wrapperInfoLastMessage}
              onClick={handleOnClick}
            >
              <div className={classes.body}>
                {/* phone and time */}
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  {campaignOptOut.length > 0 ? (
                    <StringFormat
                      isPhoneNumber
                      value={conversation.customer.phone}
                      style={{
                        fontWeight: '700',
                        fontSize: '14px',
                        margin: '1px 0px',
                        color: '#979797'
                      }}
                    />
                  ) : (
                    <StringFormat
                      isPhoneNumber
                      value={conversation.customer.phone}
                      style={{
                        fontWeight: '700',
                        fontSize: '14px',
                        margin: '1px 0px'
                      }}
                    />
                  )}
                  <div className={classes.contentTextOutbound}>
                    {renderCreationTime(conversation.lastMessage)}
                  </div>
                </div>

                {/* last message */}
                <ListItemText
                  className={classes.listItemTextInner}
                  secondary={
                    conversation.lastMessage.direction === 'outbound' ? (
                      contentLastMessage === '' ? (
                        <Typography className={classes.contentTextOutbound}>
                          {lastMessage.text}
                        </Typography>
                      ) : (
                        <Typography className={classes.contentTextOutbound}>
                          {contentLastMessage}
                        </Typography>
                      )
                    ) : contentLastMessage === '' ? (
                      <Typography className={classes.contentTextInbound}>
                        {lastMessage.text}
                      </Typography>
                    ) : (
                      <Typography className={classes.contentTextInbound}>
                        {contentLastMessage}
                      </Typography>
                    )
                  }
                  secondaryTypographyProps={{
                    noWrap: true,
                    variant: 'body1'
                  }}
                />

                {/* last agent and label */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%'
                  }}
                >
                  {/* last agent */}
                  <div className={classes.agentName}>{lastUserName}</div>

                  {/* label */}
                  {enableEditLabels ? (
                    <LabelsSelect
                      className={classes.labelsSelect}
                      options={[...company['labels']]}
                      optionsSelected={labelsAssigned}
                      onSave={handleOnSaveLabels}
                      onCancel={handleOnCancelLabels}
                    />
                  ) : (
                    <Labels
                      className={classes.labels}
                      labels={labelsAssigned}
                    />
                  )}
                </div>
                {/* TODO: handle label list */}
              </div>
              <ListItemIcon className={classes.details}>
                <TooltipCustom
                  icon={<InfoIcon className={classes.toolTipIconColor} />}
                >
                  <ul
                    style={{
                      fontSize: 13,
                      fontWeight: 11,
                      padding: 0
                    }}
                  >
                    <b>Companies</b>
                    {conversation.customer.companies.map((cpn) => (
                      <li key={cpn} style={{ marginLeft: 15 }}>
                        {cpn}
                      </li>
                    ))}
                    {campaignOptOut.length > 0 ? (
                      <div>
                        <b>OPT Out</b>
                        {campaignOptOut.map((cp) => (
                          <li key={cp.id} style={{ marginLeft: 15 }}>
                            {cp.label}
                          </li>
                        ))}
                      </div>
                    ) : null}
                  </ul>
                </TooltipCustom>
              </ListItemIcon>
            </div>
          </>
        </ListItem>
      ) : (
        <EditClient
          company={company}
          conversation={conversation}
          onEditClient={onEditClient}
          onSubmitEditClient={onSubmitEditClient}
        />
      )}
    </>
  );
};

ConversationItem.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  conversation: PropTypes.object.isRequired,
  onCheckConversation: PropTypes.func.isRequired,
  onMarkRead: PropTypes.func.isRequired,
  onMarkUnRead: PropTypes.func.isRequired,
  setCallLogConversation: PropTypes.func.isRequired,
  labels: PropTypes.array.isRequired,
  onEditLabel: PropTypes.func.isRequired,
  onAssignLabels: PropTypes.func.isRequired,
  setOpenActivitiesLog: PropTypes.func.isRequired,
  setActivitiesLogConversation: PropTypes.func.isRequired,
  getActivitiesLog: PropTypes.func.isRequired,
  authorPermission: PropTypes.object
};

export default ConversationItem;
