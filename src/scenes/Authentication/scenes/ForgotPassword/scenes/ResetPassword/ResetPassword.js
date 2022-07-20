/* eslint-disable no-unused-vars */
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Link,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Page } from 'components';
import React, { useEffect, useMemo, useState } from 'react';
import HttpsIcon from '@material-ui/icons/Https';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Error401 from 'scenes/Error401';
import * as qs from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  verifyAccountAction,
  resetPasswordAction
} from 'scenes/Authentication/Authen.asyncAction';
import { FastField, Form, Formik } from 'formik';
import { CustomTextField } from 'components/CustomFields';
import * as Yup from 'yup';
import { clearState } from 'scenes/Authentication/Authen.slice';
import apiStatus from 'utils/apiStatus';
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
    margin: '0 auto',
    height: '100%',
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      width: '100%'
    },
    position: 'relative'
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'center'
  },

  card: {
    padding: theme.spacing(3),
    width: '500px !important',
    [theme.breakpoints.down('xs')]: {
      width: '350px !important'
    },
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '1px 5px 25px #ccc',
    textAlign: 'center'
  },
  cardContent: {
    padding: theme.spacing(3)
  },
  icon: {
    margin: '10px 0px',
    width: '50px',
    height: '50px',
    color: theme.palette.success.main
  }
}));
const validateSchema = Yup.object().shape({
  newPassword: Yup.string()
    .matches(/^(?=.{8,})/, 'Password must be at least 8 characters.')
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match.')
    .required('Confirm password is required.')
});
const ResetPassword = () => {
  const classes = useStyles();
  const { search } = useLocation();
  const { token } = qs.parse(search);
  const dispatch = useDispatch();
  const status = useSelector((state) => state.authen.status);
  const resetSuccess = useSelector((state) => state.authen.resetSuccess);

  const handleSubmit = (values) => {
    dispatch(
      resetPasswordAction({
        newPassword: values.newPassword,
        accessToken: token
      })
    );
  };
  //* constructor
  useMemo(() => {
    dispatch(verifyAccountAction(token));
  }, []);
  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  return (
    <Page className={classes.root} title="Reset password">
      {status === apiStatus.SUCCESS ? (
        <Formik
          initialValues={{ newPassword: '', confirmPassword: '' }}
          onSubmit={handleSubmit}
          validationSchema={validateSchema}
        >
          {(formikProps) => {
            return (
              <Form>
                <Card className={classes.card}>
                  {!resetSuccess ? (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: '15px'
                        }}
                      >
                        <HttpsIcon className={classes.icon} />
                        <Typography
                          variant="h3"
                          style={{ padding: '10px 0px' }}
                        >
                          Reset Password
                        </Typography>
                      </div>
                      <CardContent className={classes.cardContent}>
                        <FastField
                          component={CustomTextField}
                          label="New password"
                          name="newPassword"
                          variant="standard"
                          type="password"
                        />
                        <FastField
                          component={CustomTextField}
                          label="Confirm password"
                          name="confirmPassword"
                          variant="standard"
                          type="password"
                        />
                      </CardContent>
                      <CardActions className={classes.cardActions}>
                        <Button
                          color="primary"
                          type="submit"
                          variant="contained"
                          style={{
                            textTransform: 'none',
                            width: '100%',
                            padding: '8px 0px'
                          }}
                        >
                          Submit
                        </Button>
                      </CardActions>
                    </>
                  ) : (
                    <>
                      <CardContent className={classes.cardContent}>
                        <CheckCircleOutlineIcon className={classes.icon} />
                        <div>
                          <Typography variant="h3">
                            Password has been reset
                          </Typography>
                        </div>
                      </CardContent>
                      <CardActions className={classes.cardActions}>
                        <Link
                          align="center"
                          color="secondary"
                          component={RouterLink}
                          underline="always"
                          variant="subtitle2"
                          to="/auth/sign-in"
                        >
                          Login now
                        </Link>
                      </CardActions>
                    </>
                  )}
                </Card>
              </Form>
            );
          }}
        </Formik>
      ) : status === apiStatus.PENDING ? (
        <></>
      ) : (
        <Error401 />
      )}
    </Page>
  );
};

export default ResetPassword;
