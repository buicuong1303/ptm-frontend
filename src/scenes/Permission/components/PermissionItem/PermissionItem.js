/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import EditPermission from '../EditPermission';
import { CustomButton, DialogDelete } from 'components';
import { useDispatch } from 'react-redux';
import { deletePermission } from 'scenes/Permission/Permission.asyncActions';
// import { deleteStatePermission } from 'scenes/Permissions/Permissions.slice';

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
  }
}));

const PermissionItem = (props) => {
  const { id, permission, message, status, canUpdate, canDelete } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const [formatString, setFormatString] = useState({
    procession: '',
    action: ''
  });
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
    dispatch(deletePermission(permission));
    // dispatch(deleteStatePermission(permission));
    setDialogDeleteValue({ ...dialogDeleteValue, open: false });
  };

  const handleOpenEditPermission = () => {
    setEditItem({
      open: true,
      change: !editItem.change
    });
  };
  //* Handle Delete
  const handleDeletePermission = (id) => {
    handleOpenDialogDelete(
      id,
      'Do you really want to delete permission?',
      'Delete permission will set permission disable, you can\'t find it in this feature'
    );
  };
  useEffect(() => {
    const index = permission[1].indexOf(':');
    setFormatString({
      ...formatString,
      procession: permission[1].slice(index + 1),
      action: permission[1].slice(0, index)
    });
  }, [permission]);
  return (
    <li className={classes.fileItemActive}>
      <div style={{ flex: '0.5' }}> {id + 1} </div>
      <div style={{ flex: '2' }}>
        {permission[0] ? (
          <>
            {`${
              permission[2].charAt(0).toUpperCase() + permission[2].slice(1)
            } ${formatString.procession} ${formatString.action} ${
              permission[0].slice(1).charAt(0).toUpperCase() +
              permission[0].slice(2)
            }`}
          </>
        ) : (
          ''
        )}
      </div>
      <div style={{ flex: '1' }}> {permission[0]} </div>
      <div style={{ flex: '1' }}> {formatString.action} </div>
      <div style={{ flex: '1' }}>{permission[2]}</div>
      <div style={{ flex: '1', textAlign: 'center' }}>
        <CustomButton
          style={{
            minWidth: '40px',
            padding: '0px'
          }}
          theme="blue"
          disabled={!canUpdate}
          onClick={handleOpenEditPermission}
        >
          <EditIcon />
        </CustomButton>
        <CustomButton
          style={{
            minWidth: '40px',
            padding: '0px'
          }}
          theme="red"
          disabled={!canDelete}
          onClick={handleDeletePermission}
        >
          <DeleteIcon />
        </CustomButton>
        <EditPermission
          change={editItem.change}
          open={editItem.open}
          permission={permission}
          message={message}
          status={status}
        />
        <DialogDelete
          handleClose={handleCloseDialogDelete}
          handleConfirm={handleSubmitDialogDelete}
          message={dialogDeleteValue.message}
          open={dialogDeleteValue.open}
          title={dialogDeleteValue.title}
        />
      </div>
    </li>
  );
};

PermissionItem.prototype = {};

export default PermissionItem;
