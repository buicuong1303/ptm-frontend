import React from 'react';
import { makeStyles } from '@material-ui/core';
import moment from 'moment';
import { green, red } from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { CustomButton } from 'components';
import ZoomInIcon from '@material-ui/icons/ZoomIn';

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
  }
}));

const SuggestionHistoryDetailItem = (props) => {
  // eslint-disable-next-line
  const { suggestionHistoryDetail,handleClick, no, ...rest} = props;

  const classes = useStyles();

  //* UI
  return (
    <li className={classes.customerItemActive}>
      <div style={{ flex: '0.5' }}> {no} </div>
      <div
        className={
          suggestionHistoryDetail.optStatus === 'in'
            ? classes.formatIn
            : classes.formatOut
        }
        style={{ flex: '1' }}
      >
        {' '}
        {suggestionHistoryDetail.optStatus.toUpperCase()}{' '}
      </div>
      <div style={{ flex: '1', textAlign: 'center' }}>
        {' '}
        {suggestionHistoryDetail.suggestionStatus !== null ? (
          !suggestionHistoryDetail.suggestionStatus ? (
            <HighlightOffIcon style={{ color: red[500] }} />
          ) : (
            <CheckCircleIcon style={{ color: green[500] }} />
          )
        ) : (
          ''
        )}{' '}
      </div>
      <div style={{ flex: '3' }}>
        {' '}
        {moment(suggestionHistoryDetail.creationTime).format(
          'YYYY-MM-DD hh:mm:ss A'
        )}{' '}
      </div>
      <div style={{ flex: '2' }}>{suggestionHistoryDetail.lastUserActive}</div>
      <div style={{ flex: '3' }}> {suggestionHistoryDetail.reason} </div>
      <div style={{ flex: '1', textAlign: 'center' }}>
        <CustomButton
          onClick={() => handleClick(suggestionHistoryDetail)}
          disabled={suggestionHistoryDetail.messageId ? false : true}
          style={{ padding: '0px', minWidth: '50px' }}
          theme="green"
        >
          <ZoomInIcon />
        </CustomButton>
      </div>
    </li>
  );
};

SuggestionHistoryDetailItem.propTypes = {};

export default SuggestionHistoryDetailItem;
