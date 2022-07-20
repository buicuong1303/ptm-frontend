/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Header, Page, TableHead } from 'components';
import {
  Backdrop,
  Box,
  CircularProgress,
  Divider,
  InputAdornment,
  Paper,
  TextField
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { useSnackbar } from 'notistack';
import apiStatus from 'utils/apiStatus';

import ButtonCreate from 'components/ButtonCreate';
// import Header from './components/Header';
import UserItem from './components/UserItem/UserItem';
import {
  getAllPermissionForUser,
  getAllRoleForUser,
  getAllUser,
  getFullInfor
} from './User.asyncActions';
import AddUser from './components/CreateUser';
import { getCompanies } from 'scenes/Company/Company.asyncAction';
import { PermissionContext } from 'contexts/PermissionProvider';
import { clearStatus, clearState } from './User.slice';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';
import SearchIcon from '@material-ui/icons/Search';
import UserInformation from './components/UserInformation';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flex: '100%',
    padding: `${theme.spacing(3)}px`
  },
  title: {},
  backdrop: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  usersTable: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    height: '0'
  },
  control: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(1)
  },
  currentItem: {
    width: '70px'
  },
  buttonCreate: {
    margin: '10px 0px',
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff'
  },
  search: {
    position: 'relative',
    flex: 5,
    display: 'flex',
    flexDirection: 'row-reverse'
  },
  groupSearch: {
    position: 'relative',
    maxWidth: '500px'
  },
  textField: {
    '& .MuiInputBase-formControl': {
      height: '40px'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'unset',
      boxShadow: '0 0 0 1px rgb(63 63 68 / 5%), 0 1px 3px 0 rgb(63 63 68 / 15%)'
    }
  },
  searchIcon: {
    position: 'absolute',
    left: '0px',
    top: '0px'
  },
  searchInput: {
    position: 'relative',
    width: '100%',
    border: 'unset !important'
  },
  searchClear: {
    border: 'unset',
    backgroundColor: 'unset',
    outline: 'none',
    '&:hover': {
      transform: 'scale(125%)'
    }
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
    margin: 'auto'
  },
  list: {
    height: '100%',
    overflow: 'auto',
    margin: '0px',
    position: 'relative',
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
  loadingItem: {
    position: 'absolute',
    bottom: '0px',
    width: '100%',
    borderBottom: '1px solid #d2d2d2',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    color: '#ffffff',
    backgroundColor: '#c1c1c1'
  },
  icon: {
    marginRight: '5px'
  },
  tableHead: {
    padding: `0px ${theme.spacing(2)}px `
  },
  divider: {
    backgroundColor: theme.palette.primary.main,
    border: 'none',
    height: '2px',
    margin: '10px 0px'
  }
}));

const columns = [
  {
    name: 'No.',
    flex: 1
  },
  {
    name: 'Full Name',
    flex: 4
  },
  {
    name: 'Email',
    flex: 6
  },
  {
    name: 'Username',
    flex: 3
  },
  {
    name: 'Role',
    flex: 2
  },
  {
    name: 'Permission',
    flex: 6
  },
  {
    name: 'Status',
    flex: 2,
    textAlign: 'center'
  },
  {
    name: 'Action',
    flex: 5,
    textAlign: 'center'
  }
];

const Users = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { authorizer } = useContext(PermissionContext);
  const [search, setSearch] = useState('');
  //* listen state
  const status = useSelector((state) => state.users.status);
  const backdrop = useSelector((state) => state.users.backdrop);
  const message = useSelector((state) => state.users.message);
  const listUser = useSelector((state) => state.users.listUser);
  const permission = useSelector((state) => state.users.permission);
  const role = useSelector((state) => state.users.role);
  const activeStatus = useSelector((state) => state.users.activeStatus);
  const [dataFilter, setDataFilter] = useState([]);
  //*Author
  const [authorPermission, setAuthorPermission] = useState({
    canRead: false,
    canUpdate: false,
    canDelete: false,
    canCreate: false
  });
  const getAuthor = async () => {
    setAuthorPermission({
      ...authorPermission,
      canRead: await authorizer.current.can('read', '/users'),
      canUpdate: await authorizer.current.can('update', '/users'),
      canDelete: await authorizer.current.can('delete', '/users'),
      canCreate: await authorizer.current.can('create', '/users')
    });
  };

  //* show notification
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  //* Backdrop
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleToggleBackdrop = (backdrop) => {
    if (backdrop === apiStatus.PENDING) setOpenBackdrop(true);
    else setOpenBackdrop(false);
  };

  const [userInformationDialog, setUserInformationDialog] = useState({
    open: false,
    user: {},
  });
  const closeUserInformationDialog = () => {
    setUserInformationDialog({
      open: false,
      user: {}
    });
  };
  const openUserInformationDialog = (user) => {
    setUserInformationDialog({
      open: true,
      user: user
    });
  };

  const [addItem, setAddItem] = useState({
    open: false,
    change: false
  });
  const handleOpenCreateUser = () => {
    setAddItem({
      open: true,
      change: !addItem.change
    });
  };
  const handleChangeSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const result = listUser.filter((user) => {
      const newObj = {
        email: user.email,
        username: user.username,
        fullName: user.firstName + ' ' + user.lastName
      };
      return Object.keys(newObj).some((key) =>
        newObj[key].toLowerCase().includes(value.toLowerCase())
      );
    });
    setDataFilter(result);
  };
  const renderListUsers = (users) => {
    return users.map((item, index) => (
      <UserItem
        user={item}
        // deleteCustomerDispatch={deleteCustomerDispatch}
        key={index}
        no={index + 1}
        permission={permission}
        role={role}
        canUpdate={authorPermission.canUpdate}
        canDelete={authorPermission.canDelete}
        status={status}
        message={message}
        // updateCustomerDispatch={updateCustomerDispatch}
      />
    ));
  };

  //* -------------- START HANDLE ACTION --------------
  useEffect(() => {
    handleToggleBackdrop(backdrop);
    // eslint-disable-next-line
  }, [backdrop]);

  useEffect(() => {
    if (
      status == apiStatus.SUCCESS &&
      (message === 'Update user success' ||
        message === 'Create user success' ||
        message === 'Delete user success')
    ) {
      showSnackbar(message, 'success');
    } else if (status == apiStatus.ERROR && message) {
      showSnackbar(message, 'error');
    }
    // eslint-disable-next-line
  }, [status]);

  useEffect(() => {
    if (authorPermission.canRead) {
      const getInfoUsers = async () => {
        await dispatch(getFullInfor());
        // dispatch(clearStatus());
      };
      getInfoUsers();
      dispatch(getCompanies());
    }
  }, [authorPermission]);

  useEffect(() => {
    getAuthor();
    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (activeStatus === 'success') {
      dispatch(getFullInfor({ isReload: true }));
      // dispatch(clearStatus());
    }
  }, [activeStatus]);
  //* ----------------  END USEEFFECT  ----------------

  //* render UI
  return (
    <Page className={classes.root} title="Users">
      {/* <Header childTitle="Users" urlChild="/users" /> */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Header childTitle="Companies And Users" isParent />
        <NavigateNextIcon />
        <Header childTitle="Users" urlChild="/users" />
      </div>
      <Divider className={classes.divider} />
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <ButtonCreate
          className={classes.buttonCreate}
          disabled={!authorPermission.canCreate}
          onClick={handleOpenCreateUser}
          size="small" // 'large' | 'medium' | 'small'
        />
        <TextField
          style={{ backgroundColor: '#fff', width: '500px' }}
          id="standard-start-adornment"
          value={search}
          onChange={handleChangeSearch}
          variant="outlined"
          size="small"
          placeholder="Search user...."
          className={clsx(classes.margin, classes.textField)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {search !== '' && (
                  <CloseIcon
                    className={classes.searchClear}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSearch('')}
                  />
                )}
              </InputAdornment>
            )
          }}
        />
      </Box>
      <Paper className={classes.usersTable} elevation={1} variant="outlined">
        <TableHead columns={columns} className={classes.tableHead} />
        <ul className={classes.list} id="customersList">
          {search === ''
            ? renderListUsers(listUser)
            : renderListUsers(dataFilter)}
        </ul>
      </Paper>

      <AddUser
        change={addItem.change}
        open={addItem.open}
        permission={permission}
        role={role}
        status={status}
        message={message}
        openUserInformationDialog={openUserInformationDialog}
      />

      <UserInformation
        open={userInformationDialog.open}
        onClose={closeUserInformationDialog}
        data={userInformationDialog.user}
      />

      <Backdrop className={classes.backdrop} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Page>
  );
};

export default Users;
