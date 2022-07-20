/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { forwardRef } from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { makeStyles } from '@material-ui/styles';
import GetAppIcon from '@material-ui/icons/GetApp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {
  Box,
  Button,
  Card,
  Icon,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@material-ui/core';
import clsx from 'clsx';
import theme from 'theme';
import './styles.scss';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Toolbar from '@material-ui/core/Toolbar';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import { CsvBuilder } from 'filefy';
import jsPDF from 'jspdf';
import Row from './Row';
import * as moment from 'moment';
const useStyles = makeStyles(() => ({
  wrapperContent: {
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '450px'
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
  }
}));

const PreviewMessage = (props) => {
  const { columns, data, title, onViewContent, exportButton } = props;
  const classes = useStyles();
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 5
  });
  const [search, setSearch] = useState('');
  const [dataFilter, setDataFilter] = useState([]);
  const [exportButtonAnchorEl, setExportButtonAnchorEl] = useState(null);
  const handleChangeSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPagination({
      ...pagination,
      page: 0
    });
    const result = data.filter((item) => {
      return Object.keys(item)
        .filter((key) => key !== 'responses')
        .some((key) => {
          return item[key].toLowerCase().includes(value.toLowerCase());
        });
    });
    setDataFilter(result);
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
  const renderTable = (rows) => {
    return rows
      .slice(
        pagination.page * pagination.rowsPerPage,
        pagination.page * pagination.rowsPerPage + pagination.rowsPerPage
      )
      .map((row, index) => {
        return (
          <Row
            key={index}
            classes={classes}
            row={row}
            index={pagination.page * pagination.rowsPerPage + index}
            columns={columns}
            onViewContent={onViewContent}
          />
        );
      });
  };
  const handleClose = () => {
    setExportButtonAnchorEl(null);
  };
  const handleExportCsv = () => {
    const fileName = title || 'data';
    const newData = data.reduce((res, item) => {
      const tmp = { ...item };
      const responses = tmp.responses.map((response) => ({
        companyPhone: tmp.companyPhone,
        customerPhone: tmp.customerPhone,
        content: response.text,
        time: moment(response.creationTime).format('YYYY-MM-DD hh:mm:ss A'),
        status: ''
      }));
      delete tmp['responses'];
      res = [...res, tmp, ...responses];
      return res;
    }, []);
    const builder = new CsvBuilder(fileName + '.csv');
    // remove column expand, column No.
    const tmpColumns = [...columns];
    tmpColumns.splice(0, 2);

    builder.setColumns(tmpColumns.map((column) => column.field));
    builder
      .addRows(newData.map((item) => Object.keys(item).map((key) => item[key])))
      .exportFile();
  };
  const handleExportPdf = () => {
    let content = {
      startY: 50,
      head: [columns.sort().map((column) => column.title)],
      body: data.map((item) =>
        Object.keys(item)
          .sort()
          .map((key) => item[key])
      )
    };
    const fileName = title || 'data';
    const unit = 'pt';
    const size = 'A4';
    const orientation = 'landscape';

    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(15);
    doc.text(fileName || 'data', 40, 40);
    doc.autoTable(content);
    doc.save((fileName || 'data' || 'data') + '.pdf');
  };
  return (
    <Paper className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {title}
        </Typography>
        <Box>
          <TextField
            id="standard-start-adornment"
            value={search}
            onChange={handleChangeSearch}
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
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSearch('')}
                    />
                  )}
                </InputAdornment>
              )
            }}
          />
          {exportButton && (
            <>
              <Tooltip title="Download">
                <IconButton
                  color="inherit"
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
                {/* <MenuItem onClick={handleExportPdf}>Export as PDF</MenuItem> */}
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
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
            {search === '' ? renderTable(data) : renderTable(dataFilter)}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 50, 100, 500, 1000]}
        component="div"
        count={search === '' ? data.length : dataFilter.length}
        rowsPerPage={pagination.rowsPerPage}
        page={pagination.page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
PreviewMessage.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  title: PropTypes.string.isRequired,
  onViewContent: PropTypes.func,
  exportButton: PropTypes.bool
};
PreviewMessage.defaultProps = {
  columns: [],
  data: [],
  title: '',
  exportButton: false
};
export default PreviewMessage;
