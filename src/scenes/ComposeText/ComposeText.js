/* eslint-disable no-unused-vars */
import {
  Backdrop,
  Divider,
  InputAdornment,
  Paper,
  Switch,
  TextField
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  DialogConfirm,
  DialogWarning,
  GroupInput,
  Header,
  Page,
  SelectInput
} from 'components';
import { CompanyContext } from 'contexts/CompanyProvider';
import { PermissionContext } from 'contexts/PermissionProvider';
import { useSnackbar } from 'notistack';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCompanies } from 'scenes/Company/Company.asyncAction';
import apiStatus from 'utils/apiStatus';
import ChatBox from './components/ChatBox';
import PhoneNumberList from './components/PhoneNumberList/PhoneNumberList';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
  getCustomersComposeText,
  getSignaturesActive,
  sendComposeText,
  validateCustomerCampaign
} from './ComposeText.asyncAction';
import { clearState } from './ComposeText.slice';
import { formatPhoneNumber } from 'utils/formatPhoneNumber';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '1024px',
    height: '100%',
    margin: '0 auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      width: '100%'
    }
  },
  wrapperChatBox: {
    // margin: theme.spacing(0,2)
  },
  wrapperListPhoneNumbers: {
    width: '300px'
  },
  paper: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  divider: {
    backgroundColor: '#3f51b5',
    border: 'none',
    height: '2px',
    margin: '10px 0px'
  },
  selectCompany: {
    width: 200
  },
  wrapperFromAndTo: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: theme.spacing(1, 2)
  },
  wrapperComposeText: {
    padding: '8px 16px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff'
  },
  wrapperFromOrTo: {
    display: 'flex',
    flexDirection: 'column',
    // margin: '0px 20px',
    width: '300px',
    margin: '0px 25px'
  }
}));

function ComposeText(props) {
  const [listCustomers, setListCustomers] = useState([]);
  const [selectedPhones, setSelectedPhones] = useState([]);
  const [phone, setPhone] = useState('');
  const { companies } = useContext(CompanyContext);
  const { status, message, listSignature, isSending } = useSelector(
    (state) => state.composeText
  );
  const { user } = useSelector((state) => state.session);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedSignature, setSelectedSignature] = useState('');
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilter] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const debounce = useRef();
  const [manageError, setError] = useState({
    phoneError: null,
    companyError: null
  });
  const [checkedValue, setCheckedValue] = useState(false);

  const handleCheckbox = () => {
    if (checkedValue) {
      setCheckedValue(false);
    } else {
      setCheckedValue(true);
    }
  };

  const { enqueueSnackbar } = useSnackbar();
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  const handleAddPhoneNumber = (index) => {
    if (selectedPhones.length < 5)
      setSelectedPhones([...selectedPhones, listCustomers[index].phoneNumber]);
  };
  const handleRemovePhoneNumber = (index) => {
    selectedPhones.splice(index, 1);
    setSelectedPhones([...selectedPhones]);
  };
  const handleSearchChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^+0-9]/g, '');
    let regexpPlus = /^\+\d{0,11}$/gi;
    let regexp = /^\d{0,10}$/gi;
    let isMatch = false;
    if (value && value[0].indexOf('+') > -1) {
      isMatch = regexpPlus.test(value);
    } else {
      isMatch = regexp.test(value);
    }
    if (isMatch) {
      setHasNextPage(true);

      setSearchInput(value);
      if (debounce.current) {
        clearTimeout(debounce.current);
      }
      debounce.current = setTimeout(() => {
        setPage(1);
        setListCustomers([]);
        setFilter({ ...filters, _search: value });
      }, 1000);
    }
  };

  const handleSubmitPhone = (e) => {
    let regexp = /^\+\d{11}$/gi;
    let value = e.target.value;
    if (value[0] !== '+') value = '+1' + value;

    if (e.key == 'Enter') {
      if (regexp.test(value)) {
        setError({ ...manageError, phoneError: null });
        if (selectedPhones.length < 5) {
          setSelectedPhones([...selectedPhones, value]);
        }
        setPhone('');
      } else setError({ ...manageError, phoneError: 'Phone number invalid' });
    }
  };

  const handleChangePhone = (e) => {
    let value = e.target.value;
    value = value.replace(/[^+0-9]/g, '');
    let regexpPlus = /^\+\d{0,11}$/gi;
    let regexp = /^\d{0,10}$/gi;
    let isMatch = false;
    if (value && value[0].indexOf('+') > -1) {
      isMatch = regexpPlus.test(value);
    } else {
      isMatch = regexp.test(value);
    }
    if (isMatch) {
      setPhone(value);
    }
  };
  const handleChangeCompany = (e) => {
    setSelectedCompany(e.target.value);
    setError({ ...manageError, companyError: null });
    setPage(1);
    setListCustomers([]);
    setFilter({ ...filters, _company: e.target.value });
    setHasNextPage(true);
  };
  const handleChangeSignature = (e) => {
    setSelectedSignature(e.target.value);
  };

  let fetchMoreCustomers = async () => {
    //* check hasNextPage
    if (!hasNextPage) return;
    const dataResult = await dispatch(
      getCustomersComposeText({ _page: page, ...filters })
    );
    const { data, pagination: newPagination } = unwrapResult(dataResult);
    if (data && data.length > 0) {
      setPage(page + 1);
      setListCustomers([...listCustomers, ...data]);
      if (newPagination.page == newPagination.totalPage) setHasNextPage(false);
    }
  };

  //* Handle confirm message campaign
  const [phoneOptOut, setPhoneOptOut] = useState([]);
  const [dataConfirm, setDataConfirm] = useState();
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const handleCancelDialog = () => setDialogConfirm(false);
  const handleConfirmDialog = () => {
    setDialogConfirm(false);
    let signatureString = '';
    let userName = '';
    if (checkedValue) {
      userName = `${user.firstName} ${user.lastName}`;
    }
    listSignature.forEach((item) => {
      if (item.id && item.id === selectedSignature) {
        signatureString = item.value;
      }
    });
    if (
      dataConfirm.message.length + signatureString.length + userName.length >
      990
    ) {
      showSnackbar('Text must be less than 990 characters', 'error');
      return;
    }
    dispatch(sendComposeText(dataConfirm));
  };

  const handleSendMessage = async (data) => {
    if (
      selectedPhones.length === 0 ||
      !selectedCompany ||
      selectedPhones.length > 5
    ) {
      if (!selectedCompany)
        setError({ ...manageError, companyError: 'Company is required' });
      if (selectedPhones.length === 0)
        showSnackbar('Must have at least one phone number selected', 'error');
      if (selectedPhones.length > 5)
        showSnackbar('Up to 5 phone number', 'error');
      return;
    }

    const dataResult = await dispatch(validateCustomerCampaign(selectedPhones));
    const customerCampaign = unwrapResult(dataResult);
    if (customerCampaign.length > 0) {
      data['customerPhones'] = selectedPhones;
      data['companyId'] = selectedCompany;
      data['signatureId'] = selectedSignature;
      data['personalSignature'] = checkedValue;
      let phoneOut = [];
      const listPhoneOut = [];
      customerCampaign.forEach((item, index) => {
        if (!listPhoneOut.includes(item.customer.phoneNumber)) {
          listPhoneOut.push(item.customer.phoneNumber);
        }
      });
      setPhoneOptOut(listPhoneOut);
      setDataConfirm(data);
      setDialogConfirm(true);
    } else {
      data['customerPhones'] = selectedPhones;
      data['companyId'] = selectedCompany;
      data['signatureId'] = selectedSignature;
      data['personalSignature'] = checkedValue;
      let signatureString = '';
      let userName = '';
      if (checkedValue) {
        userName = `${user.firstName} ${user.lastName}`;
      }
      listSignature.forEach((item) => {
        if (item.id && item.id === selectedSignature) {
          signatureString = item.value;
        }
      });
      if (
        data.message.length + signatureString.length + userName.length >
        990
      ) {
        showSnackbar('Text must be less than 990 characters', 'error');
        return;
      }
      dispatch(sendComposeText(data));
    }
  };
  //*Author
  const { authorizer } = useContext(PermissionContext);
  const [authorPermission, setAuthorPermission] = useState({
    canRead: false,
    canUpdate: false,
    canDelete: false,
    canCreate: false,
    canSendMessage: false
  });
  const getAuthor = async () => {
    setAuthorPermission({
      ...authorPermission,
      canRead: await authorizer.current.can('read', '/composetexts'),
      canUpdate: await authorizer.current.can('update', '/composetexts'),
      canDelete: await authorizer.current.can('delete', '/composetexts'),
      canCreate: await authorizer.current.can('create', '/composetexts'),
      canSendMessage: await authorizer.current.can('create', '/chat')
    });
  };
  useEffect(() => {
    const getData = async () => {
      await getAuthor();
      dispatch(getSignaturesActive());
    };
    getData();
    return () => {
      dispatch(clearState());
    };
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (authorPermission.canRead) {
      dispatch(getCompanies());
      fetchMoreCustomers();
    }
  }, [authorPermission]);

  useEffect(() => {
    if (filters) {
      fetchMoreCustomers();
    }
  }, [filters]);

  useEffect(() => {
    if (status == apiStatus.SUCCESS && message) {
      showSnackbar(message, 'success');
    } else if (status == apiStatus.ERROR && message) {
      showSnackbar(message, 'error');
    }
  }, [status]);

  return (
    <Page title="Compose" className={classes.root}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Header childTitle="Message" isParent />
        <NavigateNextIcon />
        <Header childTitle="Compose" urlChild="/compose" />
      </div>

      <Divider className={classes.divider} />
      <Backdrop style={{ zIndex: 1 }} open={isSending} />
      {/*To  */}
      <Paper
        className={classes.wrapperComposeText}
        elevation={1}
        variant="outlined"
      >
        <div className={classes.wrapperFromAndTo}>
          <div className={classes.selectCompany}>
            <SelectInput
              label="Company"
              options={companies.map((item) => ({
                value: item.id,
                label: item.name
              }))}
              name="company"
              value={selectedCompany}
              onChange={handleChangeCompany}
              helperText={manageError.companyError}
              error={!!manageError.companyError}
            />
            <SelectInput
              label="Signature"
              options={listSignature.map((item) => ({
                value: item.id,
                label: item.name
              }))}
              name="signature"
              value={selectedSignature}
              onChange={handleChangeSignature}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={checkedValue}
                  onChange={handleCheckbox}
                  color="primary"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              style={{ float: 'left', marginLeft: 5 }}
              label="Pesonal Signature"
              labelPlacement="start"
            />
          </div>

          <div className={classes.wrapperFromOrTo}>
            <TextField
              label="To"
              variant="outlined"
              margin="dense"
              placeholder="Enter phone number"
              onKeyDown={handleSubmitPhone}
              onChange={handleChangePhone}
              helperText={manageError.phoneError}
              error={!!manageError.phoneError}
              InputLabelProps={{ shrink: true }}
              value={phone}
            />
            <GroupInput className={classes.wrapperListPhoneNumbers}>
              <PhoneNumberList
                listData={selectedPhones}
                isSelected
                onRemove={handleRemovePhoneNumber}
              />
            </GroupInput>
          </div>
          {/*Customer  */}
          <div className={classes.wrapperFromOrTo}>
            <TextField
              label="Client"
              variant="outlined"
              margin="dense"
              value={searchInput}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              onChange={handleSearchChange}
            />
            <GroupInput className={classes.wrapperListPhoneNumbers}>
              <PhoneNumberList
                id="list-customers"
                onFetch={() => {
                  //* prevent call api when scroll to bottom then change filters and reset page to 1
                  page > 1 && fetchMoreCustomers();
                }}
                listData={listCustomers}
                onAdd={handleAddPhoneNumber}
              />
            </GroupInput>
          </div>
        </div>
        <div className={classes.wrapperChatBox}>
          <ChatBox
            handleSendMessage={handleSendMessage}
            dataForward={props.location.state}
            authorPermission={authorPermission}
          />
        </div>
      </Paper>
      <DialogWarning
        onClose={handleCancelDialog}
        handleConfirm={handleConfirmDialog}
        listPhoneOut={phoneOptOut}
        open={dialogConfirm}
        title={'Do you want to continue?'}
      />
    </Page>
  );
}

export default ComposeText;
