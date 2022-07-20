/* eslint-disable no-unused-vars */
import { Divider, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Header, Page, TableHead } from 'components';
import ButtonCreate from 'components/ButtonCreate';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomersInGroup } from 'scenes/Group/Group.asyncAction';
import apiStatus from 'utils/apiStatus';
import GroupList from '../GroupList';
import CustomerInGroupItem from './scenes/CustomerInGroupItem';
import GroupCustomerDialog from './scenes/GroupCustomerDialog';

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
    margin: '10px 0px',
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff'
  },
  tableHead: {
    // padding: '0px 24px'
  },
  list: {
    overflow: 'auto'
  }
}));
const columns = [
  {
    name: 'No.',
    flex: 1
  },
  {
    name: 'Phone',
    flex: 3
  },
  {
    name: 'Name',
    flex: 3
  },
  {
    name: 'Company',
    flex: 2
  },
  {
    name: 'Status',
    flex: 2,
    textAlign: 'center'
  },
  {
    name: 'Action',
    flex: 2,
    textAlign: 'center'
  }
];

function CustomersInGroup(props) {
  const classes = useStyles();
  const { groupId, openDialog, message, status, listCustomerToCheck } = props;
  const dispatch = useDispatch();

  const { customersInGroup } = useSelector((state) => state.group);

  // const [open, setOpen] = useState(false);

  // const handleClose = () => {
  //   setOpen(false);
  // };
  // const { enqueueSnackbar } = useSnackbar();
  // const showSnackbar = (message, status) =>
  //   enqueueSnackbar(message, { variant: status });

  // const handleCreate = () => {
  //   setOpen(true);
  // };
  // const handleSubmit = (values) => {
  //   if (!values.id) dispatch(createGroup(values));
  // };
  // const handleRemove = (values) => {
  //   dispatch(deleteCompany(values));
  // };

  useEffect(() => {
    dispatch(getCustomersInGroup(groupId));
  }, []);

  useEffect(() => {
    if (status === 'success' && message === 'add customers success') {
      dispatch(getCustomersInGroup(groupId));
    }
  }, [status]);

  return (
    <>
      <Paper className={classes.paper} elevation={3} variant="outlined">
        <TableHead columns={columns} className={classes.tableHead} />
        <ul className={classes.list} id="agentsList">
          {customersInGroup ? (
            <>
              {customersInGroup.map((item, index) => (
                <CustomerInGroupItem
                  id={index}
                  customer={item}
                  groupId={groupId}
                  key={index}
                  status={status}
                />
              ))}
            </>
          ) : (
            ''
          )}
        </ul>
        <GroupCustomerDialog
          // open={openDialog}
          message={message}
          listCustomerToCheck={listCustomerToCheck}
          groupId={groupId}
        />
      </Paper>
      {/* <GroupDialog
            onClose={handleClose}
            onSubmit={handleSubmit}
            open={open}
          /> */}
    </>
  );
}

export default CustomersInGroup;
