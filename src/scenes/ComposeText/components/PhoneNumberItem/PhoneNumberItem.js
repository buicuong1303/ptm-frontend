/* eslint-disable no-unused-vars */
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import PropTypes from 'prop-types';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import theme from 'theme';
import { formatPhoneNumber } from 'utils/formatPhoneNumber';
import { StringFormat } from 'components';
const useStyles = makeStyles((theme) => ({
  phoneNumberItem: {
    backgroundColor: '#fff',
    padding: '10px 10px',
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '1px 1px 5px #ccc',
    listStyle: 'none',
    margin: '4px',
    justifyContent: 'space-between'
  },

  content: {
    flex: 10,
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    display: '-webkit-box',
    textOverflow: 'ellipsis',
    wordBreak: 'break-word'
  },
  actions: {
    margin: '0px 3px'
  },
  controlActions: {
    padding: theme.spacing(2),
    minWidth: '150px',
    backgroundColor: '#fff'
  },
  icon: {
    marginLeft: 'auto',
    color: theme.palette.success.main,
    cursor: 'pointer'
  }
}));

function PhoneNumberItem(props) {
  const classes = useStyles();
  const { phoneNumber, isSelected, onRemove, onAdd, index } = props;
  const handleRemove = () => {
    if (onRemove) onRemove(index);
  };
  const handleAdd = () => {
    if (onAdd) onAdd(index);
  };
  return (
    <li className={classes.phoneNumberItem}>
      <StringFormat isPhoneNumber value={phoneNumber} />
      {isSelected ? (
        <RemoveCircleOutlineIcon
          className={classes.icon}
          style={{
            color: theme.palette.error.main,
            marginLeft: '2px',
            cursor: 'pointer'
          }}
          onClick={handleRemove}
        />
      ) : (
        <AddCircleIcon className={classes.icon} onClick={handleAdd} />
      )}
    </li>
  );
}
PhoneNumberItem.propTypes = {
  phoneNumber: PropTypes.string
};
PhoneNumberItem.defaultProps = {
  phoneNumber: ''
};
export default PhoneNumberItem;
