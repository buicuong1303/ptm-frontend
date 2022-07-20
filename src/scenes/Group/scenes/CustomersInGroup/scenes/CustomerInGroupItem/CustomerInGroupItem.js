/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { CustomButton, DialogDelete } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { Switch } from '@material-ui/core';
import {
  changeStatusGroupCustomer,
  deleteCustomerInGroup
} from 'scenes/Group/Group.asyncAction';

const useStyles = makeStyles((theme) => ({
  fileItem: {
    borderBottom: '1px solid #d2d2d2',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    transition: 'all 1s',
    '&:hover': {
      backgroundColor: '#e7e7e7'
    },
    color: '#c1c1c1'
  },
  fileItemActive: {
    borderBottom: '1px solid #d2d2d2',
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    transition: 'all 1s',
    '&:hover': {
      backgroundColor: '#e7e7e7'
    }
  },
  list: {
    height: '100%',
    maxHeight: '75px',
    overflow: 'auto',
    margin: '0px'
  }
}));

const CustomerInGroupItem = (props) => {
  const { id, customer, groupId } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const message = useSelector((state) => state.group.message);
  const [check, setCheck] = useState(true);

  const changeStatus = () => {
    setCheck(!check);
    dispatch(
      changeStatusGroupCustomer({
        groupId: groupId,
        customerId: customer.id
      })
    );
  };

  //Handle Dialog delete
  const [dialogCustomerInGroupValue, setDialogCustomerInGroupValue] = useState({
    open: false,
    id: '',
    title: '',
    message: ''
  });
  const handleOpenDialogDelete = (id, title, message) =>
    setDialogCustomerInGroupValue({
      open: true,
      id: id,
      title: title,
      message: message
    });
  const handleCloseDialogDelete = () =>
    setDialogCustomerInGroupValue({
      ...dialogCustomerInGroupValue,
      open: false
    });

  const handleSubmitDialogDelete = () => {
    dispatch(
      deleteCustomerInGroup({
        customerId: customer.id,
        groupId: groupId
      })
    );
    setDialogCustomerInGroupValue({
      ...dialogCustomerInGroupValue,
      open: false
    });
  };

  //* Handle Delete
  const handleDeleteCustomerInGroup = (id) => {
    handleOpenDialogDelete(
      id,
      'Do you really want to delete client?',
      'Delete client will set client disable, you can\'t find it in this feature'
    );
  };
  // const handleDeleteGroup = () => {
  //   dispatch(deleteGroup(groupId));
  // };

  useEffect(() => {
    if (customer.groupCustomerStatus === 'active') {
      setCheck(true);
    } else {
      setCheck(false);
    }
  }, [customer.groupCustomerStatus]);
  
  useEffect(() => {
    if (message === 'change status failed') {
      if (customer.groupCustomerStatus === 'active') {
        setCheck(true);
      } else {
        setCheck(false);
      }
    }
  }, [message]);

  return (
    <li className={classes.fileItemActive}>
      <div style={{ flex: '1' }}> {id + 1} </div>
      <div style={{ flex: '3' }}>{customer.phoneNumber}</div>
      <div style={{ flex: '3' }}>{customer.fullName}</div>
      <div style={{ flex: '2' }}>
        <ul className={classes.list} id="customerList">
          {customer.companies.length > 0 ? (
            <>
              {customer.companies.map((item, index) =>
                <li key={index}>{item.company.name}</li>
              )}
            </>
          ) : (
            ''
          )}
        </ul>
      </div>
      <div style={{ flex: '2', textAlign: 'center' }}>
        <span style={{ color: '#2b8432', textTransform: 'capitalize' }}>
          {customer.groupCustomerStatus}
        </span>
      </div>
      <div style={{ flex: '2', textAlign: 'center' }}>
        <Switch size="small" checked={check} onChange={changeStatus} />
        <CustomButton
          style={{
            minWidth: '40px',
            padding: '0px'
          }}
          theme="red"
          onClick={handleDeleteCustomerInGroup}
        >
          <DeleteIcon />
        </CustomButton>
      </div>
      <DialogDelete
        handleClose={handleCloseDialogDelete}
        handleConfirm={handleSubmitDialogDelete}
        message={dialogCustomerInGroupValue.message}
        open={dialogCustomerInGroupValue.open}
        title={dialogCustomerInGroupValue.title}
      />
    </li>
  );
};

CustomerInGroupItem.prototype = {};

export default CustomerInGroupItem;
