/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Backdrop, CircularProgress, Divider, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Header, Page, TableHead } from 'components';
import ButtonCreate from 'components/ButtonCreate';
import ButtonUpload from 'components/ButtonUpload';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import apiStatus from 'utils/apiStatus';
import { createGroup, getGroup, readFile } from './Group.asyncAction';
import { clearGroupState } from './Group.slice';
import CustomersInGroup from './scenes/CustomersInGroup';
import GroupDialog from './scenes/GroupDialog';
import GroupList from './scenes/GroupList';
import PublishIcon from '@material-ui/icons/Publish';
import { Update } from '@material-ui/icons';
import { PermissionContext } from 'contexts/PermissionProvider';

const useStyles = makeStyles((theme) => ({
  root: {
    // [theme.breakpoints.down('xl')]: {
    //   width: theme.breakpoints.values.xl
    // },
    // [theme.breakpoints.down('lg')]: {
    //   width: theme.breakpoints.values.lg
    // },

    height: '100%',
    margin: '0 auto',
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      width: '100%'
    }
  },
  backdrop: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  paper: {
    flex: '1',
    display: 'flex',
    minHeight: 0,
    flexDirection: 'column'
  },
  divider: {
    backgroundColor: theme.palette.primary.main,
    border: 'none',
    height: '2px',
    margin: '10px 0px'
  },
  buttonCreate: {
    margin: '10px 10px 10px 0px',
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff'
  },
  tableHead: {
    padding: '0px 16px'
  }
}));
const columns = [
  {
    name: 'No.',
    flex: 1
  },
  {
    name: 'Name',
    flex: 2
  },
  {
    name: 'Description',
    flex: 4
  },
  {
    name: 'Status',
    flex: 1
  },
  {
    name: 'Action',
    flex: 2,
    textAlign: 'center'
  }
];

function Group() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const groups = useSelector((state) => state.group.groups);
  const { status, backdrop, message, listCustomerToCheck } = useSelector(
    (state) => state.group
  );
  const [update, setUpdate] = useState({
    active: false,
    groupId: ''
  });
  const [title, setTitle] = useState('Group');

  const [open, setOpen] = useState(false);
  // const [openDialog, setOpenDialog] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const { enqueueSnackbar } = useSnackbar();
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  // const handleOpenDialog = () => {
  //   setOpenDialog(true);
  // };

  const handleCreate = () => {
    if (!update.active) {
      setOpen(true);
    }
  };
  const handleSubmit = (values) => {
    if (!values.id) dispatch(createGroup(values));
  };
  // const handleRemove = (values) => {
  //   dispatch(deleteCompany(values));
  // };
  const dataFake = [
    {
      name: 'Group 1',
      description: 'description group 1',
      status: 'active'
    },
    {
      name: 'Group 2',
      description: 'description group 1',
      status: 'active'
    },
    {
      name: 'Group 3',
      description: 'description group 1',
      status: 'active'
    },
    {
      name: 'Group 4',
      description: 'description group 1',
      status: 'active'
    }
  ];
  const handleBack = () => {
    setUpdate({
      ...Update,
      active: false
    });
  };

  const handleChooseFile = (dataFile) => {
    dispatch(readFile({ file: dataFile, groupId: update.groupId }));
  };

  //* Backdrop
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleToggleBackdrop = (backdrop) => {
    if (backdrop === apiStatus.PENDING) setOpenBackdrop(true);
    else setOpenBackdrop(false); 
  };

  //*Author
  const { authorizer } = useContext(PermissionContext);
  const [authorPermission, setAuthorPermission] = useState({
    canRead: false,
    canUpdate: false,
    canDelete: false,
    canCreate: false
  });
  const getAuthor = async () => {
    setAuthorPermission({
      ...authorPermission,
      canRead: await authorizer.current.can('read', '/groups'),
      canUpdate: await authorizer.current.can('update', '/groups'),
      canDelete: await authorizer.current.can('delete', '/groups'),
      canCreate: await authorizer.current.can('create', '/groups')
    });
  };

  useEffect(() => {
    handleToggleBackdrop(backdrop);
    // eslint-disable-next-line
  }, [backdrop]);
  
  useEffect(() => {
    getAuthor();
    return () => {
      dispatch(clearGroupState());
    };
  }, []);

  useEffect(() => {
    if (authorPermission.canRead) {
      dispatch(getGroup());
    }
  }, [authorPermission]);
  
  // useEffect(() => {
  //   dispatch(getGroup());
  //   return () => {
  //     dispatch(clearGroupState());
  //   };
  // }, []);

  useEffect(() => {
    if (update.active) {
      setTitle('Groups > Update');
    } else {
      setTitle('Groups');
    }
  }, [update]);

  useEffect(() => {
    if (status == apiStatus.SUCCESS && message) {
      setOpen(false);
      showSnackbar(message, 'success');
    } else if (status == apiStatus.ERROR && message) {
      setOpen(false);
      showSnackbar(message, 'error');
    }
  }, [status]);

  return (
    <>
      <Page title="Groups" className={classes.root}>
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <Header childTitle={title} urlChild="/groups" onClick={handleBack} />
          <Divider className={classes.divider} />
          <div style={{ display: 'flex' }}>
            {update.active ? (
              <ButtonUpload
                accept=".xlsx, .xls, .csv"
                className={classes.buttonCreate}
                handleChooseFile={handleChooseFile}
                disabled={!authorPermission.canUpdate}
                size="small"
              />
            ) : (
              <ButtonCreate
                className={classes.buttonCreate}
                onClick={handleCreate}
                disabled={!authorPermission.canCreate}
                size="small" // 'large' | 'medium' | 'small'
              />
            )}
          </div>
          {update.active ? (
            <CustomersInGroup
              groupId={update.groupId}
              // openDialog={openDialog}
              listCustomerToCheck={listCustomerToCheck}
              message={message}
              status={status}
            />
          ) : (
            <Paper className={classes.paper} elevation={3} variant="outlined">
              <TableHead columns={columns} className={classes.tableHead} />
              <GroupList
                dataGroup={groups}
                setUpdate={setUpdate}
                authorPermission={authorPermission}
              />
              <GroupDialog
                onClose={handleClose}
                onSubmit={handleSubmit}
                open={open}
              />
            </Paper>
          )}
        </div>
        <Backdrop className={classes.backdrop} open={openBackdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Page>
    </>
  );
}

export default Group;
