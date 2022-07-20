/* eslint-disable prettier/prettier */
import { Backdrop, CircularProgress, Divider, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { DialogDelete, Header, Page, TableHead } from 'components';
import React, { useContext, useEffect, useState } from 'react';
import { SimpleDialog, SignatureList } from './components';
import ButtonCreate from 'components/ButtonCreate';
import { useDispatch, useSelector } from 'react-redux';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {
  createSignature,
  deleteSignature,
  getSignatures,
  updateSignature
} from './Signature.asyncAction';
import { clearStateSignature } from './Signature.slice';
import { useSnackbar } from 'notistack';
import apiStatus from 'utils/apiStatus';
import { PermissionContext } from 'contexts/PermissionProvider';
import { CompanyContext } from 'contexts/CompanyProvider';

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
    name: 'Name',
    flex: 3
  },
  {
    name: 'Value',
    flex: 6
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

function Signature() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { authorizer } = useContext(PermissionContext);
  const { companies: companiesContext, setCompanies: setCompaniesContext } =
    useContext(CompanyContext);

  //* show notification
  const { enqueueSnackbar } = useSnackbar();
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  //* listens state from redux
  const signatures = useSelector((state) => state.signature.signatures);
  const signatureStatus = useSelector((state) => state.signature.status);
  const signatureMessage = useSelector((state) => state.signature.message);
  const backdrop = useSelector((state) => state.signature.backdrop);

  //*Author
  const [authorPermission, setAuthorPermission] = useState({
    canRead: false,
    canUpdate: false,
    canDelete: false,
    canCreate: false
  });

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
  const handleOpenDialogDelete = (customerId, title, message = '') =>
    setDialogDeleteValue({
      open: true,
      id: customerId,
      title: title,
      message: message
    });
  const handleCloseDialogDelete = () =>
    setDialogDeleteValue({ ...dialogDeleteValue, open: false });
  const handleSubmitDialogDelete = () => {
    dispatch(deleteSignature({ signatureId: dialogDeleteValue.id }));
    setDialogDeleteValue({ ...dialogDeleteValue, open: false });
  };

  //*Handle Author
  const getAuthor = async () => {
    setAuthorPermission({
      ...authorPermission,
      canRead: await authorizer.current.can('read', '/signatures'),
      canUpdate: await authorizer.current.can('update', '/signatures'),
      canDelete: await authorizer.current.can('delete', '/signatures'),
      canCreate: await authorizer.current.can('create', '/signatures')
    });
  };

  //* handle show create form
  const handleCreate = () => setOpen(true);

  //* handle show update form
  const handleEdit = (index) => {
    setRecordEditing(signatures[index]);
    setOpen(true);
  };

  //* handle show delete confirm
  const handleDelete = (index) =>
    handleOpenDialogDelete(
      signatures[index].id,
      `Do you really want to delete signature ${signatures[index].name}?`,
      'Delete signature will set signature disable, you can\'t find it in this feature'
    );

  //* handle close create or update form
  const handleClose = () => {
    setOpen(false);
    setRecordEditing(null);
  };

  //* handle submit form create or update form
  const handleSubmit = async (values) => {
    if (values.id) {
      const action = await dispatch(
        updateSignature({ signatureId: values.id, signature: values })
      );
      if (action.payload) {
        const newCompaniesContext = companiesContext.map((item) => {
          return {
            ...item,
            signature: item.signature
              ? item.signature.id === action.payload.id
                ? {
                  ...item.signature,
                  id: action.payload.id,
                  status: action.payload.status,
                  value: action.payload.value
                }
                : item.signature
              : item.signature
          };
        });
        setCompaniesContext(newCompaniesContext);
      }
    } else dispatch(createSignature({ signature: values }));
  };

  useEffect(() => {
    handleToggleBackdrop(backdrop);
    // eslint-disable-next-line
  }, [backdrop]);

  useEffect(() => {
    if (authorPermission.canRead) {
      dispatch(getSignatures());
    }
  }, [authorPermission]);

  useEffect(() => {
    getAuthor();
    return () => dispatch(clearStateSignature());
  }, []);

  //* listen status and show notification
  useEffect(() => {
    if (
      signatureStatus === apiStatus.SUCCESS &&
      signatureMessage === 'Create signature success'
    ) {
      showSnackbar(signatureMessage, signatureStatus);
      handleClose();
    }
    if (
      signatureStatus === apiStatus.SUCCESS &&
      signatureMessage === 'Update signature success'
    ) {
      showSnackbar(signatureMessage, signatureStatus);
      handleClose();
    }
    if (
      signatureStatus === apiStatus.SUCCESS &&
      signatureMessage === 'Delete signature success'
    )
      showSnackbar(signatureMessage, signatureStatus);

    if (signatureStatus === apiStatus.ERROR)
      showSnackbar(signatureMessage, signatureStatus);
    // eslint-disable-next-line
  }, [signatureStatus]);

  //* render UI
  return (
    <>
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
      <Page title="Signatures" className={classes.root}>
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Header childTitle="Message" isParent />
            <NavigateNextIcon />
            <Header childTitle="Signatures" urlChild="/signatures" />
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
            <SignatureList
              signatures={signatures}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canDelete={authorPermission.canDelete}
              canUpdate={authorPermission.canUpdate}
            />
            <SimpleDialog
              title={recordEditing ? 'Update Signature' : 'Create Signature'}
              onClose={handleClose}
              onSubmit={handleSubmit}
              onEdit={handleEdit}
              open={open}
              recordEditing={recordEditing}
            />
          </Paper>
        </div>
      </Page>
    </>
  );
}

export default Signature;
