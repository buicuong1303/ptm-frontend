/* eslint-disable indent */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import {
  Card,
  Divider,
  IconButton,
  Paper,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { Page, PreviewMessage, Header } from 'components';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import React, { useEffect, useState } from 'react';
import { useParams, useRouteMatch } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getMessageSetsOfSchedule } from '../../ScheduleMessage.asyncAction';
import { unwrapResult } from '@reduxjs/toolkit';
import { formatPhoneNumber } from 'utils/formatPhoneNumber';
import VisibilityIcon from '@material-ui/icons/Visibility';
import moment from 'moment';
import CustomDialog from 'scenes/ScheduleMessage/components/CustomDialog';
import parseHtml from 'utils/parseHtml';

const useStyles = makeStyles((theme) => ({
  wrapperContent: {
    position: 'relative',
    cursor: 'pointer',
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

function ScheduleMonitor() {
  const classes = useStyles();
  const { url } = useRouteMatch();
  const dispatch = useDispatch();
  let { id } = useParams();
  const [scheduleMonitoring, setScheduleMonitoring] = useState(null);
  const [data, setData] = useState([]);
  const [messageMonitoring, setMessageMonitoring] = useState(null);
  const [open, setOpen] = useState(false);

  const handleViewContent = ({ phone, content }) => {
    setOpen(true);
    setMessageMonitoring({ phone, content });
  };

  const [columnsMonitor, setColumnMonitor] = useState([
    {
      title: '',
      field: 'expand',
    },
    {
      title: '#',
      field: 'number',
    },
    {
      title: 'Company phone',
      field: 'companyPhone',
      cellStyle: { minWidth: '200px' }
    },
    {
      title: 'Customer phone',
      field: 'customerPhone',
      cellStyle: { minWidth: '200px' }
    },
    {
      title: 'Content',
      field: 'content',
      render: (rowData) => (
        <div className={clsx(classes.wrapperContent, 'bridge', 'content')}>
          <p
            className={classes.content}
          >
            {parseHtml(rowData.content)}
          </p>
          <IconButton
            className="view-content"
            style={{ zIndex: 1 }}
            onClick={() => {
              handleViewContent({
                phone: rowData.customerPhone,
                content: parseHtml(rowData.content)
              });
            }}
          >
            <VisibilityIcon color="primary" />
          </IconButton>
        </div>
      ),
      cellStyle: { width: '450px' }
    },
    {
      title: 'Time',
      field: 'time',
      cellStyle: { minWidth: '200px' }
    },
    {
      title: 'Status',
      field: 'status',
      cellStyle: { minWidth: '200px' }
    },
   
  ]);

  const renderContent = (messageSet) => {
    let message = messageSet.content;
    for (const key in messageSet.customFields) {
      const value = messageSet.customFields[key];
      message = message.replace(new RegExp(`{${key}}`, 'gi'), value);
    }
    return message;
  };

  let getMessageSetsOfSchedulePromise = null;
  useEffect(() => {
    async function fetchMessageSetsOfSchedule() {
      getMessageSetsOfSchedulePromise = dispatch(getMessageSetsOfSchedule(id));
      const messageSets = unwrapResult(await getMessageSetsOfSchedulePromise);
      if (messageSets.length > 0) {
        const customFieldColumns = Object.keys(messageSets[0].customFields).map(key => ({
          title: key,
          field: key,
          cellStyle: { minWidth: '200px' }
        }));
        setColumnMonitor([...columnsMonitor,...customFieldColumns]);
        setScheduleMonitoring(messageSets[0].scheduleMessage);
        const rows = messageSets.map((messageSet) => ({
          companyPhone: formatPhoneNumber(messageSet.companyPhone),
          customerPhone: formatPhoneNumber(messageSet.customerPhone),
          content: renderContent(messageSet),
          time: messageSet.message?.exCreationTime
            ? moment(messageSet.message.exCreationTime).format(
                'YYYY-MM-DD hh:mm:ss A'
              )
            : moment(messageSet.creationTime).format('YYYY-MM-DD hh:mm:ss A'),
          status: messageSet.message?.exMessageStatus
            ? messageSet.message.exMessageStatus
            : messageSet.messageSetStatus,
          responses: messageSet.responses,
            ...messageSet.customFields

        }));
        setData([...rows]);
      }
    }
    fetchMessageSetsOfSchedule();
    return () => { };
  }, []);
  return (
    <Page title="Scheduling" className={classes.root}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Header childTitle="Campaigns" isParent />
        <NavigateNextIcon />
        <Header childTitle="Scheduling" isParent urlChild="/scheduling" />
        <NavigateNextIcon />
        <Header childTitle="Monitor" urlChild={url} />
      </div>
      <Divider className={classes.divider} />
      <PreviewMessage
        title={scheduleMonitoring ? scheduleMonitoring.name : ''}
        columns={columnsMonitor}
        data={data}
        exportButton
        onViewContent={handleViewContent}
      />
      <CustomDialog
        title={messageMonitoring && messageMonitoring.phone}
        content={messageMonitoring && parseHtml(messageMonitoring.content)}
        open={open}
        onClose={() => {
          setOpen(false);
          setMessageMonitoring(null);
        }}
      />
    </Page>
  );
}

export default ScheduleMonitor;
