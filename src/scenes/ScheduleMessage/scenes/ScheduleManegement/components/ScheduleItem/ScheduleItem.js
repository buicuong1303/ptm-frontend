/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/styles';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  Tooltip
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { CustomButton, DialogDelete } from 'components';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { Link, useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateSchedulePreviewOrMonitor } from 'store/slices/schedule.slice';
import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import './style.scss';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import PauseCircleOutlineTwoToneIcon from '@material-ui/icons/PauseCircleOutlineTwoTone';
import ErrorOutlineTwoToneIcon from '@material-ui/icons/ErrorOutlineTwoTone';
import StopIcon from '@material-ui/icons/Stop';
import WarningIcon from '@material-ui/icons/Warning';
import { red } from '@material-ui/core/colors';
import parseHtml from 'utils/parseHtml';
const useStyles = makeStyles((theme) => ({
  scheduleItem: {
    backgroundColor: '#fff',
    padding: '10px 10px',
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '1px 1px 5px #ccc',
    listStyle: 'none',
    margin: '8px',
    fontWeight: 400,
    color: '#263238',
    fontSize: '14px',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontHeight: '500',
    lineHeight: '20px',
    letterSpacing: '-0.05px'
  },
  scheduleItemChild: {
    backgroundColor: '#fff',
    padding: '10px 10px',
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '1px 1px 5px #ccc',
    listStyle: 'none',
    margin: '8px',
    fontWeight: 400,
    color: '#263238',
    fontSize: '14px',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontHeight: '500',
    lineHeight: '20px',
    letterSpacing: '-0.05px'
  },
  button: {
    margin: '0 2px'
  },
  content: {
    flex: 7,
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    display: '-webkit-box',
    textOverflow: 'ellipsis',
    wordBreak: 'break-all',
    marginRight: 20
  },
  actions: {
    margin: '0px 3px'
  },
  controlActions: {
    padding: theme.spacing(2),
    minWidth: '150px',
    backgroundColor: '#fff'
  }
}));

const ScheduleItem = (props) => {
  const classes = useStyles();
  const {
    schedule,
    index,
    onStop,
    onResume,
    onPause,
    onDelete,
    isProcessing,
    canUpdate
  } = props;
  const { url } = useRouteMatch();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElBackup, setAnchorElBackup] = React.useState(null);
  const [dialogDelete, setDialogDelete] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickBackup = (event) => {
    setAnchorElBackup(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElBackup(null);
  };
  const handleClickPreviewOrMonitor = (scheduleData) => {
    dispatch(updateSchedulePreviewOrMonitor(scheduleData));
  };
  const open = Boolean(anchorEl);
  const openBackup = Boolean(anchorElBackup);
  const id = open ? 'schedule-popover' : undefined;
  const idBackup = openBackup ? 'schedule-popover-backup' : undefined;
  const handleStop = (id) => {
    if (onStop) {
      setAnchorEl(null);
      setAnchorElBackup(null);
      onStop(id);
    }
  };
  const handleResume = (id) => {
    if (onResume) {
      setAnchorEl(null);
      setAnchorElBackup(null);
      onResume(id);
    }
  };
  const handlePause = (id) => {
    if (onPause) {
      setAnchorEl(null);
      setAnchorElBackup(null);
      onPause(id);
    }
  };
  const handleDelete = (id) => {
    if (onDelete) onDelete(id);
    setDialogDelete(false);
  };
  const renderActions = (scheduleData) => {
    if (isProcessing) return <div className="spinner-4" />;
    return (
      <>
        {canUpdate ? (
          <Link
            to={
              scheduleData.sendStatus === 'waiting'
                ? `${url}/update/${scheduleData.id}`
                : '#'
            }
          >
            <CustomButton
              style={{
                minWidth: '40px',
                padding: '0px'
              }}
              theme="blue"
              disabled={scheduleData.sendStatus === 'waiting' ? false : true}
            >
              <EditIcon />
            </CustomButton>
          </Link>
        ) : (
          <CustomButton
            style={{
              minWidth: '40px',
              padding: '0px'
            }}
            theme="blue"
            disabled
          >
            <EditIcon />
          </CustomButton>
        )}
        <CustomButton
          onClick={handleClick}
          id={scheduleData.id}
          aria-describedby={id}
          style={{
            minWidth: '40px',
            padding: '0px'
          }}
          theme="gray"
        >
          <MoreVertIcon />
        </CustomButton>
        <Popover
          id={scheduleData.id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
        >
          <List className={classes.controlActions}>
            {!['done', 'error', 'stopped', 'timeout'].includes(
              scheduleData.sendStatus
            ) && (
              <ListItem
                onClick={() => handleStop(scheduleData.id)}
                component={Button}
                className={classes.optionItem}
                disabled={!canUpdate}
              >
                <ListItemText disabled>Stop</ListItemText>
              </ListItem>
            )}
            {scheduleData.sendStatus === 'pausing' && (
              <ListItem
                onClick={() => handleResume(scheduleData.id)}
                component={Button}
                className={classes.optionItem}
                disabled={!canUpdate}
              >
                <ListItemText>Resume</ListItemText>
              </ListItem>
            )}
            {scheduleData.sendStatus === 'sending' && (
              <ListItem
                component={Button}
                className={classes.optionItem}
                disabled={!canUpdate}
                onClick={() => handlePause(scheduleData.id)}
              >
                <ListItemText>PAUSE</ListItemText>
              </ListItem>
            )}
            {scheduleData.sendStatus == 'waiting' ? (
              <Link to={`${url}/preview/${scheduleData.id}`}>
                <ListItem
                  component={Button}
                  className={classes.optionItem}
                  onClick={() => handleClickPreviewOrMonitor(scheduleData)}
                >
                  <ListItemText>Preview</ListItemText>
                </ListItem>
              </Link>
            ) : (
              <Link to={`${url}/monitor/${scheduleData.id}`}>
                <ListItem
                  component={Button}
                  className={classes.optionItem}
                  onClick={() => handleClickPreviewOrMonitor(scheduleData)}
                >
                  <ListItemText>Monitor</ListItemText>
                </ListItem>
              </Link>
            )}
          </List>
        </Popover>
      </>
    );
  };
  const renderActionsBackup = (scheduleData) => {
    if (isProcessing) return <div className="spinner-4" />;
    return (
      <>
        {canUpdate ? (
          <Link
            to={
              scheduleData.sendStatus === 'waiting'
                ? `${url}/update/${scheduleData.id}`
                : '#'
            }
          >
            <CustomButton
              style={{
                minWidth: '40px',
                padding: '0px'
              }}
              type="blue"
              disabled={scheduleData.sendStatus === 'waiting' ? false : true}
            >
              <EditIcon />
            </CustomButton>
          </Link>
        ) : (
          <CustomButton
            style={{
              minWidth: '40px',
              padding: '0px'
            }}
            type="blue"
            disabled
          >
            <EditIcon />
          </CustomButton>
        )}
        <CustomButton
          onClick={handleClickBackup}
          id={scheduleData.id}
          aria-describedby={idBackup}
          style={{
            minWidth: '40px',
            padding: '0px'
          }}
          type="gray"
        >
          <MoreVertIcon />
        </CustomButton>
        <Popover
          id={scheduleData.id}
          open={openBackup}
          anchorEl={anchorElBackup}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
        >
          <List className={classes.controlActions}>
            {!['done', 'error', 'stopped', 'timeout'].includes(
              scheduleData.sendStatus
            ) && (
              <ListItem
                onClick={() => handleStop(scheduleData.id)}
                component={Button}
                className={classes.optionItem}
                disabled={!canUpdate}
              >
                <ListItemText disabled>Stop</ListItemText>
              </ListItem>
            )}
            {scheduleData.sendStatus === 'pausing' && (
              <ListItem
                onClick={() => handleResume(scheduleData.id)}
                component={Button}
                className={classes.optionItem}
                disabled={!canUpdate}
              >
                <ListItemText>Resume</ListItemText>
              </ListItem>
            )}
            {scheduleData.sendStatus === 'sending' && (
              <ListItem
                component={Button}
                className={classes.optionItem}
                disabled={!canUpdate}
                onClick={() => handlePause(scheduleData.id)}
              >
                <ListItemText>PAUSE</ListItemText>
              </ListItem>
            )}
            {scheduleData.sendStatus == 'waiting' ? (
              <Link to={`${url}/preview/${scheduleData.id}`}>
                <ListItem
                  component={Button}
                  className={classes.optionItem}
                  onClick={() => handleClickPreviewOrMonitor(scheduleData)}
                >
                  <ListItemText>Preview</ListItemText>
                </ListItem>
              </Link>
            ) : (
              <Link to={`${url}/monitor/${scheduleData.id}`}>
                <ListItem
                  component={Button}
                  className={classes.optionItem}
                  onClick={() => handleClickPreviewOrMonitor(scheduleData)}
                >
                  <ListItemText>Monitor</ListItemText>
                </ListItem>
              </Link>
            )}
          </List>
        </Popover>
      </>
    );
  };
  return (
    <>
      <li className={classes.scheduleItem}>
        <span style={{ flex: 0.5 }}>{index + 1}</span>
        <Tooltip title={schedule.name}>
          <span style={{ flex: 3 }}>{schedule.name}</span>
        </Tooltip>
        <Tooltip title={parseHtml(schedule.content)}>
          <span style={{ flex: 2 }} className={classes.content}>
            {parseHtml(schedule.content)}
          </span>
        </Tooltip>
        <Tooltip
          title={
            schedule.userCreated
              ? `${schedule.userCreated.firstName} ${schedule.userCreated.lastName}`
              : ''
          }
        >
          <span style={{ flex: 2 }}>
            {schedule.userCreated
              ? `${schedule.userCreated.firstName} ${schedule.userCreated.lastName}`
              : ''}{' '}
          </span>
        </Tooltip>
        <Tooltip title={schedule.company ? ` ${schedule.company.name}` : ''}>
          <span style={{ flex: 2 }}>
            {schedule.company ? ` ${schedule.company.name}` : ''}{' '}
          </span>
        </Tooltip>
        <span style={{ flex: 2 }}>
          {moment(schedule.dateTime).format('YYYY-MM-DD HH:mm A')}
        </span>
        <span style={{ flex: 2, textAlign: 'center' }}>
          {schedule.canRetry ? (
            <CheckCircleOutlineIcon style={{ color: 'green' }} />
          ) : (
            <HighlightOffIcon style={{ color: red[500] }} />
          )}
        </span>
        <span style={{ flex: 2, textAlign: 'center' }}>
          {schedule.sendStatus === 'done' ? (
            <CheckCircleOutlineIcon style={{ color: 'green' }} />
          ) : schedule.sendStatus === 'waiting' ? (
            <HourglassEmptyIcon style={{ color: '#1a237e' }} />
          ) : schedule.sendStatus === 'error' ? (
            <ErrorOutlineTwoToneIcon style={{ color: 'red' }} />
          ) : schedule.sendStatus === 'pausing' ? (
            <PauseCircleOutlineTwoToneIcon style={{ color: '#1a237e' }} />
          ) : schedule.sendStatus === 'sending' ? (
            <div className="dots-7" />
          ) : (
            <StopIcon style={{ color: '#1a237e' }} />
          )}
        </span>
        <span style={{ flex: 2, textAlign: 'center' }}>
          {schedule.totalMessages && (
            <span>
              {schedule.currentSentMessages}/{schedule.totalMessages}
            </span>
          )}
        </span>
        <div style={{ flex: 3, display: 'flex', justifyContent: 'center' }}>
          {renderActions(schedule)}
        </div>
        <DialogDelete
          open={dialogDelete}
          title="Do you really want to delete?"
          handleConfirm={handleDelete}
          handleClose={() => setDialogDelete(false)}
        />
      </li>
      {schedule.backup ? (
        <li className={classes.scheduleItemChild}>
          <div style={{ flex: 0.5 }}>
            <SubdirectoryArrowRightIcon color="primary" />
          </div>
          <Tooltip title={schedule.backup.name}>
            <span style={{ flex: 3 }}>{schedule.backup.name}</span>
          </Tooltip>
          <Tooltip title={parseHtml(schedule.content)}>
            <span style={{ flex: 2 }} className={classes.content}>
              {schedule.backup.content}
            </span>
          </Tooltip>
          <Tooltip
            title={
              schedule.userCreated
                ? `${schedule.userCreated.firstName} ${schedule.userCreated.lastName}`
                : ''
            }
          >
            <span style={{ flex: 2 }}>
              {schedule.userCreated
                ? `${schedule.userCreated.firstName} ${schedule.userCreated.lastName}`
                : ''}{' '}
            </span>
          </Tooltip>
          <Tooltip title={schedule.company ? ` ${schedule.company.name}` : ''}>
            <span style={{ flex: 2 }}>
              {schedule.company ? ` ${schedule.company.name}` : ''}{' '}
            </span>
          </Tooltip>
          <span style={{ flex: 2 }}>
            {moment(schedule.backup.dateTime).format('YYYY-MM-DD HH:mm A')}
          </span>
          <span style={{ flex: 2, textAlign: 'center' }}>{''}</span>
          <span style={{ flex: 2, textAlign: 'center' }}>
            {schedule.backup.sendStatus === 'done' ? (
              <CheckCircleOutlineIcon style={{ color: 'green' }} />
            ) : schedule.backup.sendStatus === 'waiting' ? (
              <HourglassEmptyIcon style={{ color: '#1a237e' }} />
            ) : schedule.backup.sendStatus === 'error' ? (
              <ErrorOutlineTwoToneIcon style={{ color: 'red' }} />
            ) : schedule.backup.sendStatus === 'pausing' ? (
              <PauseCircleOutlineTwoToneIcon style={{ color: '#1a237e' }} />
            ) : schedule.backup.sendStatus === 'sending' ? (
              <div className="dots-7" />
            ) : (
              <StopIcon style={{ color: '#1a237e' }} />
            )}
          </span>
          <span style={{ flex: 2, textAlign: 'center' }}>
            {schedule.backup.totalMessagesChild && (
              <span>
                {schedule.backup.currentSentMessagesChild}/
                {schedule.backup.totalMessagesChild}
              </span>
            )}
          </span>
          <div style={{ flex: 3, display: 'flex', justifyContent: 'center' }}>
            {renderActionsBackup(schedule.backup)}
          </div>
          <DialogDelete
            open={dialogDelete}
            title="Do you really want to delete?"
            handleConfirm={handleDelete}
            handleClose={() => setDialogDelete(false)}
          />
        </li>
      ) : (
        ''
      )}
    </>
  );
};

ScheduleItem.propTypes = {
  schedule: PropTypes.object.isRequired,
  onStop: PropTypes.func,
  onResume: PropTypes.func,
  onPause: PropTypes.func,
  onDelete: PropTypes.func
};

ScheduleItem.defaultProps = {};
export default ScheduleItem;
