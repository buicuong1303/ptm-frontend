/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { DialogDelete, Header, Page, TableHead } from 'components';
import { Backdrop, CircularProgress, Divider, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import apiStatus from 'utils/apiStatus';
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  readFile,
  updateCustomer
} from './Customer.asyncAction';

import { CreateCustomer, CustomerItem, Control, UpdateCustomer } from './components';
import ButtonCreate from 'components/ButtonCreate';
import { clearStateCustomer } from './Customer.slice';
import { getCompanies } from 'scenes/Company/Company.asyncAction';
import { PermissionContext } from 'contexts/PermissionProvider';
import ButtonUpload from 'components/ButtonUpload';
import ListCustomerAddDialog from './components/ListCustomerAddDialog';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { useHistory } from 'react-router';
import { getCampaigns } from 'scenes/Campaign/Campaign.asyncAction';
import { unwrapResult } from '@reduxjs/toolkit';
import Loading from 'images/Rolling-1s-200px.gif';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flex: '100%',
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
    minWidth: '1250px'
  },
  title: {},
  backdrop: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  customersTable: {
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
    backgroundColor: theme.palette.primary.main,
    marginRight: 10
    // color: '#ffffff',
    // '&:hover': {
    //   backgroundColor: '#ffffff',
    //   color: theme.palette.primary.main,
    //   border: `solid ${theme.palette.primary.main} 2px`,
    // }
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
    position: 'absolute',
    right: '0px',
    top: '0px'
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
    position: 'relative'
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
    backgroundColor: '#F5F5F5'
  },
  icon: {
    marginRight: '5px'
  },
  divider: {
    backgroundColor: '#3f51b5',
    border: 'none',
    height: '2px',
    margin: '10px 0px'
  },
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
    name: 'Full Name',
    flex: 5
  },
  {
    name: 'Email Address',
    flex: 6
  },
  {
    name: 'Phone Number',
    flex: 4
  },
  {
    name: 'Companies',
    flex: 5
  },
  {
    name: 'Campaigns',
    flex: 5
  },
  {
    name: 'Status',
    flex: 2,
    textAlign: 'center'
  },
  {
    name: 'Action',
    flex: 6,
    textAlign: 'center'
  }
];

const Customer = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { authorizer } = useContext(PermissionContext);

  //* listen state
  const status = useSelector((state) => state.customer.status);
  const error = useSelector((state) => state.customer.error);
  const message = useSelector((state) => state.customer.message);
  const backdrop = useSelector((state) => state.customer.backdrop);
  const customers = useSelector((state) => state.customer.customers);
  const searchValues = useSelector((state) => state.customer.searchValues);
  const totalCustomers = useSelector((state) => state.customer.totalCustomers);
  const companies = useSelector((state) => state.company.companies);
  const listCustomerToCheck = useSelector((state) => state.customer.listCustomerToCheck);
  const listError = useSelector((state) => state.customer.listError);

  const [campaigns, setCampaigns] = useState([]);

  //*Author
  const [authorPermission, setAuthorPermission] = useState({
    canRead: false,
    canUpdate: false,
    canDelete: false,
    canCreate: false
  });

  //* control loading data
  const [loadingData, setLoadingData] = useState(false);
  let stopLoading = useRef(false);
  const setStopLoading = (value) => (stopLoading.current = value);

  //* handle lazy load customer
  const [limit, setLimit] = useState(20);
  const loadMore = async (limit) => {
    if (stopLoading.current) return; //* stop loading again when all data has been loaded

    let customersList = document.querySelector('#customersList');
    let customerItem = document.querySelector('#customersList li');
    let numberCustomerItems = customersList
      ? customersList.childElementCount
      : 0;

    setLoadingData(true);
    const action = await getCustomersDispatch(
      limit,
      numberCustomerItems,
      searchValues
    );
    setLoadingData(false);
    if (action.payload) {
      if (action.payload.customers.length > 0) {
        if (customersList && customerItem && numberCustomerItems >= 0)
          if (
            customersList.clientHeight >=
            customerItem.clientHeight *
              (numberCustomerItems + action.payload.customers.length)
          )
            loadMore(limit);
      } else setStopLoading(true);
    }
  };

  let loadMoreTimeout = useRef('');
  window.onresize = function onresize() {
    let customersList = document.querySelector('#customersList');
    let customerItem = document.querySelector('#customersList li');
    let numberCustomerItems = customersList
      ? customersList.childElementCount
      : 0;

    if (customersList && customerItem && numberCustomerItems >= 0)
      if (
        customersList.clientHeight >=
        customerItem.clientHeight * numberCustomerItems
      ) {
        clearTimeout(loadMoreTimeout.current);
        loadMoreTimeout.current = setTimeout(() => {
          loadMore(limit);
        }, 750);
      }
  };

  function handleScroll() {
    let customersList = document.querySelector('#customersList');
    if (customersList)
      if (
        Math.ceil(customersList.scrollTop) + customersList.clientHeight >=
        customersList.scrollHeight
      ) {
        clearTimeout(loadMoreTimeout.current);
        loadMoreTimeout.current = setTimeout(() => {
          loadMore(limit);
        }, 0);
      }
  }

  //*handle change page
  const history = useHistory();
  const handleChangePage = (customerPhone) => {
    history.push(`/advanced/opt-history?customerPhone=${customerPhone}`);
  };

  //* show notification
  const showSnackbar = (message, status) => enqueueSnackbar(message, { variant: status });

  //* Backdrop
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleToggleBackdrop = (backdrop) => {
    if (backdrop === apiStatus.PENDING && !loadingData) setOpenBackdrop(true);
    else setOpenBackdrop(false); 
  };

  //* -------------- START HANDLE ACTION --------------
  //*Handle Author
  const getAuthor = async () => {
    setAuthorPermission({
      ...authorPermission,
      canRead: await authorizer.current.can('read', '/customers'),
      canUpdate: await authorizer.current.can('update', '/customers'),
      canDelete: await authorizer.current.can('delete', '/customers'),
      canCreate: await authorizer.current.can('create', '/customers')
    });
  };

  //* handle get list customer
  const getCustomersDispatch = async (
    limitItem,
    currentItem,
    searchValue = ''
  ) => dispatch(getCustomers({ limitItem, currentItem, searchValue: searchValue.trim() }));

  //* handle create customer
  const createCustomerDispatch = (newCustomer) => dispatch(createCustomer({ newCustomer }));

  //* handle update customer
  const updateCustomerDispatch = (customerId, newCustomer) => dispatch(updateCustomer({ customerId, newCustomer }));

  //* handle delete customer
  const deleteCustomerDispatch = (customerId) => dispatch(deleteCustomer({ customerId }));

  //* handle create customer
  const [openCreate, setOpenCreate] = useState(false);
  const handleOpenCreateCustomer = () => setOpenCreate(true);
  const handleCloseCreateCustomer = () => setOpenCreate(false);
  const handleSubmitCreateCustomer = (newCustomer) => createCustomerDispatch(newCustomer);

  //* Update Form
  const [customerUpdate, setCustomerUpdate] = useState({});
  const [newCompanyCustomers, setNewCompanyCustomers] = useState([]);
  const [newCampaignCustomers, setNewCampaignCustomers] = useState([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const handleOpenUpdateCustomer = (customerId) => {
    const indexOfUpdateCustomer = customers.map(item => item.id).indexOf(customerId);
    if (indexOfUpdateCustomer !== -1) {
      setCustomerUpdate(customers[indexOfUpdateCustomer]);
      setNewCompanyCustomers(customers[indexOfUpdateCustomer].companyCustomers.map((item) => {
        return {
          companyId: item.company.id,
          status: item.status
        };
      }));
      setNewCampaignCustomers(customers[indexOfUpdateCustomer].campaignCustomers.map((item) => {
        return {
          value: item.campaign.id,
          status: item.status
        };
      }));
      setOpenUpdate(true);
    } else {
      //TODO show notification
    }
  };
  const handleCloseUpdateCustomer = () => setOpenUpdate(false);
  const handleSubmitUpdateCustomer = (customerId, newCustomer) => updateCustomerDispatch(customerId, newCustomer);

  //* Dialog Delete
  const [dialogDeleteValue, setDialogDeleteValue] = useState({
    open: false,
    id: '',
    title: '',
    message: ''
  });
  const handleOpenDialogDelete = (customerId, customerName) =>
    setDialogDeleteValue({
      open: true,
      id: customerId,
      title: `Do you really want to delete client ${customerName}?`,
      message: 'Delete client will set client disable, you can\'t find it in this feature'
    });
  const handleCloseDialogDelete = () => setDialogDeleteValue({ ...dialogDeleteValue, open: false });
  const handleSubmitDialogDelete = () => {
    deleteCustomerDispatch(dialogDeleteValue.id);
    setDialogDeleteValue({ ...dialogDeleteValue, open: false });
  };
  //* --------------  END HANDLE ACTION  --------------

  //* ---------------  START USEEFFECT  ---------------
  useEffect(() => {
    handleToggleBackdrop(backdrop);
    // eslint-disable-next-line
  }, [backdrop]);

  useEffect(() => {
    if(authorPermission.canRead){
      getCustomersDispatch(limit, 0, searchValues);
    }
  }, [limit, searchValues]);

  useEffect(() => {
    if (status === apiStatus.SUCCESS && message === 'Create client success') {
      showSnackbar(message, status);
      handleCloseCreateCustomer();
    }
    if (status === apiStatus.SUCCESS && message === 'Update client success') {
      showSnackbar(message, status);
      handleCloseUpdateCustomer();
    }
    if (status === apiStatus.SUCCESS && message === 'Delete client success') {
      showSnackbar(message, status);
    }

    if (status === apiStatus.ERROR) showSnackbar(error, status);
    // eslint-disable-next-line
  }, [status, error]);
  const handleChooseFile = (dataFile) => {
    dispatch(readFile({ file: dataFile }));
  };

  useEffect(() => {
    if(authorPermission.canRead){
      getCustomersDispatch(limit, customers.length, searchValues);
      dispatch(getCompanies());
    }
    // return () => {
    //   window.onresize = null; //* clear onresize function
    //   // dispatch(clearStateCustomer()); //* clear state when unmount
    // };
    // eslint-disable-next-line
  }, [authorPermission]);

  useEffect(() => {
    getAuthor();
    async function handleGetCampaigns() {
      try {
        const result = await dispatch(getCampaigns());
        const data = unwrapResult(result);
        setCampaigns(data.map((cpn) => ({ label: cpn.name, value: cpn.id })));
      } catch (error) {
        showSnackbar('Can not load campaigns', 'error');
      }
    }
    handleGetCampaigns();
    return () => {
      window.onresize = null; //* clear onresize function
      dispatch(clearStateCustomer()); //* clear state when unmount
    };
  }, []);
  //* ----------------  END USEEFFECT  ----------------

  //* render UI
  return (
    <Page className={classes.root} title="Clients">
      {/* <Header
        className={classes.title}
        // parentTitleName="MANAGEMENT"
        titleName="Clients"
      /> */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Header childTitle="Clients" urlChild="/clients" />
      </div>
      <Divider className={classes.divider} />
      <div style={{ display: 'flex', margin: '10px 0px' }}>
        <ButtonCreate
          className={classes.buttonCreate}
          disabled={!authorPermission.canCreate}
          onClick={handleOpenCreateCustomer}
          size="small" // 'large' | 'medium' | 'small'
        />
        <ButtonUpload
          accept=".xlsx, .xls, .csv"
          className={classes.buttonCreate}
          disabled={!authorPermission.canCreate}
          handleChooseFile={handleChooseFile}
          size="small"
        />
        <Control
          current={customers.length}
          limit={limit}
          placeholder="Search clients ..."
          setLimit={setLimit}
          setStopLoading={setStopLoading}
          total={totalCustomers}
        />
      </div>
      <Paper
        className={classes.customersTable}
        elevation={1}
        variant="outlined"
      >
        <TableHead columns={columns} className={classes.tableHead} />
        <ul className={classes.list} id="customersList" onScroll={handleScroll}>
          {customers.map((customer, index) => (
            <CustomerItem
              customer={customer}
              handleChangePage={handleChangePage}
              key={index}
              no={index + 1}
              canUpdate={authorPermission.canUpdate}
              canDelete={authorPermission.canDelete}
              handleOpenUpdateCustomer={handleOpenUpdateCustomer}
              handleOpenDialogDelete={handleOpenDialogDelete}
            />
          ))}
        </ul>
        {loadingData && (
          <li className={classes.loadingItem}>
            <div
              style={{
                textAlign: 'center',
                width: '100%',
                height: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <img src={Loading} style={{ width: 50, height: 50 }} />
            </div>
          </li>
        )}
      </Paper>

      <CreateCustomer
        companies={companies}
        campaigns={campaigns}
        handleCloseCreateCustomer={handleCloseCreateCustomer}
        handleSubmitCreateCustomer={handleSubmitCreateCustomer}
        openCreate={openCreate}
      />

      { customerUpdate.id &&
        <UpdateCustomer
          customer={customerUpdate}
          newCompanyCustomers={newCompanyCustomers}
          companies={companies}
          campaigns={campaigns}
          newCampaignCustomers={newCampaignCustomers}
          handleCloseUpdateCustomer={handleCloseUpdateCustomer}
          handleSubmitUpdateCustomer={handleSubmitUpdateCustomer}
          openUpdate={openUpdate}
        />
      }

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
      <ListCustomerAddDialog
        // open={openDialog}
        message={message}
        listCustomerToCheck={listCustomerToCheck}
        listError={listError}
      />
    </Page>
  );
};

export default Customer;
