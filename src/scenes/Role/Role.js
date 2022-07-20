/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/styles';
import { Backdrop, CircularProgress, Divider } from '@material-ui/core';
import { Page } from 'components';
import { Header, TableHead } from 'components';
import RoleItem from './components/RoleItem';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPermissionForRole, getAllRole } from './Role.asyncActions';
import AddRole from './components/AddRole';
import ButtonCreate from 'components/ButtonCreate';
import { PermissionContext } from 'contexts/PermissionProvider';
import { resetRole } from './Role.slice';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import apiStatus from 'utils/apiStatus';
import { useSnackbar } from 'notistack';

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
  backdrop: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  divider: {
    backgroundColor: theme.palette.primary.main,
    border: 'none',
    height: '2px',
    margin: '10px 0px'
  },
  container: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  list: {
    height: '100%',
    overflow: 'auto',
    margin: '0px'
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
    padding: `0px ${theme.spacing(2)}px `
  }
}));

const columns = [
  {
    name: 'No.',
    flex: 0.5
  },
  {
    name: 'Name',
    flex: 3
  },
  {
    name: 'Permissions',
    flex: 3
  },
  {
    name: 'Action',
    flex: 1,
    textAlign: 'center'
  }
];

const Role = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { authorizer } = useContext(PermissionContext);
  const listRole = useSelector((state) => state.role.role);
  const listPermission = useSelector((state) => state.role.permission);
  const status = useSelector((state) => state.role.status);
  const backdrop = useSelector((state) => state.role.backdrop);
  const message = useSelector((state) => state.role.message);
  const activeStatus = useSelector((state) => state.role.activeStatus);
  const [authorPermission, setAuthorPermission] = useState({
    canRead: false,
    canUpdate: false,
    canDelete: false,
    canCreate: false
  });
  const [addItem, setAddItem] = useState({
    open: false,
    change: false
  });
  const handleOpenCreateRole = () => {
    setAddItem({
      open: true,
      change: !addItem.change
    });
  };
  const getAuthor = async () => {
    setAuthorPermission({
      ...authorPermission,
      canRead: await authorizer.current.canAll('read', [
        '/roles',
        '/permissions'
      ]),
      canUpdate: await authorizer.current.can('update', '/roles'),
      canDelete: await authorizer.current.can('delete', '/roles'),
      canCreate: await authorizer.current.can('create', '/roles')
    });
  };

  //* Backdrop
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleToggleBackdrop = (backdrop) => {
    if (backdrop === apiStatus.PENDING) setOpenBackdrop(true);
    else setOpenBackdrop(false); 
  };

  const { enqueueSnackbar } = useSnackbar();
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  useEffect(() => {
    handleToggleBackdrop(backdrop);
    // eslint-disable-next-line
  }, [backdrop]);

  useEffect(() => {
    if (
      status == apiStatus.SUCCESS &&
      (message === 'Update role success' ||
        message === 'Delete role success' ||
        message === 'Create role success')
    ) {
      showSnackbar(message, 'success');
    } else if (status == apiStatus.ERROR && message) {
      showSnackbar(message || 'Role action failed', 'error');
    }
    // eslint-disable-next-line
  }, [status]);

  useEffect(() => {
    if (authorPermission.canRead) {
      const getInforRoles = async () => {
        await dispatch(getAllPermissionForRole());
        await dispatch(getAllRole());
      };
      getInforRoles();
    }
  }, [authorPermission]);
  useEffect(() => {
    getAuthor();
    return () => {
      dispatch(resetRole());
    };
  }, []);
  useEffect(() => {
    if (activeStatus === 'success') {
      const getInforRoles = async () => {
        await dispatch(getAllPermissionForRole());
        await dispatch(getAllRole({ isReload: true }));
      };
      getInforRoles();
    }
  }, [activeStatus]);
  return (
    <Page className={classes.root} title="Roles">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Header childTitle="Companies And Users" isParent />
        <NavigateNextIcon />
        <Header childTitle="Roles" urlChild="/roles" />
      </div>
      <Divider className={classes.divider} />
      <div style={{ flex: '2' }}>
        <ButtonCreate
          className={classes.buttonCreate}
          disabled={!authorPermission.canCreate}
          onClick={handleOpenCreateRole}
          size="small" // 'large' | 'medium' | 'small'
        />
      </div>
      <Paper className={classes.container} elevation={1} variant="outlined">
        <TableHead columns={columns} className={classes.tableHead} />
        <ul className={classes.list} id="agentsList">
          {listRole ? (
            <>
              {listRole.map((item, index) => (
                <RoleItem
                  id={index}
                  role={item}
                  permission={listPermission}
                  key={index}
                  canUpdate={authorPermission.canUpdate}
                  canDelete={authorPermission.canDelete}
                  status={status}
                />
              ))}
            </>
          ) : (
            ''
          )}
        </ul>
      </Paper>
      <AddRole
        change={addItem.change}
        open={addItem.open}
        permission={listPermission}
        status={status}
      />
      <Backdrop className={classes.backdrop} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Page>
  );
};

Role.propTypes = {};

export default Role;
