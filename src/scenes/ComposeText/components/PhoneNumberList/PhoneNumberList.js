/* eslint-disable no-unused-vars */
import React from 'react';
import PhoneNumberItem from '../PhoneNumberItem';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

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
    justifyContent: 'center'
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
    color: 'green'
  },
  wrapperList: {
    height: '450px',
    padding: '5px 0px',
    overflow: 'auto',
    position: 'relative'
  }
}));
const PhoneNumberList = React.memo((props) => {
  const { listData, onRemove, onAdd, id, onFetch } = props;
  const handleScrollToBottom = () => {
    if (id) {
      const ele = document.querySelector('#list-customers');
      if (Math.ceil(ele.scrollTop) + ele.clientHeight < ele.scrollHeight) {
        return;
      }
      // eslint-disable-next-line
      if (onFetch) onFetch();
    }
  };
  const classes = useStyles();
  return (
    <ul id={id} className={classes.wrapperList} onScroll={handleScrollToBottom}>
      {listData.length > 0 &&
        listData.map((customer, index) => (
          <PhoneNumberItem
            index={index}
            key={index}
            phoneNumber={customer.phoneNumber ? customer.phoneNumber : customer}
            onRemove={onRemove}
            onAdd={onAdd}
            {...props}
          />
        ))}
    </ul>
  );
});

PhoneNumberList.propTypes = {
  listPhoneNumbers: PropTypes.array,
  onRemove: PropTypes.func,
  onAdd: PropTypes.func,
  onFetch: PropTypes.func
};
PhoneNumberList.defaultProps = {
  listPhoneNumbers: [],
  onFetch: null,
  listData: [],
  onAdd: null,
  onRemove: null,
  id: ''
};
export default PhoneNumberList;
