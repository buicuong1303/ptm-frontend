import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';
import { CustomButton, StringFormat } from 'components';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import entityStatus from 'utils/entityStatus';

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

  ul: {
    listStyle: 'none',
    maxHeight: '75px',
    overflowY: 'auto'
  },

  li: {
    margin: theme.spacing(0.5, 0)
  }
}));

const Customer = (props) => {
  // eslint-disable-next-line
  const {handleChangePage, customer, no, handleOpenUpdateCustomer, handleOpenDialogDelete, canUpdate, canDelete, ...rest} = props;

  const classes = useStyles();

  //* UI
  return (
    <li
      className={
        customer.status === entityStatus.ACTIVE
          ? classes.customerItemActive
          : classes.customerItem
      }
    >
      <div style={{ flex: '1' }}> {no} </div>
      <div style={{ flex: '5' }}> {customer.fullName} </div>
      <div style={{ flex: '6' }}> {customer.emailAddress} </div>
      <div style={{ flex: '4' }}>
        <StringFormat isPhoneNumber value={customer.phoneNumber} />
      </div>
      <div style={{ flex: '5' }}>
        <ul className={classes.ul}>
          {(customer.companyCustomers || [])
            .map((item, index) => {
              if (item.status === entityStatus.ACTIVE) {
                return (
                  <li className={classes.li} key={item?.company?.id || index}>
                    {item?.company?.name}
                  </li>
                );
              }
            })
            .filter((item) => item)}
        </ul>
      </div>
      <div style={{ flex: '5' }}>
        <ul className={classes.ul}>
          {(customer.campaignCustomers || []).map((item, index) => {
            return (
              <li className={classes.li} key={item?.campaign?.id || index}>
                {item?.campaign?.name}
              </li>
            );
          })}
        </ul>
      </div>
      <div style={{ flex: '2', textAlign: 'center' }}>
        {customer.status === entityStatus.ACTIVE ? (
          <span style={{ color: '#2b8432', textTransform: 'capitalize' }}>
            {customer.status}
          </span>
        ) : (
          <span style={{ color: '#c1c1c1', textTransform: 'capitalize' }}>
            {customer.status}
          </span>
        )}
      </div>
      <div style={{ flex: '6', textAlign: 'center' }}>
        <CustomButton
          onClick={() => handleOpenUpdateCustomer(customer.id)}
          style={{ padding: '0px', minWidth: '50px' }}
          disabled={!canUpdate}
          theme="blue"
        >
          <Edit className={classes.iconEdit} />
        </CustomButton>
        <CustomButton
          onClick={() =>
            handleOpenDialogDelete(customer.id, customer.phoneNumber)
          }
          style={{ padding: '0px', minWidth: '50px' }}
          disabled={!canDelete}
          theme="red"
        >
          <Delete className={classes.iconDelete} />
        </CustomButton>
        <CustomButton
          onClick={() => handleChangePage(customer.phoneNumber)}
          style={{ padding: '0px', minWidth: '50px' }}
          disabled={!canUpdate}
          theme="blue"
        >
          <ZoomInIcon />
        </CustomButton>
      </div>
    </li>
  );
};

Customer.propTypes = {
  customer: PropTypes.object,
  no: PropTypes.number,
  handleOpenDialogDelete: PropTypes.func,
  handleOpenUpdateCustomer: PropTypes.func
};

export default Customer;
