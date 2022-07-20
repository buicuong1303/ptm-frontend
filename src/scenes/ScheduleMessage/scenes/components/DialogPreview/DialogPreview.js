/* eslint-disable react/no-multi-comp */
/* eslint-disable no-unused-vars */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, withStyles } from '@material-ui/styles';
import CustomDialog from 'scenes/ScheduleMessage/components/CustomDialog';
import { PreviewMessage } from 'components';
import clsx from 'clsx';
import * as xlsx from 'xlsx';
import { formatPhoneNumber } from 'utils/formatPhoneNumber';
import { convertUrlToBase64 } from 'utils/convertUrlToBase64';
import { promisify } from 'util';
const useStyles = makeStyles((theme) => ({
  wrapperContent: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  root: {
    height: '100%',
    margin: '0 auto',
    display: 'flex',
    padding: '24px',
    flexDirection: 'column',
    '& > *': {
      width: '100%'
    }
  },
  paper: {
    flex: '1',
    display: 'flex',
    minHeight: 0,
    flexDirection: 'column'
  },
  divider: {
    backgroundColor: '#3f51b5',
    border: 'none',
    height: '2px',
    margin: '10px 0px'
  },
  content: {
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    wordBreak: 'break-all'
  }
}));

const parseHtml = (text) => {
  let regex = /\n/g;
  return text.split('').map(function (line, index) {
    return line.match(regex) ? <br key={'key_' + index} /> : line;
  });
};

function DialogPreview({ open, schedule, onClose }) {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [messagePreviewing, setMessagePreviewing] = useState(null);
  const [openMessagePreview, setOpenMessagePreview] = useState(false);

  const renderContent = (schedule, customer) => {
    let message = schedule.content;
    for (const item of schedule.customFields) {
      message = message.replace(
        new RegExp(`{${item['field']}}`, 'gi'),
        customer[item['column']]
      );
    }
    return message;
  };
  const handleViewContent = ({ phone, content }) => {
    setOpenMessagePreview(true);
    setMessagePreviewing({ phone, content });
  };
  const handleClose = () => {
    if (!onClose) return;
    onClose();
  };
  useEffect(() => {
    async function downloadFile() {
      const convertUrlToBase64Promise = promisify(convertUrlToBase64);
      const result = await convertUrlToBase64Promise(schedule.customerUrl.url);
      const workbook = xlsx.read(result.data, { type: 'buffer' });
      const ws = workbook.Sheets[workbook.SheetNames[0]];
      const infoCustomers = xlsx.utils.sheet_to_json(ws, { raw: false });
      const customFields = [];
      if (infoCustomers.length > 0)
        for (const key in infoCustomers[0]) {
          if (Object.hasOwnProperty.call(infoCustomers[0], key)) {
            customFields.push({
              title: key,
              field: key,
              cellStyle: { width: '250px' }
            });
          }
        }
      setColumns([
        {
          title: 'Content',
          field: 'content',
          render: (rowData) => (
            <div className={clsx(classes.wrapperContent, 'bridge', 'content')}>
              <p
                className={classes.content}
                // onMouseEnter={(e) => {
                //   const newState = e.target.offsetHeight !== e.target.scrollHeight;
                //   e.target.setAttribute('data-overflow', newState);
                // }}
              >
                {parseHtml(rowData.content)}
              </p>
              <IconButton
                className="view-content"
                style={{ zIndex: 1 }}
                // onClick={() => {
                //   handleViewContent({
                //     phone: rowData.phone,
                //     content: parseHtml(rowData.content)
                //   });
                // }}
              >
                <VisibilityIcon color="primary" />
              </IconButton>
            </div>
          ),
          cellStyle: { width: '450px' }
        },
        ...customFields
      ]);

      const rows = infoCustomers.map((customer) => {
        let tmp = {
          content: schedule ? renderContent(schedule, customer) : ''
        };
        for (const key in customer) {
          if (Object.hasOwnProperty.call(customer, key)) {
            if (key === 'phone') {
              const plainPhone = customer[key].replace(/[^0-9]/g, '');
              const standardPhone =
                plainPhone.length === 10 ? `+1${plainPhone}` : `+${plainPhone}`;
              tmp[key] = formatPhoneNumber(standardPhone);
            } else tmp[key] = customer[key];
          }
        }
        return tmp;
      });
      setData([...rows]);
    }
    function readFile() {
      const workbook = xlsx.read(schedule.customerUrl.data, { type: 'buffer' });
      const ws = workbook.Sheets[workbook.SheetNames[0]];
      const infoCustomers = xlsx.utils.sheet_to_json(ws, { raw: false });
      const customFields = [];
      if (infoCustomers.length > 0)
        for (const key in infoCustomers[0]) {
          if (Object.hasOwnProperty.call(infoCustomers[0], key)) {
            customFields.push({
              title: key,
              field: key,
              cellStyle: { width: '250px' }
            });
          }
        }
      setColumns([
        {
          title: 'Content',
          field: 'content',
          render: (rowData) => (
            <div className={clsx(classes.wrapperContent, 'bridge', 'content')}>
              <p
                className={classes.content}
                // onMouseEnter={(e) => {
                //   const newState = e.target.offsetHeight !== e.target.scrollHeight;
                //   e.target.setAttribute('data-overflow', newState);
                // }}
              >
                {parseHtml(rowData.content)}
              </p>
              <IconButton
                className="view-content"
                style={{ zIndex: 1 }}
                // onClick={() => {
                //   handleViewContent({
                //     phone: rowData.phone,
                //     content: parseHtml(rowData.content)
                //   });
                // }}
              >
                <VisibilityIcon color="primary" />
              </IconButton>
            </div>
          ),
          cellStyle: { width: '450px' }
        },
        ...customFields
      ]);

      const rows = infoCustomers.map((customer) => {
        let tmp = {
          content: schedule ? renderContent(schedule, customer) : ''
        };
        for (const key in customer) {
          if (Object.hasOwnProperty.call(customer, key)) {
            if (key === 'phone') {
              const plainPhone = customer[key].replace(/[^0-9]/g, '');
              const standardPhone =
                plainPhone.length === 10 ? `+1${plainPhone}` : `+${plainPhone}`;
              tmp[key] = formatPhoneNumber(standardPhone);
            } else tmp[key] = customer[key];
          }
        }
        return tmp;
      });
      setData([...rows]);
    }
    if (!schedule) return;
    if (!schedule.customerUrl.data) {
      downloadFile();
    } else {
      readFile();
    }
  }, [schedule]);

  return (
    <Dialog
      maxWidth={'lg'}
      aria-labelledby="customized-dialog-title"
      open={open}
      onClose={handleClose}
      style={{ zIndex: 4 }}
    >
      <DialogTitle style={{ textAlign: 'end' }}>
        <CloseIcon
          className={classes.icon}
          onClick={handleClose}
          style={{ cursor: 'pointer' }}
        />
      </DialogTitle>
      <DialogContent dividers>
        <PreviewMessage
          columns={columns}
          data={data}
          onViewContent={handleViewContent}
          exportButton
          title={schedule?.name || ''}
        />
      </DialogContent>
      <CustomDialog
        title={messagePreviewing && messagePreviewing.phone}
        content={messagePreviewing && parseHtml(messagePreviewing.content)}
        open={openMessagePreview}
        onClose={() => {
          setOpenMessagePreview(false);
          setMessagePreviewing(null);
        }}
      />
    </Dialog>
  );
}

export default DialogPreview;
