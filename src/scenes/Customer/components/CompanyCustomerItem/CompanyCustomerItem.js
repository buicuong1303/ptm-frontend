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
  companyCustomerItem: {
    display: 'flex',
    flexDirection: 'row',
    '& li': {
      flex: 1
    }
  },
  companyItem: {
    listStyle: 'none'
  }
}));

const CompanyCustomerItem = (props) => {
  const { className, companies, customer, setFormState, ...rest } = props;

  const classes = useStyles();

  const [companyFormState, setCompanyFormState] = useState(
    companies.map((company, index) => {
      const indexCompany = customer.newCompanyCustomers
        .map((item) => item.companyId)
        .indexOf(company.id);
      if (indexCompany !== -1)
        return customer.newCompanyCustomers[indexCompany];
      else
        return {
          companyId: company.id,
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
    const index = companyFormState.map((item) => item.companyId).indexOf(id);

    let newFormState = cloneDeep(companyFormState);

    newFormState[index] = {
      ...newFormState[index],
      [name]:
        type === 'checkbox'
          ? checked
            ? entityStatus.ACTIVE
            : entityStatus.INACTIVE
          : value
    };

    setCompanyFormState(newFormState);
  };

  useEffect(() => {
    setFormState({
      ...customer,
      newCompanyCustomers: [...companyFormState]
    });
  }, [companyFormState]);

  return (
    <List style={{ padding: '8px' }}>
      {companies.map((item, index) => {
        const checkedRef = useRef();
        return (
          <div className={classes.companyCustomerItem} key={index}>
            <ListItem
              className={classes.companyItem}
              onClick={() => checkedRef.current.click()}
              button
            >
              <ListItemText primary={item.name} />
              <ListItemSecondaryAction>
                <Checkbox
                  id={companyFormState[index].companyId}
                  name="status"
                  onClick={(event) => {
                    if (!event.target.checked) {
                      const customEvent = {
                        ...event,
                        target: {
                          type: 'checkbox',
                          checked:
                            companyFormState[index].status ===
                            entityStatus.ACTIVE
                              ? false
                              : true,
                          name: 'status',
                          id: companyFormState[index].companyId
                        }
                      };
                      handleChange(customEvent);
                      return;
                    }
                    handleChange(event);
                  }}
                  checked={
                    companyFormState[index].status === entityStatus.ACTIVE
                  }
                  label="abc"
                  inputProps={{ 'aria-labelledby': item.id }}
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

CompanyCustomerItem.propTypes = {
  className: PropTypes.string,
  companies: PropTypes.array,
  customer: PropTypes.object,
  setFormState: PropTypes.func
};

export default CompanyCustomerItem;
