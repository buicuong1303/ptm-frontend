/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import htmlParser from 'html-react-parser';

const useStyles = makeStyles((theme) => ({
  root: {
    borderBottom: '1px solid #d2d2d2',
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
    color: '#000000'
  }
}));

const GroupMessageItem = (props) => {
  const {
    className,
    order,
    company,
    clientPhone,
    otherClients,
    time,
    content
  } = props;
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)}>
      <div style={{ flex: '0.5' }}> {order} </div>
      <div style={{ flex: '1.5' }}> {company} </div>
      <div style={{ flex: '1.5' }}> {clientPhone} </div>
      <div style={{ flex: '3' }}> {otherClients} </div>
      <div style={{ flex: '3.5' }}> {htmlParser(content)} </div>

      <div style={{ flex: '2' }}> {time} </div>
    </div>
  );
};

GroupMessageItem.propTypes = {
  className: PropTypes.string,
  order: PropTypes.string,
  company: PropTypes.string,
  clientPhone: PropTypes.string,
  otherClients: PropTypes.string,
  time: PropTypes.string,
  content: PropTypes.string
};

export default GroupMessageItem;
