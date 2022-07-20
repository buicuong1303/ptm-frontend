/* eslint-disable prettier/prettier */
// /* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { CustomButton } from 'components';
import entityStatus from 'utils/entityStatus';

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
    },
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
function CampaignItem(props) {
  const classes = useStyles();
  const { campaign, onEdit, onDelete, authorPermission, index, no } = props;

  const handleEdit = (data) => onEdit(data);
  const handleDelete = (data) => onDelete(data);

  return (
    <li className={classes.signatureItem} style={{ color: campaign.status === entityStatus.INACTIVE && '#c1c1c1' }}>
      <span style={{ flex: 1 }}>{no}</span>
      <span style={{ flex: 6 }}>{campaign.name}</span>
      <span style={{ flex: 1, color: campaign.status === entityStatus.ACTIVE && '#2b8432' }}>
        {campaign.status}
      </span>
      <div style={{ flex: 2, textAlign: 'center' }}>
        <CustomButton
          onClick={() => handleEdit(index)}
          disabled={!authorPermission.canUpdate}
          style={{
            minWidth: '40px',
            padding: '0px'
          }}
          theme="blue"
        >
          <EditIcon />
        </CustomButton>
        <CustomButton
          onClick={() => handleDelete(index)}
          disabled={!authorPermission.canUpdate}
          style={{
            minWidth: '40px',
            padding: '0px'
          }}
          theme="red"
        >
          <DeleteIcon />
        </CustomButton>
      </div>
    </li>
  );
}

CampaignItem.propTypes = {
  campaign: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  no: PropTypes.number.isRequired
};

CampaignItem.defaultProps = {};
export default CampaignItem;
