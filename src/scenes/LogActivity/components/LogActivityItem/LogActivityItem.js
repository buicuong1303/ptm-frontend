/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Tooltip } from '@material-ui/core';
import entityStatus from 'utils/entityStatus';
import { CustomButton } from 'components';
import { Visibility } from '@material-ui/icons';
import htmlParser from 'html-react-parser';
import logAction from 'utils/logAction';
import * as momentTz from 'moment-timezone';

const useStyles = makeStyles((theme) => ({
  logActivityItem: {
    borderBottom: '1px solid #d2d2d2',
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    transition: 'all .5s',
    '&:hover': {
      transition: 'all 0s',
      backgroundColor: '#e7e7e7'
    },
    color: '#c1c1c1'
  },

  logActivityItemActive: {
    borderBottom: '1px solid #d2d2d2',
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    transition: 'all .5s',
    '&:hover': {
      transition: 'all 0s',
      backgroundColor: '#e7e7e7'
    }
  },

  header: {
    display: 'flex',
    width: '100%',
    backgroundColor: '#d2d2d2'
  },

  dataItemList: {
    textAlign: 'left',
    paddingLeft: theme.spacing(1),
    height: '120px',
    listStyle: 'none'
  },

  listDepartment: {
    height: '120px',
    listStyle: 'none',
    display: 'table-cell',
    verticalAlign: 'middle'
  }
}));

const LogActivity = (props) => {
  const { no, columns, logActivity, showDataDetails, ...rest } = props;

  const classes = useStyles();

  //* UI
  return (
    <li
      className={
        logActivity.status === entityStatus.ACTIVE
          ? classes.logActivityItemActive
          : classes.logActivityItem
      }
    >
      {columns.map((column, index) => {
        let value = logActivity?.[column.field];

        if (column.field === 'user')
          value = `${JSON.parse(logActivity?.[column.field])?.firstName}
            ${JSON.parse(logActivity?.[column.field])?.lastName}
            (${JSON.parse(logActivity?.[column.field])?.username})`;

        if (column.field === 'logAction') value = logAction[value];

        if (column.field === 'creationTime')
          value = momentTz(value).format('MM-DD-YYYY hh:mm:ss A');

        if (column.field === 'data')
          value = {
            oldData: JSON.parse(logActivity?.['oldData']),
            newData: JSON.parse(logActivity?.['newData'])
          };

        return (
          <div
            key={`${logActivity?.id}-${index}`}
            style={{
              ...column.cellStyles,
              marginRight: column.field === 'data' ? '-5px' : ''
            }}
          >
            {column.field === 'data' ? (
              <CustomButton
                onClick={() => showDataDetails(value)}
                style={{
                  minWidth: '40px',
                  padding: '0px',
                  marginLeft: '0px',
                  marginRight: '0px'
                }}
                theme="blue"
              >
                <Visibility />
              </CustomButton>
            ) : column.field === 'no' ? (
              <p style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {no}
              </p>
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
                  {htmlParser(value)}
                </div>
              </Tooltip>
            ) : (
              <p style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {value}
              </p>
            )}
          </div>
        );
      })}
    </li>
  );
};

LogActivity.propTypes = {
  no: PropTypes.number,
  columns: PropTypes.array.isRequired,
  logActivity: PropTypes.object.isRequired,
  showDataDetails: PropTypes.func
};

export default LogActivity;
