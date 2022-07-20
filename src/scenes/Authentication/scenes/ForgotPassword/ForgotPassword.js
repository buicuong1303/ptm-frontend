/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Link,
  TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Page } from 'components';
import { CustomTextField } from 'components/CustomFields';
import { FastField, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { forgotPasswordAction } from 'scenes/Authentication/Authen.asyncAction';
import { clearState } from 'scenes/Authentication/Authen.slice';
import apiStatus from 'utils/apiStatus';
import * as Yup from 'yup';
const useStyles = makeStyles((theme) => ({
  root: {
    width: theme.breakpoints.values.sm,
    maxWidth: '100%',
    margin: '0 auto',
    height: '100%',
    padding: theme.spacing(6, 2),
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      width: '100%'
    }
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  card: {
    width: '500px !important',
    [theme.breakpoints.down('xs')]: {
      width: '350px !important'
    },
    padding: theme.spacing(1, 2),
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '1px 5px 25px #ccc'
  }
}));

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
const ForgotPassword = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const status = useSelector((state) => state.authen.status);
  const [localError, setLocalError] = useState({
    error: false,
    message: ''
  });
  const message = useSelector((state) => state.authen.message);
  const handleEmailChange = (e) => {
    const value = e.target.value;
    const isEmail = validateEmail(value);
    setEmail(value);
    if (!isEmail)
      setLocalError({
        error: true,
        message: 'Email invalid'
      });
    else {
      setLocalError({
        error: false,
        message: ''
      });
    }
  };
  const handleSubmit = () => {
    if (!email)
      setLocalError({
        error: true,
        message: 'Required'
      });
    if (!localError.error) dispatch(forgotPasswordAction({ email }));
  };
  useEffect(() => {
    if (status === apiStatus.SUCCESS)
      history.push('/auth/sign-in/forgot-password/sent');
  }, [status]);
  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);
  return (
    <Page className={classes.root} title="Forgot password">
      <Card className={classes.card}>
        <CardContent>
          <Typography>
            Lost your password? Please enter your username or email address. You
            will receive a link to create a new password via email.
          </Typography>
          <TextField
            style={{
              height: '50px',
              width: '100%'
            }}
            error={!!status || localError.error}
            variant="standard"
            label="Email"
            value={email}
            onChange={handleEmailChange}
            helperText={message || localError.message}
          />
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Button
            color="primary"
            variant="contained"
            style={{ textTransform: 'none' }}
            onClick={handleSubmit}
          >
            Reset password
          </Button>
          <Link
            align="center"
            color="secondary"
            component={RouterLink}
            underline="always"
            variant="subtitle2"
            to="/auth/sign-in"
          >
            Remember your password?
          </Link>
        </CardActions>
      </Card>
    </Page>
  );
};

export default ForgotPassword;
