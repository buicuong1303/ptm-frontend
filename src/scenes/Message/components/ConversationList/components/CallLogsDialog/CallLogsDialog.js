/* eslint-disable react/no-multi-comp */
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
  Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import * as moment from 'moment-timezone';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import { formatPhoneNumber } from 'utils/formatPhoneNumber';
import { ExpandableTableRow } from './components';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
    // overflow: 'auto'
    width: '100%'
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
  }
}));

let columnsMonitor = [
  {
    title: 'Direction',
    field: 'direction',
    cellStyle: { flex: 4 }
  },
  {
    title: 'From',
    field: 'from',
    cellStyle: { flex: 4 }
  },
  {
    title: 'To',
    field: 'to',
    cellStyle: { flex: 4 }
  },
  {
    title: 'Agent',
    field: 'legs',
    cellStyle: { flex: 4 }
  },
  {
    title: 'Forward To',
    field: 'forward',
    cellStyle: { flex: 4 }
  },
  {
    title: 'Date / Time',
    field: 'startTime',
    cellStyle: { flex: 2 }
  },
  {
    title: 'Action',
    field: 'type',
    cellStyle: { flex: 4 }
  },
  {
    title: 'Result',
    field: 'result',
    cellStyle: { flex: 4 }
  },
  {
    title: 'Length',
    field: 'duration',
    cellStyle: { flex: 3 }
  }
];

const CallLogsDialog = (props) => {
  const {
    open,
    callLogs,
    title,
    setOpenCallLog,
    getCallLogs,
    conversation,
    company,
    ...rest
  } = props;
  const classes = useStyles();
  const status = useSelector((state) => state.message.status);
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 5
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [dataCallogs, setDataCallogs] = useState({ records: [] });
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [activeLoad, setActiveLoad] = useState(true);
  const [maxToDate, setMaxToDate] = useState('2200-01-01');

  const renderDetail = (data) => {
    return data.map((item, index) => {
      let durationFormat = '0:00:00';
      let forWardTo = '';
      let agentName = '';
      if (parseInt(item.duration) < 60) {
        if (item.duration >= 10) {
          durationFormat = `0:00:${item.duration}`;
        } else {
          durationFormat = `0:00:0${item.duration}`;
        }
      }
      if (parseInt(item.duration) >= 60 && parseInt(item.duration) < 3600) {
        const min = Math.floor(item.duration / 60);
        const sec = item.duration % 60;
        if (min >= 10) {
          if (sec >= 10) {
            durationFormat = `0:${min}:${sec}`;
          } else {
            durationFormat = `0:${min}:0${sec}`;
          }
        } else {
          if (sec >= 10) {
            durationFormat = `0:0${min}:${sec}`;
          } else {
            durationFormat = `0:0${min}:0${sec}`;
          }
        }
      }
      if (parseInt(item.duration) >= 3600) {
        const hour = Math.floor(item.duration / 3600);
        const remainder = item.duration % 3600;
        const min = Math.floor(remainder / 60);
        const sec = remainder % 60;
        durationFormat = `${hour}:${min}:${sec}`;
      }
      if (item.direction == 'Outbound') {
        agentName = item.from.name;
        forWardTo = item.to.phoneNumber;
      }
      if (item.direction == 'Inbound') {
        agentName = item.to.name;
      }
      return (
        <TableRow key={index}>
          <TableCell />
          <TableCell>
            {item.from.phoneNumber
              ? formatPhoneNumber(item.from.phoneNumber)
              : ''}
          </TableCell>
          <TableCell>
            {item.to.phoneNumber ? formatPhoneNumber(item.to.phoneNumber) : ''}
          </TableCell>
          <TableCell>{agentName}</TableCell>
          <TableCell>{forWardTo}</TableCell>
          <TableCell>
            {moment(item.startTime)
              .tz('America/Los_Angeles')
              .format('YYYY-MM-DD hh:mm:ss A')}
          </TableCell>
          <TableCell>{item.type}</TableCell>
          <TableCell>{item.result}</TableCell>
          <TableCell colSpan="2">{durationFormat}</TableCell>
        </TableRow>
      );
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
          <ExpandableTableRow
            hover
            role="checkbox"
            tabIndex={-1}
            key={index}
            expandComponent={
              row['legs'] !== undefined
                ? renderDetail(row.legs)
                : renderDetail([])
            }
          >
            {columnsMonitor.map((column) => {
              const value = row[column.field];
              if (column.field === 'legs') {
                let agentName = '';
                if (row.direction === 'Outbound') {
                  agentName = row.from.name;
                }
                return (
                  <TableCell key={column.field} align={column.align}>
                    {agentName}
                  </TableCell>
                );
              }
              if (column.field === 'to' || column.field === 'from') {
                return (
                  <TableCell key={column.field} align={column.align}>
                    {value.phoneNumber
                      ? formatPhoneNumber(value.phoneNumber)
                      : 'Ext:' + value.extensionNumber}
                  </TableCell>
                );
              }
              if (column.field === 'startTime') {
                return (
                  <TableCell key={column.field} align={column.align}>
                    {moment(value)
                      .tz('America/Los_Angeles')
                      .format('YYYY-MM-DD hh:mm:ss A')}
                  </TableCell>
                );
              }
              if (column.field === 'duration') {
                let durationFormat = '0:00:00';
                if (parseInt(value) < 60) {
                  if (value >= 10) {
                    durationFormat = `0:00:${value}`;
                  } else {
                    durationFormat = `0:00:0${value}`;
                  }
                }
                if (parseInt(value) >= 60 && parseInt(value) < 3600) {
                  const min = Math.floor(value / 60);
                  const sec = value % 60;
                  if (min >= 10) {
                    if (sec >= 10) {
                      durationFormat = `0:${min}:${sec}`;
                    } else {
                      durationFormat = `0:${min}:0${sec}`;
                    }
                  } else {
                    if (sec >= 10) {
                      durationFormat = `0:0${min}:${sec}`;
                    } else {
                      durationFormat = `0:0${min}:0${sec}`;
                    }
                  }
                }
                if (parseInt(value) >= 3600) {
                  const hour = Math.floor(value / 3600);
                  const remainder = value % 3600;
                  const min = Math.floor(remainder / 60);
                  const sec = remainder % 60;
                  durationFormat = `${hour}:${min}:${sec}`;
                }
                return (
                  <TableCell key={column.field} align={column.align}>
                    {durationFormat}
                  </TableCell>
                );
              }
              return (
                <TableCell key={column.field} align={column.align}>
                  {value}
                </TableCell>
              );
            })}
          </ExpandableTableRow>
        );
      });
  };
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

  const handleCloseDialog = () => {
    setDataCallogs({ records: [] });
    setPagination({
      page: 0,
      rowsPerPage: 5
    });
    setOpenDialog(false);
    setOpenCallLog(false);
  };

  const handleSelectFromDate = (e) => {
    setFromDate(e.target.value);
  };

  const handleSelectToDate = (e) => {
    setToDate(e.target.value);
  };

  const handleLoadData = () => {
    const data = {
      customerPhone: conversation.customer.phone.slice(1),
      companyPhone: company.phone.slice(1),
      companyCode: company.code,
      from: fromDate,
      to: toDate
    };
    getCallLogs(data);
  };

  useEffect(() => {
    setOpenDialog(open);
  }, [open]);

  useEffect(() => {
    const newFrom = new Date(fromDate).toISOString();
    const maxTo = moment(newFrom, 'YYYY-MM-DD')
      .add(1, 'months')
      .format('YYYY-MM-DD');
    setMaxToDate(maxTo);
    if (moment(maxTo).isAfter(toDate) || moment(maxTo).isSame(toDate)) {
      if (moment(toDate).isAfter(fromDate) || moment(toDate).isSame(fromDate)) {
        setActiveLoad(false);
      } else {
        setActiveLoad(true);
      }
    } else {
      setActiveLoad(true);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    setDataCallogs(callLogs);
  }, [callLogs]);

  return (
    <div>
      {status === 'success' ? (
        dataCallogs && (
          <Dialog
            {...rest}
            aria-labelledby="max-width-dialog-title"
            className={classes.root}
            open={openDialog}
            fullWidth
            maxWidth="lg"
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
                <Box>
                  <>
                    <label style={{ marginRight: 5, fontWeight: '500' }}>
                      From date:
                    </label>
                    <input
                      type="date"
                      id="from"
                      style={{ marginRight: 10 }}
                      // min={minFromDate}
                      // max={toDate}
                      max={moment(new Date()).format('YYYY-MM-DD')}
                      onChange={(event) => handleSelectFromDate(event)}
                    />

                    <span style={{ margin: '0 10px' }} />

                    <label style={{ marginRight: 5, fontWeight: '500' }}>
                      To date:
                    </label>
                    <input
                      type="date"
                      id="to"
                      style={{ marginRight: 10 }}
                      min={fromDate}
                      max={maxToDate}
                      onChange={(event) => handleSelectToDate(event)}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ marginRight: 50 }}
                      onClick={handleLoadData}
                      disabled={activeLoad}
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
                      >
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                </Box>
              </Toolbar>
              <TableContainer className={classes.container}>
                {dataCallogs.records.length > 0 ? (
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columnsMonitor.map((column) => (
                          <TableCell
                            key={column.field}
                            style={column.cellStyle}
                          >
                            {column.title}
                          </TableCell>
                        ))}
                        <TableCell>Detail</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>{renderTable(dataCallogs.records)}</TableBody>
                  </Table>
                ) : (
                  <div className={classes.tableEmpty}>Empty Data</div>
                )}
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10]}
                component="div"
                count={dataCallogs.records.length}
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
          maxWidth="lg"
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
    </div>
  );
};

CallLogsDialog.prototype = {};

export default CallLogsDialog;
