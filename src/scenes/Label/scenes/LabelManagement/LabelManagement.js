/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Backdrop, CircularProgress, Divider, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { DialogDelete, Header, Page, TableHead } from 'components';
import ButtonCreate from 'components/ButtonCreate';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { LabelItem } from './components';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { getLabels, deleteLabel } from 'scenes/Label/Label.asyncAction';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { getCompanies } from 'scenes/Company/Company.asyncAction';
import AuthGuard from 'components/AuthGuard';
import { PermissionContext } from 'contexts/PermissionProvider';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
    margin: '0 auto',
    height: '100%',
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      width: '100%'
    }
  },
  divider: {
    backgroundColor: theme.palette.primary.main,
    border: 'none',
    height: '2px',
    margin: '10px 0px'
  },
  container: {
    marginTop: theme.spacing(3)
  },
  btnAdd: {
    marginTop: theme.spacing(2)
  },
  buttonCreate: {
    backgroundColor: theme.palette.primary.main
  },
  selectLabel: {
    '& .select__control': {
      height: '40px',
      border: 'unset',
      boxShadow: '0 0 0 1px rgb(63 63 68 / 5%), 0 1px 3px 0 rgb(63 63 68 / 15%)'
    }
  },
  tableHead: {
    padding: `0px ${theme.spacing(2)}px`
  },
  labelTable: {
    position: 'relative',
    flex: 1,
    height: '0'
  },
  listLabels: {
    padding: theme.spacing(1)
  },
  backdrop: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'rgba(122,123,124,0)'
  }
}));

const columns = [
  {
    name: 'Name',
    flex: 3
  },
  {
    name: 'Description',
    flex: 5
  },
  {
    name: 'Companies',
    flex: 7
  },
  {
    name: 'Action',
    flex: 5,
    textAlign: 'center'
  }
];

function LabelManagement() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const [listLabels, setListLabels] = useState([]);
  const [listFilteredLabels, setListFilteredLabels] = useState([]);
  const [dialogDeleteValue, setDialogDeleteValue] = useState({
    open: false,
    id: '',
    title: '',
    message: ''
  });
  const [companyOptions, setCompanyOptions] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [filters, setFilters] = useState([]);

  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  const handleCloseDialogDelete = () => {
    setDialogDeleteValue({ ...dialogDeleteValue, open: false });
    setOpenBackdrop(false);
  };
  const handleOpenDialogDelete = async (label) => {
    setOpenBackdrop(true);
    setDialogDeleteValue({
      open: true,
      title: `Do you really want to delete label ${label.title}?`,
      message:
        'Delete label will set label disable, you can\'t find it in this feature',
      id: label.id
    });
  };
  const handleSubmitDialogDelete = async () => {
    try {
      const result = await dispatch(deleteLabel(dialogDeleteValue.id));
      unwrapResult(result);
      const index = listLabels.findIndex(
        (item) => item.id === dialogDeleteValue.id
      );
      listLabels.splice(index, 1);
      setListLabels([...listLabels]);
      setOpenBackdrop(false);
      setDialogDeleteValue({
        open: false,
        id: '',
        title: '',
        message: ''
      });
      showSnackbar('Delete label success', 'success');
    } catch (error) {
      showSnackbar('Delete label failed', 'error');
    }
  };

  const handleEdit = (id) => {
    history.push(`/labels/update/${id}`);
  };

  const handleSelectChange = (criteria) => {
    setFilters(criteria);
    if (criteria.length > 0) {
      const newList = listLabels.filter((label) => {
        return criteria.every((criterion) => {
          return !!label.companiesOfLabel.find(
            (companyOfLabel) => companyOfLabel.company.id === criterion.value
          );
        });
      });
      setListFilteredLabels([...newList]);
    }
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
      canRead: await authorizer.current.can('read', '/labels'),
      canUpdate: await authorizer.current.can('update', '/labels'),
      canDelete: await authorizer.current.can('delete', '/labels'),
      canCreate: await authorizer.current.can('create', '/labels')
    });
  };


  useEffect(() => {
    getAuthor();
    async function handleGetLabels() {
      try {
        const result = await dispatch(getLabels());
        const data = unwrapResult(result);
        setListLabels(data);
      } catch (error) {
        showSnackbar('Get labels failed', 'error');
      }
    }
    handleGetLabels();
  }, []);

  useEffect(() => {
    async function handleGetCompanies() {
      try {
        const result = await dispatch(getCompanies());
        const data = unwrapResult(result);
        setCompanyOptions(
          data.map((cpn) => ({ label: cpn.name, value: cpn.id }))
        );
      } catch (error) {
        showSnackbar('Can not load companies', 'error');
      }
    }
    handleGetCompanies();
  }, []);
  
  return (
    <AuthGuard
      requestPermissions={[{ action: 'read', result: '/labels' }, { action: 'read', result: '/manages' }]}
    >
      <Page className={classes.root} title="Labels">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Header childTitle="Companies And Users" isParent />
          <NavigateNextIcon />
          <Header childTitle="Labels" urlChild="/labels" />
        </div>
        <Divider className={classes.divider} />

        <div
          style={{
            display: 'flex',
            margin: '10px 0px',
            justifyContent: 'space-between'
          }}
        >
          <ButtonCreate
            className={classes.buttonCreate}
            disabled={!authorPermission.canCreate}
            onClick={() => history.push('/labels/create')}
            size="small" // 'large' | 'medium' | 'small'
          />
          <div
            style={{
              width: 500
            }}
            className={classes.selectLabel}
          >
            <Select
              options={companyOptions}
              isMulti
              name="colors"
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={handleSelectChange}
              value={filters}
              closeMenuOnSelect={false}
            />
          </div>
        </div>
        <Paper className={classes.labelTable} elevation={1} variant="outlined">
          <TableHead columns={columns} className={classes.tableHead} />
          <ul className={classes.listLabels}>
            {filters.length > 0
              ? listFilteredLabels.map((item, index) => (
                <LabelItem
                  data={item}
                  key={index}
                  onEdit={() => handleEdit(item.id)}
                  onDelete={() => handleOpenDialogDelete(item)}
                />
              ))
              : listLabels.map((item, index) => (
                <LabelItem
                  data={item}
                  key={index}
                  onEdit={() => handleEdit(item.id)}
                  onDelete={() => handleOpenDialogDelete(item)}
                  authorPermission={authorPermission}
                />
              ))}
          </ul>
        </Paper>
      
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
      </Page>
    </AuthGuard>
  );
}

export default LabelManagement;
