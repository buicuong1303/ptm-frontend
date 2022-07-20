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
import React, { useEffect, useState } from 'react';
import { CustomTextField } from 'components/CustomFields';
import { FastField, Form, Formik } from 'formik';
// import Logo from 'images/logo_light.png';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { signUpAction } from 'scenes/Authentication/Authen.asyncAction';
import apiStatus from 'utils/apiStatus';
import { clearState } from 'scenes/Authentication/Authen.slice';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '0 auto',
    height: '100%',
    padding: theme.spacing(6, 2),
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      width: '100%'
    },
    position: 'relative'
  },
  cardActions: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 16px'
  },
  icon: {
    width: '50px',
    height: '50px'
  },
  card: {
    padding: theme.spacing(3, 3),
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '1px 5px 25px #ccc',
    width: '400px !important',
    [theme.breakpoints.down('xs')]: {
      width: '350px !important'
    }
  },
  cardContent: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    textAlign: 'center'
  },
  textField: {
    margin: '5px 0px'
  }
}));
const initialValues = {
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
};

const validateSchema = Yup.object().shape({
  username: Yup.string().required('Username is required.').min(4),
  firstName: Yup.string().required('Username is required.'),
  lastName: Yup.string().required('Username is required.'),
  email: Yup.string().email().required('Email is required.'),
  password: Yup.string()
    .matches(
      /^(?=.*\d)(?=.*?[#?!@$%^&*-])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.'
    )
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match.')
    .required('Confirm password is required.')
});
const SignUp = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const status = useSelector((state) => state.authen.status);
  const message = useSelector((state) => state.authen.message);
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });
  const handleSubmit = (values) => {
    dispatch(signUpAction(values));
  };
  useEffect(() => {
    if (status === apiStatus.SUCCESS) history.push('/auth/verify/sent');
    if (status === apiStatus.ERROR) showSnackbar(message, 'error');
    return () => {
      dispatch(clearState());
    };
  }, [status]);
  return (
    <Page className={classes.root} title="Sign up">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validateSchema}
      >
        {(formikProps) => {
          return (
            <Form>
              <Card className={classes.card}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Typography variant="h3" style={{ padding: '10px 0px' }}>
                    Sign up
                  </Typography>
                </div>
                <CardContent className={classes.cardContent}>
                  <FastField
                    className={classes.textField}
                    name="firstName"
                    component={CustomTextField}
                    label="First name"
                    type="text"
                    margin="none"
                  />
                  <FastField
                    className={classes.textField}
                    name="lastName"
                    component={CustomTextField}
                    label="Last name"
                    type="text"
                    margin="none"
                  />
                  <FastField
                    className={classes.textField}
                    name="username"
                    component={CustomTextField}
                    label="Username"
                    type="text"
                    margin="none"
                  />
                  <FastField
                    className={classes.textField}
                    name="email"
                    component={CustomTextField}
                    label="Email"
                    type="text"
                    margin="none"
                  />
                  <FastField
                    className={classes.textField}
                    name="password"
                    component={CustomTextField}
                    label="Password"
                    type="password"
                    margin="none"
                  />
                  <FastField
                    className={classes.textField}
                    name="confirmPassword"
                    component={CustomTextField}
                    label="Confirm password"
                    type="password"
                    margin="none"
                  />
                </CardContent>
                <CardActions className={classes.cardActions}>
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    style={{
                      textTransform: 'none',
                      width: '100%',
                      height: '45px'
                    }}
                  >
                    Submit
                  </Button>
                  <div style={{ paddingTop: '20px' }}>
                    <span>I have already an account? </span>
                    <Link
                      align="center"
                      color="secondary"
                      component={RouterLink}
                      underline="always"
                      variant="subtitle2"
                      to="/auth/sign-in"
                    >
                      Login here
                    </Link>
                  </div>
                </CardActions>
              </Card>
            </Form>
          );
        }}
      </Formik>
    </Page>
  );
};

export default SignUp;
