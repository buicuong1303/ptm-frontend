import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import React from 'react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import clsx from 'clsx';
import VisibilityIcon from '@material-ui/icons/Visibility';
import mtz from 'moment-timezone';
const parseHtml = (text) => {
  let regex = /\n/g;
  return text.split('').map(function (line, index) {
    return line.match(regex) ? <br key={'key_' + index} /> : line;
  });
};
export default function Row(props) {
  const { classes, columns, row, onViewContent, index } = props;
  const [open, setOpen] = React.useState(false);
  if (!row) return;
  return (
    <React.Fragment key={index}>
      <TableRow hover role="checkbox" tabIndex={-1}>
        {columns.map((column) => {
          if (column.field === 'expand')
            return (
              <TableCell key={column.field}>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  style={{ color: 'black' }}
                  onClick={() => setOpen(!open)}
                >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </TableCell>
            );
          if (column.field === 'number')
            return (
              <TableCell key={column.field} align={column.align}>
                {index + 1}
              </TableCell>
            );
          const value = row[column.field];
          if (column.field !== 'content')
            return (
              <TableCell key={column.field} align={column.align}>
                {value}
              </TableCell>
            );

          return (
            <TableCell
              key={column.field}
              className={clsx(classes.wrapperContent, 'bridge', 'content')}
            >
              <p
                className={classes.content}
                // onMouseEnter={(e) => {
                //   const newState = e.target.offsetHeight !== e.target.scrollHeight;
                //   e.target.setAttribute('data-overflow', newState);
                // }}
              >
                {parseHtml(value)}
              </p>
              <IconButton
                className="view-content"
                style={{ zIndex: 1 }}
                onClick={() => {
                  if (!onViewContent) return;
                  onViewContent({
                    phone: row['customerPhone'] || row['phone'],
                    content: value
                  });
                }}
              >
                <VisibilityIcon color="primary" />
              </IconButton>
            </TableCell>
          );
        })}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Responses
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Company phone</TableCell>
                    <TableCell>Customer phone</TableCell>
                    <TableCell> Content</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.responses?.map((responseRow, index) => (
                    <TableRow key={responseRow.date}>
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell>{row.companyPhone}</TableCell>
                      <TableCell>{row.customerPhone}</TableCell>
                      <TableCell>{responseRow.text}</TableCell>
                      <TableCell>
                        {mtz
                          .tz(responseRow.creationTime, 'America/Los_Angeles')
                          .format('YYYY-MM-DD HH:mm:ss A')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
