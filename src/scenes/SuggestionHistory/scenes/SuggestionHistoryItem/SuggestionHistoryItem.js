import React from 'react';
import { makeStyles } from '@material-ui/core';
// import { Edit, Delete } from '@material-ui/icons';
import { formatPhoneNumber } from 'utils/formatPhoneNumber';

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
    cursor: 'pointer',
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
  formatOut: {
    color: 'red'
  }
}));

const SuggestionHistoryItem = (props) => {
  // eslint-disable-next-line
  const { itemSelected, suggestionHistory, setItemSelected, showDetailSuggestion, no, ...rest} = props;

  const classes = useStyles();

  //* UI
  return (
    <li
      className={classes.customerItemActive}
      style={{
        backgroundColor:
          itemSelected === suggestionHistory.id ? '#F3FA92' : null
      }}
      onClick={() => showDetailSuggestion(suggestionHistory)}
    >
      <div style={{ flex: '0.5' }}> {no} </div>
      <div style={{ flex: '2' }}> {suggestionHistory.campaign.name} </div>
      <div style={{ flex: '2' }}>
        {' '}
        {formatPhoneNumber(suggestionHistory.customer.phoneNumber)}{' '}
      </div>
      {/* <div style={{ flex: '2' }}>{suggestionHistory.lastUserActive}</div> */}
      <div
        className={classes.formatOut}
        style={{ flex: '1', textAlign: 'center' }}
      >
        {suggestionHistory.status === 'active' ? 'OUT' : 'IN'}
      </div>
    </li>
  );
};

SuggestionHistoryItem.propTypes = {};

export default SuggestionHistoryItem;
