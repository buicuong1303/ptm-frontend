/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import { CustomButton } from 'components';
import entityStatus from 'utils/entityStatus';
import { formatPhoneNumber } from 'utils/formatPhoneNumber';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  signatureItem: {
    backgroundColor: '#fff',
    padding: theme.spacing(1, 1),
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '1px 1px 5px #ccc',
    listStyle: 'none',
    margin: theme.spacing(0, 0, 1),
    transition: 'all .5s',
    '&:hover': {
      transition: 'all 0s',
      backgroundColor: '#e7e7e7'
    }
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
  }
}));
function SensitiveOverviewItem(props) {
  const classes = useStyles();
  const { sensitiveOverview, handleClick, onEdit, index, no } = props;

  return (
    <li
      className={classes.signatureItem}
      style={{
        color: sensitiveOverview.status === entityStatus.INACTIVE && '#c1c1c1'
      }}
    >
      <span style={{ flex: 1 }}>{no}</span>
      <span style={{ flex: 3 }}>
        {sensitiveOverview.message.conversation.companyCustomer.company.name}
      </span>
      <span style={{ flex: 3 }}>
        {formatPhoneNumber(
          sensitiveOverview.message.conversation.companyCustomer.customer
            .phoneNumber
        )}
      </span>
      <span style={{ flex: 3 }}>
        {sensitiveOverview.message.lastModifiedUserId
          ? `${sensitiveOverview.message.lastModifiedUserId.firstName} ${sensitiveOverview.message.lastModifiedUserId.lastName}`
          : 'unknown'}
      </span>
      <span style={{ flex: 6 }}>{sensitiveOverview.message.text}</span>
      <span style={{ flex: 3 }}>{sensitiveOverview.reason}</span>
      <span style={{ flex: 3 }}>
        {moment(sensitiveOverview.creationTime).format('YYYY/MM/DD hh:mm:ss')}
      </span>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <CustomButton
          onClick={() => handleClick(sensitiveOverview)}
          style={{
            minWidth: '40px',
            padding: '0px'
          }}
          theme="blue"
        >
          <ZoomInIcon />
        </CustomButton>
      </div>
    </li>
  );
}

SensitiveOverviewItem.propTypes = {
  sensitiveOverview: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  no: PropTypes.number.isRequired
};

SensitiveOverviewItem.defaultProps = {};
export default SensitiveOverviewItem;
