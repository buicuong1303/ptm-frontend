/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import {
  FormControl,
  IconButton,
  Input,
  makeStyles,
  MenuItem,
  Select,
  Tooltip
} from '@material-ui/core';
// import { Edit, Delete } from '@material-ui/icons';
import { CustomButton } from 'components';
import entityStatus from 'utils/entityStatus';
import { formatPhoneNumber } from 'utils/formatPhoneNumber';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import moment from 'moment';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import CloseIcon from '@material-ui/icons/Close';
import { green, red } from '@material-ui/core/colors';
import { Stack } from '@mui/material';
import parseHtml from 'utils/parseHtml';

const useStyles = makeStyles((theme) => ({
  customerItem: {
    borderBottom: '1px solid #d2d2d2',
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    transition: 'all .5s',
    '&:hover': {
      transition: 'all 0s',
      backgroundColor: '#e7e7e7'
    },
    color: '#c1c1c1'
  },

  customerItemActive: {
    borderBottom: '1px solid #d2d2d2',
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    transition: 'all .5s',
    '&:hover': {
      transition: 'all 0s',
      backgroundColor: '#e7e7e7'
    }
  },

  header: {
    display: 'flex',
    width: '100%',
    backgroundColor: '#d2d2d2'
  },

  dataItemList: {
    textAlign: 'left',
    paddingLeft: theme.spacing(1),
    height: '120px',
    listStyle: 'none'
  },

  listDepartment: {
    height: '120px',
    listStyle: 'none',
    display: 'table-cell',
    verticalAlign: 'middle'
  },
  formatIn: {
    color: 'green',
    textAlign: 'center'
  },
  formatOut: {
    color: 'red',
    textAlign: 'center'
  },
  suggestionStatusStyle: {
    textAlign: 'center'
  },
  margin: {
    height: 25
  },
  textBox: {
    width: 300
  },
  reasonContent: {
    overflow: 'hidden'
  }
}));

const OptSuggestionItem = (props) => {
  const {
    optSuggestion,
    handleClick,
    campaignList,
    authorPermission,
    no,
    handleUpdateCampaign,
    updateOptSuggestionStatus,
    handleSubmitReason
  } = props;

  const classes = useStyles();
  // eslint-disable-next-line no-unused-vars
  const [activeInput, setActiveInput] = useState(false);
  const handleSubmit = () => {
    // console.log('Submit');
  };
  //*Select campaign
  const [campaign, setCampaign] = useState(optSuggestion.campaignId);
  const [oldCampaign, setOldCampaign] = useState(optSuggestion.campaignId);
  // eslint-disable-next-line no-unused-vars
  const [activeSelect, setActiveSelect] = useState(false);
  const [valueReason, setValueReason] = useState(optSuggestion.reason);
  const changeCampaign = (data) => {
    setCampaign(data.target.value);
    // handleUpdateCampaign({
    //   optSuggestionId: optSuggestion.id,
    //   campaignId: data.target.value,
    //   confirm: null
    // });
    // setCampaign(data.target.value);
  };
  const updateCampaign = () => {
    handleUpdateCampaign({
      optSuggestionId: optSuggestion.id,
      campaignId: campaign,
      confirm: null
    });
    setActiveSelect(false);
  };

  const handleChangeInput = (event) => {
    setValueReason(event.target.value);
  };

  const handleCloseInput = () => {
    setActiveInput(false);
    setValueReason(optSuggestion.reason);
  };

  const handleCloseSelect = () => {
    setActiveSelect(false);
    setCampaign(oldCampaign);
  };

  const handleActiveInput = () => {
    if (optSuggestion.suggestionStatus === null) {
      setActiveInput(true);
    }
  };
  useEffect(() => {
    if (campaign !== oldCampaign) {
      setActiveSelect(true);
    } else {
      setActiveSelect(false);
    }
  }, [campaign]);

  useEffect(() => {
    setCampaign(optSuggestion.campaignId);
    setOldCampaign(optSuggestion.campaignId);
  }, [optSuggestion]);

  //* UI
  return (
    <li
      className={
        optSuggestion.status === entityStatus.ACTIVE
          ? classes.customerItemActive
          : classes.customerItem
      }
    >
      <div style={{ flex: '0.5' }}> {no} </div>
      {/* {' '}
        {optSuggestion.campaign ? optSuggestion.campaign : ''}{' '} */}
      <FormControl className={classes.formControl} style={{ flex: '2' }}>
        <Stack direction="row" spacing={1}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            style={{ flex: '2', maxWidth: 150 }}
            disabled={
              optSuggestion.suggestionStatus !== null ||
              !authorPermission.canUpdate
            }
            value={campaign}
            onChange={changeCampaign}
          >
            {campaignList.length > 0
              ? campaignList.map((item) => (
                  <MenuItem value={item.id} key={item.id}>
                    <Tooltip title={item.name}>
                      <p>{item.name ? item.name : ''}</p>
                    </Tooltip>
                  </MenuItem>
                ))
              : ''}
          </Select>
          {activeSelect ? (
            <>
              <IconButton
                aria-label="delete"
                className={classes.margin}
                style={{ color: '#00CE19' }}
                // disabled={!authorPermission.canUpdate}
                size="small"
                color="secondary"
                onClick={() => updateCampaign()}
              >
                <ArrowUpwardIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                style={{ color: '#FF2300' }}
                size="small"
                className={classes.margin}
                onClick={() => handleCloseSelect()}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </>
          ) : null}
        </Stack>
      </FormControl>
      <div style={{ flex: '1' }}>
        {' '}
        {formatPhoneNumber(optSuggestion.customerPhone)}{' '}
      </div>
      <div
        className={
          optSuggestion.optStatus === 'in'
            ? classes.formatIn
            : classes.formatOut
        }
        style={{ flex: '1' }}
      >
        {' '}
        {optSuggestion.optStatus.toUpperCase()}{' '}
      </div>
      <div className={classes.suggestionStatusStyle} style={{ flex: '1.5' }}>
        {' '}
        {optSuggestion.suggestionStatus !== null ? (
          !optSuggestion.suggestionStatus ? (
            <HighlightOffIcon style={{ color: red[500] }} />
          ) : (
            <CheckCircleIcon style={{ color: green[500] }} />
          )
        ) : (
          ''
        )}{' '}
      </div>
      {!activeInput ? (
        <Tooltip title={parseHtml(optSuggestion.reason)}>
          {/* <span style={{ flex: 2 }} className={classes.content}>
            {parseHtml(schedule.content)}
          </span> */}
          <div
            className={classes.reasonContent}
            style={{
              flex: '3',
              cursor:
                optSuggestion.suggestionStatus === null ? 'pointer' : null,
              maxHeight: 75
            }}
            onClick={() => {
              if (authorPermission.canUpdate) {
                handleActiveInput();
              }
            }}
          >
            {optSuggestion.reason ? (
              parseHtml(optSuggestion.reason)
            ) : (
              <button> </button>
            )}
          </div>
        </Tooltip>
      ) : (
        <FormControl
          style={{ flex: '3' }}
          margin="dense"
          onSubmit={handleSubmit}
        >
          <Stack direction="row" spacing={1}>
            <Input
              id="standard-adornment-amount"
              className={classes.textBox}
              value={valueReason}
              multiline
              onChange={(event) => handleChangeInput(event)}
            />
            <IconButton
              aria-label="delete"
              className={classes.margin}
              style={{ color: '#00CE19' }}
              size="small"
              color="secondary"
              onClick={() => {
                handleSubmitReason({
                  optSuggestionId: optSuggestion.id,
                  reason: valueReason
                });
                setActiveInput(false);
              }}
            >
              <ArrowUpwardIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              style={{ color: '#FF2300' }}
              size="small"
              className={classes.margin}
              onClick={() => handleCloseInput()}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        </FormControl>
      )}
      <div style={{ flex: '1.5' }}>{optSuggestion.lastUserActive}</div>
      <div style={{ flex: '1.5' }}>
        {' '}
        {moment(optSuggestion.creationTime).format(
          'YYYY-MM-DD hh:mm:ss A'
        )}{' '}
      </div>
      <div style={{ flex: '2', textAlign: 'center' }}>
        <CustomButton
          onClick={() =>
            updateOptSuggestionStatus({
              optSuggestionId: optSuggestion.id,
              campaignId: campaign,
              confirm: true
            })
          }
          disabled={
            optSuggestion.suggestionStatus !== null ||
            !authorPermission.canUpdate ||
            activeSelect ||
            activeInput
              ? true
              : false
          }
          style={{ padding: '0px', minWidth: '50px' }}
          theme="blue"
        >
          <div className={classes.iconEdit}>Yes</div>
        </CustomButton>
        <CustomButton
          onClick={() =>
            updateOptSuggestionStatus({
              optSuggestionId: optSuggestion.id,
              campaignId: campaign,
              confirm: false
            })
          }
          disabled={
            optSuggestion.suggestionStatus !== null ||
            !authorPermission.canUpdate ||
            activeSelect ||
            activeInput
              ? true
              : false
          }
          style={{ padding: '0px', minWidth: '50px' }}
          theme="red"
        >
          <div className={classes.iconDelete}>No</div>
        </CustomButton>
        <CustomButton
          disabled={optSuggestion.message ? false : true}
          onClick={() => handleClick(optSuggestion)}
          style={{ padding: '0px', minWidth: '50px' }}
          theme="green"
        >
          <ZoomInIcon />
        </CustomButton>
      </div>
    </li>
  );
};

OptSuggestionItem.propTypes = {};

export default OptSuggestionItem;
