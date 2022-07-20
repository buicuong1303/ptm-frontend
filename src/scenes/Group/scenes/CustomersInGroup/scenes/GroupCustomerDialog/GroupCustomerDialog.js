/* eslint-disable prettier/prettier */
/* eslint-disable react/no-multi-comp */
/* eslint-disable no-unused-vars */
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Dialog,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Typography
} from '@material-ui/core';
import {
  AddBox,
  ArrowDownward,
  Cancel,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  Delete,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  Save,
  SaveAlt,
  Search,
  ViewColumn
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { CustomButton } from 'components';
import MaterialTable from 'material-table';
import React, { forwardRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCustomersToGroup } from 'scenes/Group/Group.asyncAction';
import { clearStateDialog } from 'scenes/Group/Group.slice';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';
const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto'
  },
  button: {
    justifyContent: 'flex-end'
  },
  dialogContent: {
    flexWrap: 'wrap'
  },
  list: {
    height: '100%',
    maxHeight: '42px',
    overflow: 'auto',
    margin: '0px',
    '&::-webkit-scrollbar': {
      width: '5px',
      backgroundColor: theme.palette.primary.main
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 5px gray',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb:horizontal:hover': {
      backgroundColor: theme.palette.primary.main
    },
    '&::-webkit-scrollbar-thumb:horizontal': {
      backgroundColor: theme.palette.primary.main
    }
  },
  listItem: {
    borderBottom: '1px solid #ccc'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}));

const GroupCustomerDialog = (props) => {
  const { groupId, message, listCustomerToCheck, ...rest } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [active, setActive] = useState({
    open: false,
    change: []
  });
  const [formData, setFormData] = useState([]);
  const [commit, setCommit] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 5
  });
  const [dataFilter, setDataFilter] = useState([]);
  const [search, setSearch] = useState('');
  //TODO covert to string
  const handleChangeSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPagination({
      ...pagination,
      page: 0
    });
    const result = formData.filter((item) => {
      return Object.keys(item).some((key) => {
        if (Array.isArray(item[key])) {
          return item[key]
            .map((cpn) => cpn.companyName.toLowerCase())
            .some((companyName) => companyName.includes(value.toLowerCase()));
        } else {
          return item[key]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      });
    });
    setDataFilter(result);
  };
  const handleRemovePhonePhone = (phoneNumber) => {
    let phoneIndex = formData.findIndex(
      (item) => item.phoneNumber === phoneNumber
    );
    let phoneIndexFilter = dataFilter.findIndex(
      (item) => item.phoneNumber === phoneNumber
    );
    formData.splice(phoneIndex, 1);
    dataFilter.splice(phoneIndexFilter, 1);
    setFormData([...formData]);
    setDataFilter([...dataFilter]);
  };

  const handleCommit = () => {
    let canCommit = !formData.some((item) => item.status === 'duplicate');

    if (canCommit) {
      dispatch(
        addCustomersToGroup({
          data: formData,
          groupId: groupId
        })
      );
      setActive({
        ...active,
        open: false
      });
    }
  };
  const handleCloseEditRole = () => {
    dispatch(clearStateDialog());
    setActive({
      ...active,
      open: false
    });
  };
  useEffect(() => {
    if (message === 'File read success') {
      setActive({
        ...active,
        open: true
      });
    }
  }, [message]);

  useEffect(() => {
    if (listCustomerToCheck.length > 0) {
      const listData = [];
      listCustomerToCheck.forEach((item, index) => {
        if (item.company.length > 0) {
          const companies = [];
          item.company.forEach((element) => {
            companies.push({
              companyName: element.company.name
            });
          });
          listData.push({
            index: index,
            phoneNumber: item.phoneNumber,
            status: item.status,
            company: companies
          });
        } else {
          listData.push({
            index: index,
            phoneNumber: item.phoneNumber,
            status: item.status,
            company: []
          });
        }
      });
      setFormData(listData);
    }
  }, [listCustomerToCheck]);

  useEffect(() => {
    let canCommit = true;
    formData.forEach((item) => {
      if (item.status === 'duplicate') {
        canCommit = false;
      }
    });
    setCommit(canCommit);
  }, [formData]);

  let columns = [
    {
      title: '.No',
      field: 'index',
      cellStyle: { width: '10%' }
    },
    {
      title: 'Phone',
      field: 'phoneNumber',
      cellStyle: { width: '30%' }
    },
    {
      title: 'Status',
      field: 'status',
      cellStyle: { width: '20%' }
    },
    {
      title: 'Company',
      field: 'company',
      cellStyle: { width: '30%' }
    },
    {
      title: 'Action',
      field: 'action',
      cellStyle: { width: '10%' }
    }
  ];
  const handleChangePage = (event, newPage) => {
    setPagination({
      ...pagination,
      page: newPage
    });
  };
  const handleChangeRowsPerPage = (event) => {
    setPagination({
      page: 0,
      rowsPerPage: +event.target.value
    });
  };
  const renderTable = (rows) => {
    return rows
      .slice(
        pagination.page * pagination.rowsPerPage,
        pagination.page * pagination.rowsPerPage + pagination.rowsPerPage
      )
      .map((row, index) => {
        return (
          <TableRow hover tabIndex={-1} key={index}>
            {columns.map((column) => {
              const value = row[column.field];
              if (
                column.field !== 'action' &&
                column.field !== 'index' &&
                column.field !== 'company'
              ) {
                return (
                  <TableCell key={column.field} align={column.align}>
                    {value}
                  </TableCell>
                );
              } else {
                if (column.field === 'index')
                  return (
                    <TableCell key={column.field} align={column.align}>
                      {index + 1}
                    </TableCell>
                  );
                else if (column.field === 'company') {
                  return (
                    <TableCell key={column.field} align={column.align}>
                      <ul className={classes.list}>
                        {row && row.company.length > 0 ? (
                          <>
                            {row.company.map((item, index) => {
                              return (
                                <div key={index}>
                                  <li>
                                    {item.companyName}
                                  </li>
                                </div>
                              );
                            })}
                          </>
                        ) : (
                          ''
                        )}
                      </ul>
                    </TableCell>
                  );
                } else
                  return (
                    <TableCell key={column.field}>
                      <IconButton
                        className="view-content"
                        style={{ zIndex: 1 }}
                        onClick={() =>
                          handleRemovePhonePhone(row['phoneNumber'])
                        }
                      >
                        <Delete style={{ color: '#de2a0cfa' }} />
                      </IconButton>
                    </TableCell>
                  );
              }
            })}
          </TableRow>
        );
      });
  };
  return (
    <div>
      <Dialog
        {...rest}
        aria-labelledby="max-width-dialog-title"
        className={classes.root}
        open={active.open}
        fullWidth
        maxWidth="lg"
      >
        <Card>
          {/* <CardHeader title="Preview" />
          <Divider /> */}
          <Toolbar className={classes.toolbar}>
            <Typography
              className={classes.title}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              {'Upload customers'}
            </Typography>
            <Box>
              <TextField
                id="standard-start-adornment"
                value={search}
                onChange={handleChangeSearch}
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
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSearch('')}
                        />
                      )}
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          </Toolbar>
          <CardContent className={classes.dialogContent}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableCell key={column.field} style={column.cellStyle}>
                      {column.title}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {search === ''
                  ? renderTable(
                    formData.map((item) => {
                      return {
                        ...item,
                        index: item.index + 1,
                        company: item.company
                      };
                    })
                  )
                  : renderTable(
                    dataFilter.map((item) => {
                      return {
                        ...item,
                        index: item.index + 1,
                        company: item.company
                      };
                    })
                  )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 7]}
              component="div"
              count={search === '' ? formData.length : dataFilter.length}
              rowsPerPage={pagination.rowsPerPage}
              page={pagination.page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </CardContent>
        </Card>
        <CardActions className={classes.button}>
          <CustomButton
            onClick={handleCommit}
            disabled={!commit}
            color="primary"
            variant="contained"
            content="Save"
            theme="blue-full"
          >
            <Save className={classes.icon} />
          </CustomButton>
          <CustomButton
            onClick={handleCloseEditRole}
            variant="contained"
            content="Cancel"
            theme="gray-full"
          >
            <Cancel className={classes.icon} />
          </CustomButton>
        </CardActions>
      </Dialog>
    </div>
  );
};

GroupCustomerDialog.prototype = {};

export default GroupCustomerDialog;
