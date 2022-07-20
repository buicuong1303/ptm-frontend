/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PublishIcon from '@material-ui/icons/Publish';
import { CustomButton, DialogDelete } from 'components';
import { deleteGroup, updateGroup } from 'scenes/Group/Group.asyncAction';
import GroupDialog from '../GroupDialog';

const useStyles = makeStyles((theme) => ({
  bulkItem: {
    backgroundColor: '#fff',
    padding: '10px 10px',
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '1px 1px 5px #ccc',
    listStyle: 'none',
    margin: '8px'
  },

  description: {
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
function GroupItem(props) {
  const classes = useStyles();
  const { group, stt, setUpdate, authorPermission } = props;
  // const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const { status, message } = useSelector((state) => state.group);

  const [recordEditing, setRecordEditing] = useState({
    name: '',
    description: '',
    status: 'active'
  });
  const [open, setOpen] = useState(false);

  const handleSubmit = (values) => {
    if (!values.id)
      dispatch(updateGroup({ groupId: group.id, newGroup: values }));
  };
  const handleEdit = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleImport = () => {
    setUpdate({
      active: true,
      groupId: group.id
    });
  };
  //Handle Dialog delete
  const [dialogGroupValue, setDialogGroupValue] = useState({
    open: false,
    id: '',
    title: '',
    message: ''
  });
  const handleOpenDialogDelete = (id, title, message) =>
    setDialogGroupValue({
      open: true,
      id: id,
      title: title,
      message: message
    });
  const handleCloseDialogDelete = () =>
    setDialogGroupValue({ ...dialogGroupValue, open: false });

  const handleSubmitDialogDelete = () => {
    dispatch(deleteGroup(group.id));
    setDialogGroupValue({ ...dialogGroupValue, open: false });
  };

  //* Handle Delete
  const handleDeleteGroup = (id) => {
    handleOpenDialogDelete(
      id,
      'Do you really want to delete group?',
      'Delete group will set group disable, you can\'t find it in this feature'
    );
  };

  useEffect(() => {
    if (group) {
      setRecordEditing({
        name: group.name,
        description: group.description,
        status: group.status
      });
    }
  }, [group]);

  useEffect(() => {
    if (status === 'success' && message === 'update group success') {
      setOpen(false);
    }
  }, [status]);

  // const open = Boolean(anchorEl);
  return (
    <li className={classes.bulkItem}>
      <span style={{ flex: 1 }}>{stt}</span>
      <span style={{ flex: 2 }}>{group.name}</span>
      <span style={{ flex: 4 }} className={classes.description}>
        {group.description}
      </span>
      <span style={{ flex: 1, color: '#2b8432', textTransform: 'capitalize' }}>
        {group.status}
      </span>
      <div style={{ flex: 2, textAlign: 'center' }}>
        <CustomButton
          onClick={() => handleEdit()}
          style={{
            minWidth: '40px',
            padding: '0px'
          }}
          disabled={!authorPermission.canUpdate}
          theme="blue"
        >
          <EditIcon />
        </CustomButton>
        {group.status === 'active' ? (
          <CustomButton
            onClick={() => handleImport()}
            style={{
              minWidth: '40px',
              padding: '0px'
            }}
            disabled={!authorPermission.canUpdate}
            theme="blue"
          >
            <PublishIcon />
          </CustomButton>
        ) : (
          <CustomButton
            style={{
              minWidth: '40px',
              padding: '0px'
            }}
            theme="blue"
            disabled
          >
            <PublishIcon />
          </CustomButton>
        )}
        <CustomButton
          onClick={() => handleDeleteGroup(group.id)}
          disabled={!authorPermission.canDelete}
          style={{
            minWidth: '40px',
            padding: '0px'
          }}
          theme="red"
        >
          <DeleteIcon />
        </CustomButton>
      </div>
      <DialogDelete
        handleClose={handleCloseDialogDelete}
        handleConfirm={handleSubmitDialogDelete}
        message={dialogGroupValue.message}
        open={dialogGroupValue.open}
        title={dialogGroupValue.title}
      />
      <GroupDialog
        onClose={handleClose}
        recordEditing={recordEditing}
        onSubmit={handleSubmit}
        open={open}
      />
    </li>
  );
}
GroupItem.propTypes = {
  group: PropTypes.object.isRequired
};

GroupItem.defaultProps = {};
export default GroupItem;
