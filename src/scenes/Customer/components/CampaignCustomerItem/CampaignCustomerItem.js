/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Checkbox,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from '@material-ui/core';
import entityStatus from 'utils/entityStatus';
import { cloneDeep } from 'lodash';

const useStyles = makeStyles((theme) => ({
  campaignCustomerItem: {
    display: 'flex',
    flexDirection: 'row',
    '& li': {
      flex: 1
    }
  },
  campaignItem: {
    listStyle: 'none'
  }
}));

const CampaignCustomerItem = (props) => {
  const { className, campaigns, customer, setFormState, ...rest } = props;

  const classes = useStyles();

  const [campaignFormState, setCampaignFormState] = useState(
    campaigns.map((campaign, index) => {
      const indexCampaign = customer.newCampaignCustomers
        .map((item) => item.value)
        .indexOf(campaign.value);
      if (indexCampaign !== -1)
        return customer.newCampaignCustomers[indexCampaign];
      else
        return {
          value: campaign.value,
          status: entityStatus.INACTIVE
        };
    })
  );

  const handleChange = (event) => {
    const type = event.target.type;
    const value = event.target.value;
    const checked = event.target.checked;
    const name = event.target.name;
    const id = event.target.id;
    const index = campaignFormState.map((item) => item.value).indexOf(id);

    let newFormState = cloneDeep(campaignFormState);

    newFormState[index] = {
      ...newFormState[index],
      [name]:
        type === 'checkbox'
          ? checked
            ? entityStatus.ACTIVE
            : entityStatus.INACTIVE
          : value
    };

    setCampaignFormState(newFormState);
  };

  useEffect(() => {
    setFormState({
      ...customer,
      newCampaignCustomers: [...campaignFormState]
    });
  }, [campaignFormState]);

  return (
    <List style={{ padding: '8px' }}>
      {campaigns.map((item, index) => {
        const checkedRef = useRef();
        return (
          <div className={classes.campaignCustomerItem} key={index}>
            <ListItem
              className={classes.campaignItem}
              onClick={() => checkedRef.current.click()}
              button
            >
              <ListItemText primary={item.label} />
              <ListItemSecondaryAction>
                <Checkbox
                  id={campaignFormState[index].value}
                  name="status"
                  onClick={(event) => {
                    if (!event.target.checked) {
                      const customEvent = {
                        ...event,
                        target: {
                          type: 'checkbox',
                          checked:
                            campaignFormState[index].status ===
                            entityStatus.ACTIVE
                              ? false
                              : true,
                          name: 'status',
                          id: campaignFormState[index].value
                        }
                      };
                      handleChange(customEvent);
                      return;
                    }
                    handleChange(event);
                  }}
                  checked={
                    campaignFormState[index].status === entityStatus.ACTIVE
                  }
                  label="abc"
                  inputProps={{ 'aria-labelledby': item.value }}
                  ref={checkedRef}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </div>
        );
      })}
    </List>
  );
};

CampaignCustomerItem.propTypes = {
  className: PropTypes.string,
  campaigns: PropTypes.array,
  customer: PropTypes.object,
  setFormState: PropTypes.func
};

export default CampaignCustomerItem;
