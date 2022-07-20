/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import {
  Divider,
  Paper,
  TextField,
  Box,
  Button,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TableBody,
  Tooltip,
  IconButton,
  Toolbar,
  Typography,
  MenuItem,
  Menu,
  CircularProgress,
  Backdrop
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Header, Page, FileInput, SelectInput } from 'components';
import Stack from '@mui/material/Stack';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDateRangePicker from '@mui/lab/DesktopDateRangePicker';
import { CompanyContext } from 'contexts/CompanyProvider';
import { useDispatch } from 'react-redux';
import { getConversationHistory } from './ConversationHistory.asyncAction';
import { unwrapResult } from '@reduxjs/toolkit';
import { Row } from './components';
import { CsvBuilder } from 'filefy';
import GetAppIcon from '@material-ui/icons/GetApp';
import mtz from 'moment-timezone';
import { formatPhoneNumber } from 'utils/formatPhoneNumber';
import { useSnackbar } from 'notistack';
import AuthGuard from 'components/AuthGuard';
import DateTimePicker from '@mui/lab/DateTimePicker';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import apiStatus from 'utils/apiStatus';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    margin: '0 auto',
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      width: '100%'
    }
  },
  backdrop: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  paper: {
    flex: '1',
    display: 'flex',
    minHeight: 0,
    flexDirection: 'column',
    zIndex: 0
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
  title: {},
  tableHead: {
    padding: `0px ${theme.spacing(2)}px`
  }
}));

function ViewResponses() {
  const classes = useStyles();
  // const [rangeDate, setRangeDate] = useState([null, null]);
  // const handleRangeDateChange = (value) => {
  //   setRangeDate(value);
  // };
  const [exportButtonAnchorEl, setExportButtonAnchorEl] = useState(null);
  const { companies } = useContext(CompanyContext);
  const [file, setFile] = useState([]);
  const dispatch = useDispatch();
  const [selectedCompany, setSelectedCompany] = useState('');
  const [dataTable, setDataTable] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  //* Backdrop
  const [openBackdrop, setOpenBackdrop] = useState(false);
  // const handleToggleBackdrop = (backdrop) => {
  //   if (backdrop === apiStatus.PENDING) setOpenBackdrop(true);
  //   else setOpenBackdrop(false);
  // };

  // useEffect(() => {
  //   handleToggleBackdrop(backdrop);
  //   // eslint-disable-next-line
  // }, [backdrop]);

  const handleChooseFile = async (fileData) => {
    setFile(fileData);
  };
  const handleChangeCompany = (e) => {
    setSelectedCompany(e.target.value);
  };
  const handleGetResponses = async () => {
    try {
      setOpenBackdrop(true);
      const res = await dispatch(
        getConversationHistory({
          companyId: selectedCompany,
          file,
          rangeDate: [dateFromValue, dateToValue]
        })
      );
      const data = unwrapResult(res);
      setDataTable(data);
      setOpenBackdrop(false);
      enqueueSnackbar('Success', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.error, { variant: 'error' });
    }
  };
  const isValid = () => {
    if (selectedCompany && file.length > 0 && dateToValue && dateFromValue)
      return true;
    return false;
  };
  const handleReset = () => {
    // setRangeDate([null, null]);
    setDateToValue(new Date());
    setDateFromValue(new Date());
    setSelectedCompany(null);
    setFile([]);
  };
  const handleClose = () => {
    setExportButtonAnchorEl(null);
  };
  const renderMessage = (message) => {
    let text = message.text;
    if (message.attachments.length > 0)
      text += `\nAttachment:[${message.attachments.length}]`;
    return text;
  };
  const handleExportCsv = () => {
    // const fileName = title || 'data';
    const newData = dataTable.reduce((res, item) => {
      const messages = item?.messages.map((message, index) => ({
        number: index + 1,
        companyPhone: formatPhoneNumber(item.company.phone),
        customerPhone: formatPhoneNumber(item.customer.phoneNumber),
        inbound: message.direction === 'inbound' ? renderMessage(message) : '',
        outbound:
          message.direction === 'outbound' ? renderMessage(message) : '',
        time: mtz
          .tz(message.creationTime, 'America/Los_Angeles')
          .format('YYYY-MM-DD HH:mm:ss A'),
        status: message.exMessageStatus || message.messageStatus
      }));
      res = [...res, ...messages];
      return res;
    }, []);
    const builder = new CsvBuilder('History' + '.csv');
    builder.setColumns([
      '#',
      'Company phone',
      'Client Phone',
      'Inbound',
      'Outbound',
      'Time',
      'Status'
    ]);
    builder
      .addRows(newData.map((item) => Object.keys(item).map((key) => item[key])))
      .exportFile();
  };
  const [dateToValue, setDateToValue] = React.useState(new Date());
  const [dateFromValue, setDateFromValue] = React.useState(new Date());
  return (
    <AuthGuard
      requestPermissions={[{ action: 'read', result: '/report-messages' }]}
    >
      <Page title="Conversation history" className={classes.root}>
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Header childTitle="Reporting" isParent />
            <NavigateNextIcon />
            <Header
              childTitle="Conversation history"
              urlChild="/report/message/conversation-history"
            />
          </div>
          <Divider className={classes.divider} />
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            style={{ marginBottom: '10px' }}
          >
            <FileInput
              accept=".xlsx, .xls, .csv"
              className={classes.btnInput}
              handleChooseFile={handleChooseFile}
              file={file}
              style={{
                padding: 8,
                borderRadius: 3,
                maxWidth: 200,
                display: 'flex'
              }}
            />
            <SelectInput
              label="Company"
              options={companies.map((item) => ({
                value: item.id,
                label: item.name
              }))}
              style={{ width: 150, backgroundColor: '#fff' }}
              name="company"
              value={selectedCompany}
              onChange={handleChangeCompany}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              {/* <DesktopDateRangePicker
                startText="Start"
                value={rangeDate}
                maxDate={new Date()}
                minDate={
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() - 1,
                    1
                  )
                }
                onChange={handleRangeDateChange}
                renderInput={(startProps, endProps) => (
                  <React.Fragment>
                    <TextField
                      style={{
                        backgroundColor: '#fff'
                      }}
                      size="small"
                      variant="outlined"
                      {...startProps}
                    />
                    <Box sx={{ mx: 2 }}> to </Box>
                    <TextField
                      aria-readonly
                      style={{
                        backgroundColor: '#fff'
                      }}
                      size="small"
                      variant="outlined"
                      {...endProps}
                    />
                  </React.Fragment>
                )}
              /> */}
              <DateTimePicker
                renderInput={(props) => (
                  <TextField
                    aria-readonly
                    style={{
                      backgroundColor: '#fff'
                    }}
                    size="small"
                    variant="outlined"
                    {...props}
                  />
                )}
                label="From"
                maxDate={dateToValue}
                value={dateFromValue}
                onChange={(newValue) => {
                  setDateFromValue(newValue);
                }}
              />
              <DateTimePicker
                renderInput={(props) => (
                  <TextField
                    aria-readonly
                    style={{
                      backgroundColor: '#fff'
                    }}
                    size="small"
                    variant="outlined"
                    {...props}
                  />
                )}
                maxDate={new Date()}
                label="To"
                value={dateToValue}
                onChange={(newValue) => {
                  setDateToValue(newValue);
                }}
              />
            </LocalizationProvider>
            <Button
              color="primary"
              variant="contained"
              disabled={!isValid()}
              onClick={handleGetResponses}
            >
              Get
            </Button>
            <Button
              style={{ backgroundColor: 'orange', color: '#fff' }}
              variant="contained"
              onClick={handleReset}
            >
              Reset
            </Button>
          </Stack>
          <Paper className={classes.paper} elevation={1} variant="outlined">
            <Toolbar className={classes.toolbar}>
              <Typography
                className={classes.title}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                {'Conversation history'}
              </Typography>
              <Stack direction="row" style={{ marginLeft: 'auto' }}>
                <Tooltip title="">
                  <IconButton
                    color="primary"
                    id="export"
                    aria-controls="export-menu"
                    aria-haspopup="true"
                    onClick={(event) => {
                      setExportButtonAnchorEl(event.currentTarget);
                    }}
                  >
                    <GetAppIcon />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={exportButtonAnchorEl}
                  open={Boolean(exportButtonAnchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleExportCsv}>Export as CSV</MenuItem>
                </Menu>
              </Stack>
            </Toolbar>
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell>Company phone</TableCell>
                    <TableCell align="left">Client phone</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataTable.map((row, index) => (
                    <Row key={index} row={row} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
        <Backdrop className={classes.backdrop} open={openBackdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Page>
    </AuthGuard>
  );
}

export default ViewResponses;
