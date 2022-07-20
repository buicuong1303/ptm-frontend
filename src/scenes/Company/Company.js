/* eslint-disable prettier/prettier */
import { Backdrop, CircularProgress, Divider, IconButton, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { DialogDelete, Header, Page, TableHead } from 'components';
import ButtonCreate from 'components/ButtonCreate';
import { PermissionContext } from 'contexts/PermissionProvider';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSignatures } from 'scenes/Signature/Signature.asyncAction';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import apiStatus from 'utils/apiStatus';
import {
  createCompany,
  deleteCompany,
  getCompanies,
  updateCompany
} from './Company.asyncAction';
import { clearState } from './Company.slice';
import { CompanyList, SimpleDialog } from './components';
import { CompanyContext } from 'contexts/CompanyProvider';
import CachedIcon from '@material-ui/icons/Cached';

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
    zIndex: theme.zIndex.tooltip + 1,
    color: '#fff'
  },
  paper: {
    flex: '1',
    display: 'flex',
    minHeight: 0,
    flexDirection: 'column',
    minWidth: '1366px'
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
  tableHead: {
    padding: '0px 16px'
  },
  table: {
    flex: 1,
    display: 'flex',
    minHeight: 0,
    flexDirection: 'column',
    overflow: 'auto',
  }
}));

const columns = [
  {
    name: 'No.',
    flex: 1
  },
  {
    name: 'Name',
    flex: 5
  },
  {
    name: 'Code',
    flex: 3
  },
  {
    name: 'Phone',
    flex: 3
  },
  {
    name: 'Description',
    flex: 7
  },
  {
    name: 'Default signature',
    flex: 3
  },
  {
    name: 'App Infor',
    flex: 2,
    textAlign: 'center'
  },
  {
    name: 'App Status',
    flex: 2
  },
  {
    name: 'App Error',
    flex: 2,
    textAlign: 'center'
  },
  {
    name: 'Status',
    flex: 2
  },
  {
    name: 'Action',
    flex: 3,
    textAlign: 'center'
  }
];

function Company() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { authorizer } = useContext(PermissionContext);

  const { companies: companiesContext, setCompanies: setCompaniesContext } =
    useContext(CompanyContext);
    
  const dataCompany = useSelector((state) => state.company.companies);
  const { status, message, backdrop } = useSelector((state) => state.company);
  
  const pulling = useRef(null);

  const [errorResponses, setErrorResponses] = useState([]);
  const [open, setOpen] = useState(false);
  const [recordEditing, setRecordEditing] = useState(null);
  const [itemDelete, setItemDelete] = useState(false);
  //*Author
  const [authorPermission, setAuthorPermission] = useState({
    canRead: false,
    canUpdate: false,
    canDelete: false,
    canCreate: false
  });

  //*Handle Author
  const getAuthor = async () => {
    setAuthorPermission({
      ...authorPermission,
      canRead: await authorizer.current.can('read', '/companies'),
      canUpdate: await authorizer.current.can('update', '/companies'),
      canDelete: await authorizer.current.can('delete', '/companies'),
      canCreate: await authorizer.current.can('create', '/companies')
    });
  };

  const handleClose = () => {
    setOpen(false);
    setRecordEditing(null);
  };
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  //* Backdrop
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleToggleBackdrop = (backdrop) => {
    if (backdrop === apiStatus.PENDING) setOpenBackdrop(true);
    else setOpenBackdrop(false); 
  };

  const handleCreate = () => {
    setOpen(true);
  };
  const handleSubmit = async (values) => {
    if (!values.id) {
      const action = await dispatch(createCompany(values));
      if (action?.payload?.error) {
        let errors;
        let messageData;
        try {
          messageData = JSON.parse(action?.payload?.error?.message);
          errors = messageData?.message;
        } catch (error) { errors = []; }

        if (messageData?.error === 'Bad Request') setErrorResponses(errors);
        else setOpen(false);
      }
    } else {
      const action = await dispatch(updateCompany(values));
      if (action?.payload) {
        if (action?.payload?.error) {
          let errors;
          let messageData;
          try {
            messageData = JSON.parse(action?.payload?.error?.message);
            errors = messageData?.message;
          } catch (error) { errors = []; }

          if (messageData?.error === 'Bad Request') setErrorResponses(errors);
          else setOpen(false);
        } else {
          setRecordEditing(null);

          const indexCompany = companiesContext.findIndex(
            (item) => item.id === action.payload.id
          );
          if (indexCompany !== -1) {
            companiesContext[indexCompany] = {
              ...companiesContext[indexCompany],
              code: action.payload.code,
              id: action.payload.id,
              name: action.payload.name,
              phone: action.payload.phone,
              signature: action.payload.signature
                ? {
                  id: action.payload.signature.id,
                  status: action.payload.signature.status,
                  value: action.payload.signature.value
                }
                : companiesContext[indexCompany].signature
            };
  
            setCompaniesContext(companiesContext);
          }
        }
      }
    }
  };
  const handleRemove = (value) => {
    setItemDelete(value);
  };
  const handleConfirm = () => {
    dispatch(deleteCompany(itemDelete));
    setItemDelete(null);
  };

  const handleEdit = async (id) => {
    let recordEdit = dataCompany.find((item) => item.id === id);
    setRecordEditing({
      ...recordEdit,
      signature: recordEdit.signature.id
    });
    setOpen(true);
  };
  const handleCloseDialogDelete = () => {
    setItemDelete(null);
  };

  const handleReload = () => {
    if (pulling.current) clearInterval(pulling.current);

    pulling.current = setInterval(() => {
      if (authorPermission.canRead) {
        dispatch(getCompanies());
        dispatch(getSignatures());
      }
    }, 30 * 1000);

    if (authorPermission.canRead) {
      dispatch(getCompanies());
      dispatch(getSignatures());
    }
  };

  useEffect(() => {
    handleToggleBackdrop(backdrop);
    // eslint-disable-next-line
  }, [backdrop]);

  useEffect(() => {
    if (authorPermission.canRead) {
      dispatch(getCompanies());
      dispatch(getSignatures());
    }
    // return () => {
    //   dispatch(clearState());
    // };
  }, [authorPermission]);

  useEffect(() => {
    getAuthor();

    if (pulling.current) clearInterval(pulling.current);
    pulling.current = setInterval(() => {
      if (authorPermission.canRead) {
        dispatch(getCompanies());
        dispatch(getSignatures());
      }
    }, 30 * 1000);

    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (status == apiStatus.SUCCESS && message) {
      setOpen(false);
      showSnackbar(message, 'success');
    } else if (status == apiStatus.ERROR && message) {
      // setOpen(false);
      showSnackbar(message, 'error');
    }
  }, [status]);

  return (
    <>
      <Page title="Companies" className={classes.root}>
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Header childTitle="Companies And Users" isParent />
            <NavigateNextIcon />
            <Header childTitle="Companies" urlChild="/companies" />
          </div>
          <Divider className={classes.divider} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <ButtonCreate
              className={classes.buttonCreate}
              disabled={!authorPermission.canCreate}
              onClick={handleCreate}
              size="small" // 'large' | 'medium' | 'small'
            />
            <IconButton color="primary" onClick={handleReload}>
              <CachedIcon />
            </IconButton>
          </div>
          <div className={classes.table}>
            <Paper className={classes.paper} elevation={3} variant="outlined">
              <TableHead columns={columns} className={classes.tableHead} />
              <CompanyList
                dataCompany={dataCompany}
                onEdit={handleEdit}
                onRemove={handleRemove}
                canUpdate={authorPermission.canUpdate}
                canDelete={authorPermission.canDelete}
              />
              <SimpleDialog
                onClose={handleClose}
                onSubmit={handleSubmit}
                open={open}
                recordEditing={recordEditing}
                errorResponses={errorResponses}
              />
            </Paper>
          </div>
        </div>

        <DialogDelete
          title="Do you really want to delete company?"
          message="Delete company will set company disable, you can't find it in this feature"
          open={!!itemDelete}
          handleClose={handleCloseDialogDelete}
          handleConfirm={handleConfirm}
        />

        <Backdrop className={classes.backdrop} open={openBackdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Page>
    </>
  );
}

export default Company;
