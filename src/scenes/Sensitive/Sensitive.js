/* eslint-disable prettier/prettier */
import { Backdrop, CircularProgress, Divider, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { DialogDelete, Header, Page, TableHead } from 'components';
import React, { useContext, useEffect, useState } from 'react';
import ButtonCreate from 'components/ButtonCreate';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import apiStatus from 'utils/apiStatus';
import SensitiveList from './scenes/SensitiveList';
import SimpleDialog from './scenes/SimpleDialog';
import { clearStateSensitive } from './Sensitive.slice';
import { createSensitives, deleteSensitives, getSensitives, updateSensitives } from './Sensitive.asyncAction';
import { PermissionContext } from 'contexts/PermissionProvider';
import AuthGuard from 'components/AuthGuard';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

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
    flexDirection: 'column',
    zIndex: 0
  },
  divider: {
    backgroundColor: theme.palette.primary.main,
    border: 'none',
    height: '2px',
    margin: '10px 0px'
  },
  buttonCreate: {
    margin: '10px 0px',
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff'
  },
  title: {},
  tableHead: {
    padding: `0px ${theme.spacing(2)}px`
  }
}));

const columns = [
  {
    name: 'No.',
    flex: 1
  },
  {
    name: 'Sensitive Key',
    flex: 6
  },
  {
    name: 'Type',
    flex: 3
  },
  {
    name: 'Direction',
    flex: 3
  },
  {
    name: 'Train status',
    flex: 3
  },
  {
    name: 'Status',
    flex: 1
  },
  {
    name: 'Actions',
    flex: 2,
    textAlign: 'center'
  }
];

function Sensitive() {
  const classes = useStyles();
  const dispatch = useDispatch();
  //   const { companies: companiesContext, setCompanies: setCompaniesContext } =
  //     useContext(CompanyContext);

  //* show notification
  const { enqueueSnackbar } = useSnackbar();
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  //* listens state from redux
  const sensitives = useSelector((state) => state.sensitive.sensitives);
  const sensitivesStatus = useSelector((state) => state.sensitive.status);
  const sensitivesMessage = useSelector((state) => state.sensitive.message);
  const backdrop = useSelector((state) => state.sensitive.backdrop);


  //* init page state
  const [open, setOpen] = useState(false);
  const [recordEditing, setRecordEditing] = useState(null);

  //* Backdrop
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleToggleBackdrop = (backdrop) => {
    if (backdrop === apiStatus.PENDING) setOpenBackdrop(true);
    else setOpenBackdrop(false);
  };

  //* Dialog Delete
  const [dialogDeleteValue, setDialogDeleteValue] = useState({
    open: false,
    id: '',
    title: '',
    message: ''
  });
  const handleOpenDialogDelete = (sensitiveId, title, message = '') =>
    setDialogDeleteValue({
      open: true,
      id: sensitiveId,
      title: title,
      message: message
    });
  const handleCloseDialogDelete = () =>
    setDialogDeleteValue({ ...dialogDeleteValue, open: false });
  const handleSubmitDialogDelete = () => {
    dispatch(deleteSensitives({ sensitiveId: dialogDeleteValue.id }));
    setDialogDeleteValue({ ...dialogDeleteValue, open: false });
  };

  //* handle show create form
  const handleCreate = () => setOpen(true);

  //* handle show update form
  const handleEdit = (index) => {
    setRecordEditing(sensitives[index]);
    setOpen(true);
  };

  //* handle show delete confirm
  const handleDelete = (index) =>
    handleOpenDialogDelete(
      sensitives[index].id,
      'Do you really want to delete sensitive ?',
      'Delete sensitive will set sensitive disable, you can\'t find it in this feature'
    );

  //* handle close create or update form
  const handleClose = () => {
    setOpen(false);
    setRecordEditing(null);
  };

  //* handle submit form create or update form
  const handleSubmit = async (values) => {
    if (values.id) {
      dispatch(
        updateSensitives({ sensitiveId: values.id, sensitive: values })
      );
    } else dispatch(createSensitives({ sensitive: values }));
  };

  //*Handle Author
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
      canRead: await authorizer.current.can('read', '/sensitives'),
      canUpdate: await authorizer.current.can('update', '/sensitives'),
      canDelete: await authorizer.current.can('delete', '/sensitives'),
      canCreate: await authorizer.current.can('create', '/sensitives')
    });
  };

  useEffect(() => {
    handleToggleBackdrop(backdrop);
    // eslint-disable-next-line
  }, [backdrop]);


  useEffect(() => {
    getAuthor();
    dispatch(getSensitives());
    return () => dispatch(clearStateSensitive());
  }, []);

  //* listen status and show notification
  useEffect(() => {
    if (
      sensitivesStatus === apiStatus.SUCCESS &&
        sensitivesMessage === 'Create sensitive success'
    ) {
      showSnackbar(sensitivesMessage, sensitivesStatus);
      handleClose();
    }
    if (
      sensitivesStatus === apiStatus.SUCCESS &&
        sensitivesMessage === 'Update sensitive success'
    ) {
      showSnackbar(sensitivesMessage, sensitivesStatus);
      handleClose();
    }
    if (
      sensitivesStatus === apiStatus.SUCCESS &&
        sensitivesMessage === 'Delete sensitive success'
    )
      showSnackbar(sensitivesMessage, sensitivesStatus);

    if (sensitivesStatus === apiStatus.ERROR)
      showSnackbar(sensitivesMessage, sensitivesStatus);
    // eslint-disable-next-line
  }, [sensitivesStatus]);

  //* render UI
  return (
    <AuthGuard
      requestPermissions={[{ action: 'read', result: '/sensitives' }, { action: 'read', result: '/manages' }]}
    >
      <DialogDelete
        handleClose={handleCloseDialogDelete}
        handleConfirm={handleSubmitDialogDelete}
        message={dialogDeleteValue.message}
        open={dialogDeleteValue.open}
        title={dialogDeleteValue.title}
      />

      <Backdrop className={classes.backdrop} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Page title="Sensitive Setting" className={classes.root}>
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Header childTitle="Compliance" isParent />
            <NavigateNextIcon />
            <Header childTitle="Rules" isParent />
            <NavigateNextIcon />
            <Header childTitle="Sensitive Setting" urlChild="/sensitive-setting" />
          </div>
          <Divider className={classes.divider} />
          <ButtonCreate
            className={classes.buttonCreate}
            disabled={!authorPermission.canCreate}
            onClick={handleCreate}
            size="small" // 'large' | 'medium' | 'small'
          />
          <Paper className={classes.paper} elevation={1} variant="outlined">
            <TableHead className={classes.tableHead} columns={columns} />
            <SensitiveList
              sensitives={sensitives}
              onEdit={handleEdit}
              onDelete={handleDelete}
              authorPermission={authorPermission}
            />
            <SimpleDialog
              title={recordEditing ? 'Update Sensitive' : 'Create Sensitive'}
              onClose={handleClose}
              onSubmit={handleSubmit}
              onEdit={handleEdit}
              open={open}
              recordEditing={recordEditing}
            />
          </Paper>
        </div>
      </Page>
    </AuthGuard>
  );
}

export default Sensitive;
