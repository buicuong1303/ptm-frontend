/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import { Divider, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { Page, PreviewMessage, Header } from 'components';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import React, { useEffect, useState } from 'react';
import { useParams, useRouteMatch } from 'react-router';
import { useDispatch } from 'react-redux';
import { convertUrlToBase64 } from 'utils/convertUrlToBase64';
import { promisify } from 'util';
import * as xlsx from 'xlsx';
import {
  getScheduleMessage,
  getMessageSetOfScheduleRetry
} from 'scenes/ScheduleMessage/ScheduleMessage.asyncAction';
import { unwrapResult } from '@reduxjs/toolkit';
import { formatPhoneNumber } from 'utils/formatPhoneNumber';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CustomDialog from 'scenes/ScheduleMessage/components/CustomDialog';
import parseHtml from 'utils/parseHtml';

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

function SchedulePreview() {
  const classes = useStyles();
  const { url } = useRouteMatch();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [schedulePreviewing, setSchedulePreviewing] = useState(null);
  const [messagePreviewing, setMessagePreviewing] = useState(null);
  const [open, setOpen] = useState(false);
  let { id } = useParams();

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
    setOpen(true);
    setMessagePreviewing({ phone, content });
  };
  const [columns, setColumns] = useState([
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
            onClick={() => {
              handleViewContent({
                phone: rowData.phone,
                content: parseHtml(rowData.content)
              });
            }}
          >
            <VisibilityIcon color="primary" />
          </IconButton>
        </div>
      ),
      cellStyle: { width: '450px' }
    }
  ]);
  let getSchedulePromise = null;

  useEffect(() => {
    async function downloadFile() {
      getSchedulePromise = dispatch(getScheduleMessage(id));
      const schedule = unwrapResult(await getSchedulePromise);
      setSchedulePreviewing(schedule);
      if (!schedule.backupScheduleMessageId) {
        const convertUrlToBase64Promise = promisify(convertUrlToBase64);
        const result = await convertUrlToBase64Promise(
          schedule.customerUrl.url
        );
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
        setColumns([...columns, ...customFields]);

        const rows = infoCustomers.map((customer) => {
          let tmp = {
            content: schedule ? renderContent(schedule, customer) : ''
          };
          for (const key in customer) {
            if (Object.hasOwnProperty.call(customer, key)) {
              if (key === 'phone') {
                const plainPhone = customer[key].replace(/[^0-9]/g, '');
                const standardPhone =
                  plainPhone.length === 10
                    ? `+1${plainPhone}`
                    : `+${plainPhone}`;
                tmp[key] = formatPhoneNumber(standardPhone);
              } else tmp[key] = customer[key];
            }
          }
          return tmp;
        });
        setData([...rows]);
      } else {
        const getScheduleRetryPromise = dispatch(
          getMessageSetOfScheduleRetry(id)
        );
        const scheduleRetryReviewData = unwrapResult(
          await getScheduleRetryPromise
        );
        const customFields = [];
        for (const key in scheduleRetryReviewData[0]) {
          if (
            Object.hasOwnProperty.call(scheduleRetryReviewData[0], key) &&
            key !== 'content'
          ) {
            customFields.push({
              title: key,
              field: key,
              cellStyle: { width: '250px' }
            });
          }
        }
        setColumns([...columns, ...customFields]);
        setData(scheduleRetryReviewData);
      }
    }
    downloadFile();
    return () => {
      getSchedulePromise.abort();
    };
  }, []);

  return (
    <Page title="Scheduling" className={classes.root}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Header childTitle="Campaigns" isParent />
        <NavigateNextIcon />
        <Header childTitle="Scheduling" isParent urlChild="/scheduling" />
        <NavigateNextIcon />
        <Header childTitle="Preview" urlChild={url} />
      </div>
      <Divider className={classes.divider} />
      <PreviewMessage
        title={schedulePreviewing ? schedulePreviewing.name : ''}
        columns={columns}
        data={data}
        onViewContent={handleViewContent}
        exportButton
      />
      <CustomDialog
        title={messagePreviewing && messagePreviewing.phone}
        content={messagePreviewing && parseHtml(messagePreviewing.content)}
        open={open}
        onClose={() => {
          setOpen(false);
          setMessagePreviewing(null);
        }}
      />
    </Page>
  );
}

export default SchedulePreview;
