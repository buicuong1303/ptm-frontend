/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';
import { CustomButton, DialogDelete } from 'components';
import entityStatus from 'utils/entityStatus';
import EditUser from '../EditUser';
import { useDispatch } from 'react-redux';
import { deleteUser } from 'scenes/User/User.asyncActions';

const useStyles = makeStyles((theme) => ({
  customerItem: {
    borderBottom: '1px solid #d2d2d2',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
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
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px `,
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
    listStyle: 'none',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '5px'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 5px grey'
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.primary.main
    }
  },
  listDepartment: {
    height: '120px',
    listStyle: 'none',
    display: 'table-cell',
    verticalAlign: 'middle'
  },
  list: {
    height: '100%',
    maxHeight: '75px',
    overflow: 'auto',
    margin: '0px',
    '&::-webkit-scrollbar': {
      width: '5px'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 5px grey'
    },
    '&:-webkit-scrollbar-thumb': {
      background: theme.palette.primary.main
    }
  }
}));

const UserItem = (props) => {
  // eslint-disable-next-line
  const {
    user,
    no,
    permission,
    role,
    status,
    message,
    canUpdate,
    canDelete,
    ...rest
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const [editItem, setEditItem] = useState({
    open: false,
    change: false
  });
  //Handle Dialog delete
  const [dialogDeleteValue, setDialogDeleteValue] = useState({
    open: false,
    id: '',
    title: '',
    message: ''
  });
  const handleOpenDialogDelete = (id, title, message) =>
    setDialogDeleteValue({
      open: true,
      id: id,
      title: title,
      message: message
    });
  const handleCloseDialogDelete = () =>
    setDialogDeleteValue({ ...dialogDeleteValue, open: false });
  const handleSubmitDialogDelete = () => {
    dispatch(deleteUser(user.id));
    setDialogDeleteValue({ ...dialogDeleteValue, open: false });
  };
  //* Handle Delete
  const handleDeleteUser = (id, userFullName) => {
    handleOpenDialogDelete(
      id,
      `Do you really want to delete user ${userFullName}?`,
      'Delete user will set user disable, you can\'t find it in this feature'
    );
  };
  const handleOpenEditPermission = () => {
    setEditItem({
      open: true,
      change: !editItem.change
    });
  };

  //* UI
  return (
    <li
      className={
        user.status === entityStatus.ACTIVE
          ? classes.customerItemActive
          : classes.customerItem
      }
    >
      <div style={{ flex: '1' }}> {no} </div>
      <div style={{ flex: '4' }}> {`${user.firstName} ${user.lastName}`} </div>
      <div style={{ flex: '6' }}> {user.email} </div>
      <div style={{ flex: '3' }}> {user.username} </div>
      <div style={{ flex: '2' }}>
        <ul className={classes.list} id="roleList">
          {user.role ? (
            <>
              {user.role.map((item, index) => (
                <li key={index}>{item.slice(5)}</li>
              ))}
            </>
          ) : (
            ''
          )}
        </ul>
      </div>
      <div style={{ flex: '6' }}>
        <ul className={classes.list} id="permissionList">
          {user.permission ? (
            <>
              {user.permission.map((item, index) => (
                <li key={index}>
                  {item[1].indexOf('own') > 0
                    ? `${item[2]} own ${item[1].slice(
                      0,
                      item[1].indexOf(':')
                    )} ${item[0].slice(1)}`
                    : `${item[2]} any ${item[1].slice(
                      0,
                      item[1].indexOf(':')
                    )} ${item[0].slice(1)}`}
                </li>
              ))}
            </>
          ) : (
            ''
          )}
        </ul>
      </div>
      <div style={{ flex: '2', textAlign: 'center' }}>
        {' '}
        {user.status === entityStatus.ACTIVE ? (
          <span style={{ color: '#2b8432', textTransform: 'capitalize' }}>
            {user.status}
          </span>
        ) : (
          <span style={{ color: '#c1c1c1', textTransform: 'capitalize' }}>
            {user.status}
          </span>
        )}{' '}
      </div>
      <div style={{ flex: '5', textAlign: 'center' }}>
        <CustomButton
          onClick={handleOpenEditPermission}
          style={{ padding: '0px', minWidth: '50px' }}
          disabled={!canUpdate}
          theme="blue"
        >
          <Edit className={classes.iconEdit} />
        </CustomButton>
        <CustomButton
          onClick={() => handleDeleteUser(user.id, user.firstName+' '+user.lastName)}
          style={{ padding: '0px', minWidth: '50px' }}
          disabled={!canDelete}
          theme="red"
        >
          <Delete className={classes.iconDelete} />
        </CustomButton>
      </div>
      <EditUser
        change={editItem.change}
        open={editItem.open}
        user={user}
        permission={permission}
        role={role}
        status={status}
        message={message}
      />
      <DialogDelete
        handleClose={handleCloseDialogDelete}
        handleConfirm={handleSubmitDialogDelete}
        message={dialogDeleteValue.message}
        open={dialogDeleteValue.open}
        title={dialogDeleteValue.title}
      />
    </li>
  );
};

UserItem.propTypes = {};

export default UserItem;
