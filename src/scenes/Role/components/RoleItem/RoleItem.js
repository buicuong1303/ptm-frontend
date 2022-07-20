/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import EditRole from '../EditRole';
import { CustomButton, DialogDelete } from 'components';
import { useDispatch } from 'react-redux';
import { deleteRole } from 'scenes/Role/Role.asyncActions';

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
    maxHeight: '80px',
    overflow: 'auto',
    margin: '0px'
  }
}));

const RoleItem = (props) => {
  const { id, role, permission, status, canUpdate, canDelete } = props;
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
    dispatch(deleteRole(role.role.slice(5)));
    setDialogDeleteValue({ ...dialogDeleteValue, open: false });
  };
  //* Handle Delete
  const handleDeletePermission = (id) => {
    handleOpenDialogDelete(
      id,
      'Do you really want to delete role?',
      'Delete role will set role disable, you can\'t find it in this feature'
    );
  };
  const handleOpenEditRole = () => {
    setEditItem({
      open: true,
      change: !editItem.change
    });
  };
  return (
    <li className={classes.fileItemActive}>
      <div style={{ flex: '0.5' }}> {id + 1} </div>
      <div style={{ flex: '3' }}>{role.role.slice(5)}</div>
      <div style={{ flex: '3' }}>
        <ul className={classes.list} id="agentsList">
          {role.permissions ? (
            <>
              {role.permissions.map((item, index) => (
                <li key={index}>{`${
                  item[2].charAt(0).toUpperCase() + item[2].slice(1)
                } ${item[3]} ${item[1]} ${
                  item[0].slice(1).charAt(0).toUpperCase() + item[0].slice(2)
                }`}</li>
              ))}
            </>
          ) : (
            ''
          )}
        </ul>
      </div>
      <div style={{ flex: '1', textAlign: 'center' }}>
        <CustomButton
          style={{
            minWidth: '40px',
            padding: '0px'
          }}
          disabled={!canUpdate}
          theme="blue"
          onClick={handleOpenEditRole}
        >
          <EditIcon />
        </CustomButton>
        <CustomButton
          style={{
            minWidth: '40px',
            padding: '0px'
          }}
          disabled={!canDelete}
          theme="red"
          onClick={handleDeletePermission}
        >
          <DeleteIcon />
        </CustomButton>
      </div>
      <EditRole
        change={editItem.change}
        open={editItem.open}
        role={role}
        permission={permission}
        status={status}
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

RoleItem.prototype = {};

export default RoleItem;
