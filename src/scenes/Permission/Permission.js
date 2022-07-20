/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/styles';
import { Backdrop, CircularProgress, Divider } from '@material-ui/core';
import { Page, TableHead } from 'components';
import { Header } from 'components';
import PermissionItem from './components/PermissionItem';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPermission } from './Permission.asyncActions';
import { resetPermission } from './Permission.slice';
import AddPermission from './components/AddPermission';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ButtonCreate from 'components/ButtonCreate';
import { PermissionContext } from 'contexts/PermissionProvider';
import apiStatus from 'utils/apiStatus';
import { useSnackbar } from 'notistack';
// import { Authorizer } from 'casbin.js';

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: '14px',
    position: 'relative',
    // width: theme.breakpoints.values.lg,
    // [theme.breakpoints.down('lg')]: {
    //   width: theme.breakpoints.values.lg
    // },

    // [theme.breakpoints.down('md')]: {
    //   width: theme.breakpoints.values.md
    // },
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    '& > *': {
      // margin: theme.spacing(1),
      width: '100%'
    }
  },
  backdrop: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  permissionTable: {
    position: 'relative',
    height: '0px',
    display: 'flex',
    flexDirection: 'column',
    flex: '100%'
  },
  header: {
    display: 'flex',
    width: '100%',
    backgroundColor: '#c1c1c1',
    padding: theme.spacing(1)
  },
  headerItem: {
    textAlign: 'left',
    paddingLeft: theme.spacing(1),
    margin: 'auto',
    fontWeight: 'bold'
  },
  icon: {
    marginRight: '5px'
  },
  divider: {
    backgroundColor: theme.palette.primary.main,
    border: 'none',
    height: '2px',
    margin: '10px 0px'
  },
  container: {
    position: 'relative',
    height: '88%',
    display: 'flex',
    flexDirection: 'column'
  },
  list: {
    height: '100%',
    overflow: 'auto'
  },
  addIcon: {
    color: '#21790f',
    cursor: 'pointer'
  },
  buttonCreate: {
    margin: '10px 0px',
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff'
  },
  tableHead: {
    padding: `0px ${theme.spacing(2)}px`
  }
}));

const columns = [
  {
    name: 'No.',
    flex: 0.5
  },
  {
    name: 'Name',
    flex: 2
  },
  {
    name: 'Resource',
    flex: 1
  },

  {
    name: 'Action',
    flex: 1
  },
  {
    name: 'Effect',
    flex: 1
  },
  {
    name: 'Action',
    flex: 1,
    textAlign: 'center'
  }
];

const Permissions = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { authorizer } = useContext(PermissionContext);
  const listPermission = useSelector((state) => state.permission.permission);
  const status = useSelector((state) => state.permission.status);
  const message = useSelector((state) => state.permission.message);
  const backdrop = useSelector((state) => state.permission.backdrop);
  const [addItem, setAddItem] = useState({
    open: false,
    change: false
  });
  const [authorPermission, setAuthorPermission] = useState({
    canRead: false,
    canUpdate: false,
    canDelete: false,
    canCreate: false
  });
  const handleOpenCreatePermission = () => {
    setAddItem({
      open: true,
      change: !addItem.change
    });
  };

  const { enqueueSnackbar } = useSnackbar();
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  const getAuthor = async () => {
    setAuthorPermission({
      ...authorPermission,
      canRead: await authorizer.current.can('read', '/permissions'),
      canUpdate: await authorizer.current.can('update', '/permissions'),
      canDelete: await authorizer.current.can('delete', '/permissions'),
      canCreate: await authorizer.current.can('create', '/permissions')
    });
  };

  //* Backdrop
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleToggleBackdrop = (backdrop) => {
    if (backdrop === apiStatus.PENDING) setOpenBackdrop(true);
    else setOpenBackdrop(false); 
  };

  useEffect(() => {
    handleToggleBackdrop(backdrop);
    // eslint-disable-next-line
  }, [backdrop]);

  useEffect(() => {
    if (status == apiStatus.SUCCESS && message) {
      showSnackbar(message, 'success');
    } else if (status == apiStatus.ERROR && message) {
      showSnackbar(message || 'Permission action failed', 'error');
    }
    // eslint-disable-next-line
  }, [status]);

  useEffect(() => {
    if (authorPermission.canRead) {
      dispatch(getAllPermission());
    }
  }, [authorPermission]);

  useEffect(() => {
    getAuthor();
    return () => {
      dispatch(resetPermission());
    };
  }, []);

  return (
    <Page className={classes.root} title="Permissions">
      {/* <Header childTitle="Permissions" urlChild="/permissions" /> */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Header childTitle="Companies And Users" isParent />
        <NavigateNextIcon />
        <Header childTitle="Permissions" urlChild="/permissions" />
      </div>
      <Divider className={classes.divider} />
      <div style={{ flex: '2' }}>
        <ButtonCreate
          className={classes.buttonCreate}
          disabled={!authorPermission.canCreate}
          onClick={handleOpenCreatePermission}
          size="small" // 'large' | 'medium' | 'small'
        />
      </div>
      <Paper className={classes.container} elevation={1} variant="outlined">
        <TableHead columns={columns} className={classes.tableHead} />
        <ul className={classes.list} id="agentsList">
          {listPermission ? (
            <>
              {listPermission.map((item, index) => (
                <PermissionItem
                  id={index}
                  permission={item}
                  key={index}
                  status={status}
                  message={message}
                  canUpdate={authorPermission.canUpdate}
                  canDelete={authorPermission.canDelete}
                />
              ))}
            </>
          ) : (
            ''
          )}
        </ul>
        <AddPermission
          change={addItem.change}
          open={addItem.open}
          status={status}
          message={message}
        />
      </Paper>
      <Backdrop className={classes.backdrop} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Page>
  );
};

Permissions.propTypes = {};

export default Permissions;
