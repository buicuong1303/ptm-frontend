/* eslint-disable no-unused-vars */
import {
  Box,
  Dialog,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TableHead,
  Toolbar,
  Tooltip,
  Typography,
  Button,
  TextField,
  ClickAwayListener
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import * as momentTz from 'moment-timezone';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import { formatPhoneNumber } from 'utils/formatPhoneNumber';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import logAction from 'utils/logAction';
import { DataDetails } from './components';
import { CustomButton } from 'components';
import { Visibility } from '@material-ui/icons';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateRangePicker from '@mui/lab/DateRangePicker';
import htmlParser from 'html-react-parser';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
    width: '100%',
    height: '653px',
    display: 'flex',
    flexDirection: 'column',
    '& .MuiPaper-root.MuiDialog-paper.MuiDialog-paperScrollPaper.MuiDialog-paperWidthXl.MuiDialog-paperFullWidth.MuiPaper-elevation24.MuiPaper-rounded':
      {
        maxHeight: '100vh'
      }
  },
  wrapperContent: {
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    textTransform: 'capitalize',
    fontWeight: 'bold'
  },
  content: {
    lineHeight: '15px',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    wordBreak: 'break-all',
    overflow: 'hidden'
  },
  noRecord: {
    height: 200,
    textAlign: 'center'
  },
  backdrop: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  circularContain: {
    width: '100%',
    height: 350,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tableEmpty: {
    textAlign: 'center',
    width: '100%',
    marginTop: '20px',
    marginBottom: '20px',
    color: theme.palette.text.secondary
  },
  tablePagination: {
    minHeight: '52px',
    flex: 1,
    display: 'flex',
    flexDirection: 'revert',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    '& .MuiToolbar-root.MuiToolbar-regular.MuiTablePagination-toolbar.MuiToolbar-gutters':
      {
        flex: 1,
        background: '#f7f9fc'
      }
  }
}));

let columnsMonitor = [
  {
    title: 'IP',
    field: 'ip',
    cellStyle: { flex: 2, width: '12%', minWidth: '200px' }
  },
  {
    title: 'Date Time',
    field: 'creationTime',
    cellStyle: { flex: 3, width: '12%', minWidth: '200px' }
  },
  // {
  //   title: 'User (username)',
  //   field: 'user',
  //   cellStyle: { flex: 3, width: '12%', minWidth: '200px' }
  // },
  {
    title: 'Log Action',
    field: 'logAction',
    cellStyle: { flex: 3, width: '12%', minWidth: '200px' }
  },
  {
    title: 'Message',
    field: 'message',
    cellStyle: { flex: 6, width: '32%', minWidth: '300px' }
  },
  {
    title: 'Data',
    field: 'data',
    cellStyle: { flex: 2, width: '10%', minWidth: '100px' }
  }
];

const ConversationActivitiesDialog = (props) => {
  const {
    open,
    activitiesLog,
    title,
    setOpenActivitiesLog,
    getActivitiesLog,
    conversation,
    ...rest
  } = props;

  const classes = useStyles();
  const status = useSelector((state) => state.message.status);
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [dataActivitiesLog, setDataActivitiesLog] = useState({ records: [] });

  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [dateRange, setDateRange] = useState([
    momentTz(new Date()).tz('America/Los_Angeles'),
    momentTz(new Date()).tz('America/Los_Angeles')
  ]);

  const [dataDetails, setDataDetails] = useState({});
  const [openDataDetails, setOpenDataDetails] = useState(false);
  const handleOpenDataDetails = () => setOpenDataDetails(true);
  const handleCloseDataDetails = () => setOpenDataDetails(false);
  const showDataDetails = (data) => {
    setDataDetails(data);
    handleOpenDataDetails();
  };

  const renderTableRecords = (rows) => {
    const offSetRows = _.cloneDeep(rows).splice(
      pagination.page * pagination.rowsPerPage,
      pagination.rowsPerPage
    );

    return offSetRows.map((row, index) => {
      return (
        <TableRow key={row.id || index}>
          {columnsMonitor.map((column) => {
            let value = row[column.field];

            if (column.field === 'user')
              value = `${JSON.parse(row[column.field])?.firstName}
                ${JSON.parse(row[column.field])?.lastName}
                (${JSON.parse(row[column.field])?.username})`;

            if (column.field === 'logAction') value = logAction[value];

            if (column.field === 'creationTime')
              value = momentTz(value).format('MM-DD-YYYY hh:mm:ss A');

            if (column.field === 'data')
              value = {
                oldData: JSON.parse(row['oldData']),
                newData: JSON.parse(row['newData'])
              };

            return (
              <TableCell
                key={column.field}
                align={column.align}
                size={'small'}
                style={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  ...column.cellStyle
                }}
              >
                {column.field === 'data' ? (
                  <CustomButton
                    onClick={() => showDataDetails(value)}
                    style={{
                      minWidth: '40px',
                      padding: '0px',
                      marginLeft: '0px'
                    }}
                    theme="blue"
                  >
                    <Visibility />
                  </CustomButton>
                ) : column.field === 'path' || column.field === 'message' ? (
                  <Tooltip
                    title={htmlParser(value, {
                      replace: (domNode) => {
                        if (
                          domNode.attribs &&
                          domNode.attribs.class === 'message_content'
                        )
                          domNode.attribs.class = '';

                        if (
                          domNode.attribs &&
                          domNode.attribs.class === 'message_company'
                        )
                          return <></>;
                      }
                    })}
                    arrow
                    placement="top"
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {htmlParser(value, {
                        replace: (domNode) => {
                          if (
                            domNode.attribs &&
                            domNode.attribs.class === 'message_company'
                          )
                            return <></>;
                        }
                      })}
                    </div>
                  </Tooltip>
                ) : (
                  <p style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {value}
                  </p>
                )}
              </TableCell>
            );
          })}
        </TableRow>
      );
    });
  };

  const handleChangePage = (event, newPage) => {
    setPagination({
      ...pagination,
      page: newPage
    });
  };

  const handleChangeRowsPerPage = (event) =>
    setPagination({
      page: 0,
      rowsPerPage: +event.target.value
    });

  const handleCloseDialog = () => {
    setDataActivitiesLog({ records: [] });
    setPagination({
      page: 0,
      rowsPerPage: 5
    });
    setOpenDialog(false);
    setOpenActivitiesLog(false);
  };

  const handleLoadData = (e) => {
    const data = {
      conversationId: conversation?.id,
      participantId: conversation?.participantId,
      from: dateRange[0],
      to: dateRange[1]
    };
    handleChangePage(e, 0);
    setIsDateRangeOpen(false);
    getActivitiesLog(data);
  };

  useEffect(() => {
    setOpenDialog(open);
  }, [open]);

  useEffect(() => {
    setDataActivitiesLog({ records: activitiesLog.records });
  }, [activitiesLog]);

  return (
    <div>
      {status === 'success' ? (
        dataActivitiesLog && (
          <Dialog
            {...rest}
            aria-labelledby="max-width-dialog-title"
            className={classes.root}
            open={openDialog}
            fullWidth
            maxWidth="xl"
            style={{ maxHeight: '100vh' }}
          >
            <Paper className={classes.root}>
              <Toolbar className={classes.toolbar}>
                <Typography
                  className={classes.title}
                  variant="h6"
                  id="tableTitle"
                  component="div"
                >
                  {title +
                    ` - ${
                      conversation.customer.phone
                        ? formatPhoneNumber(conversation.customer.phone)
                        : 'Ext'
                    }`}
                </Typography>
                <Box style={{ display: 'flex' }}>
                  <ClickAwayListener
                    onClickAway={() => {
                      if (isDateRangeOpen) setIsDateRangeOpen(false);
                    }}
                  >
                    <div>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateRangePicker
                          startText="From"
                          endText="To"
                          value={dateRange}
                          onChange={(newValue) => {
                            setDateRange(newValue);
                          }}
                          open={isDateRangeOpen}
                          selectsRange
                          isClearable
                          renderInput={(startProps, endProps) => (
                            <React.Fragment>
                              <TextField
                                {...startProps}
                                variant="outlined"
                                size="small"
                                style={{ marginRight: '8px' }}
                                onClick={() => setIsDateRangeOpen(true)}
                              />
                              <TextField
                                {...endProps}
                                variant="outlined"
                                size="small"
                                style={{ marginRight: '8px' }}
                                onClick={() => setIsDateRangeOpen(true)}
                              />
                            </React.Fragment>
                          )}
                        />
                      </LocalizationProvider>
                    </div>
                  </ClickAwayListener>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginRight: 50 }}
                    onClick={(e) => {
                      if (
                        !(
                          !dateRange[0] ||
                          dateRange[0]?.toString() === 'Invalid Date' ||
                          !dateRange[1] ||
                          dateRange[1]?.toString() === 'Invalid Date'
                        )
                      )
                        handleLoadData(e);
                    }}
                    disabled={
                      !dateRange[0] ||
                      dateRange[0]?.toString() === 'Invalid Date' ||
                      !dateRange[1] ||
                      dateRange[1]?.toString() === 'Invalid Date'
                    }
                    size="small"
                  >
                    Load
                  </Button>
                  <Tooltip title="">
                    <IconButton
                      color="inherit"
                      id="export"
                      aria-controls="export-menu"
                      aria-haspopup="true"
                      onClick={handleCloseDialog}
                      style={{
                        padding: '7px'
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Toolbar>

              <TableContainer className={classes.container}>
                {dataActivitiesLog?.records?.length > 0 ? (
                  <Table
                    stickyHeader
                    aria-label="sticky table"
                    style={{ tableLayout: 'fixed' }}
                  >
                    <TableHead>
                      <TableRow>
                        {columnsMonitor.map((column) => (
                          <TableCell
                            key={column.field}
                            style={column.cellStyle}
                          >
                            <p
                              style={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden'
                              }}
                            >
                              {column.title}
                            </p>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {renderTableRecords(dataActivitiesLog?.records)}
                    </TableBody>
                  </Table>
                ) : (
                  <div className={classes.tableEmpty}>Empty Data</div>
                )}
              </TableContainer>

              <TablePagination
                className={classes.tablePagination}
                rowsPerPageOptions={[5, 10, 20, 50, 100, 200, 500]}
                component="div"
                count={dataActivitiesLog?.records?.length}
                rowsPerPage={pagination.rowsPerPage}
                page={pagination.page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Dialog>
        )
      ) : (
        <Dialog
          {...rest}
          aria-labelledby="max-width-dialog-title"
          className={classes.root}
          open={openDialog}
          fullWidth
          maxWidth="xl"
        >
          <Paper className={classes.root}>
            <Toolbar className={classes.toolbar}>
              <Typography
                className={classes.title}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                {title + ` - ${formatPhoneNumber(conversation.customer.phone)}`}
              </Typography>
              <Box>
                <>
                  <Tooltip title="">
                    <IconButton
                      color="inherit"
                      id="export"
                      aria-controls="export-menu"
                      aria-haspopup="true"
                      onClick={handleCloseDialog}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </>
              </Box>
            </Toolbar>
            <div className={classes.circularContain}>
              <CircularProgress />
            </div>
          </Paper>
        </Dialog>
      )}

      <DataDetails
        open={openDataDetails}
        onClose={handleCloseDataDetails}
        data={dataDetails}
      />
    </div>
  );
};

ConversationActivitiesDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  activitiesLog: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  setOpenActivitiesLog: PropTypes.func.isRequired,
  getActivitiesLog: PropTypes.func.isRequired,
  conversation: PropTypes.any.isRequired
};

export default ConversationActivitiesDialog;
