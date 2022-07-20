/* eslint-disable no-unused-vars */
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
import { formatPhoneNumber } from '../../../../utils/formatPhoneNumber';
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
  const renderMessage = (message) => {
    return (
      <div>
        <p>{parseHtml(message.text)}</p>
        {message.attachments.length > 0 && (
          <span style={{ color: '#283593' }}>
            Attachments:{`[${message.attachments.length}]`}
          </span>
        )}
      </div>
    );
  };
  return (
    <React.Fragment key={index}>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell align="left" component="th" scope="row">
          {formatPhoneNumber(row.company.phone)}
        </TableCell>
        <TableCell align="left">
          {formatPhoneNumber(row.customer.phoneNumber)}
        </TableCell>
        <TableCell align="right">
          <IconButton
            aria-label="expand row"
            size="small"
            style={{ color: 'red' }}
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
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
                    <TableCell style={{ width: '5%' }}>#</TableCell>
                    <TableCell style={{ width: '40%' }}>Client</TableCell>
                    <TableCell style={{ width: '40%' }}>Company</TableCell>
                    <TableCell style={{ width: '15%' }}>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.messages.map((message, index) => (
                    <TableRow key={message.date}>
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        {message.direction === 'inbound' &&
                          renderMessage(message)}
                      </TableCell>
                      <TableCell>
                        {message.direction === 'outbound' &&
                          renderMessage(message)}
                      </TableCell>
                      <TableCell>
                        {mtz
                          .tz(message.creationTime, 'America/Los_Angeles')
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
