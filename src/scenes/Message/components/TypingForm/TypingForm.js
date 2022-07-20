/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles((theme) =>({
  root:{
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(2),
    color: '#9E9E9E',
    fontSize: '12px'
  }
}));

const TypingForm = (props) => {
  const {typingUsers} = props;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <p><b>{typingUsers}</b> typing...</p>
    </div>
  );
};
export default TypingForm;
