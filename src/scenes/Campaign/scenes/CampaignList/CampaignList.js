/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import CampaignItem from '../CampaignIem';

const useStyles = makeStyles((theme) => ({
  sensitiveList: {
    flex: 1,
    padding: theme.spacing(1, 1),
    overflowY: 'auto'
  }
}));

function CampaignList(props) {
  const { campaigns, authorPermission, onEdit, onDelete } = props;
  const classes = useStyles();

  return (
    <ul className={classes.sensitiveList}>
      {campaigns.map((campaign, index) => (
        <CampaignItem
          key={index}
          campaign={campaign}
          onEdit={onEdit}
          onDelete={onDelete}
          index={index}
          no={index + 1}
          authorPermission={authorPermission}
        />
      ))}
    </ul>
  );
}

CampaignList.propTypes = {
  campaigns: PropTypes.array,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

CampaignList.defaultProps = {
  sensitives: []
};
export default CampaignList;
