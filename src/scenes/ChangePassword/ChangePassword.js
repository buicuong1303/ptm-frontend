import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Header, Page } from 'components';
import { CustomTextField } from 'components/CustomFields';
import { FastField, Form, Formik } from 'formik';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import apiStatus from 'utils/apiStatus';
import { useSnackbar } from 'notistack';
import { changePasswordAction } from 'scenes/User/User.asyncActions';
import { clearStatus } from 'scenes/User/User.slice';
const useStyles = makeStyles((theme) => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    height: '100%',
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      width: '100%'
    }
  },
  divider: {
    backgroundColor: theme.palette.primary.main,
    border: 'none',
    height: '2px',
    margin: '10px 0px'
  },
  dividerAction: {
    backgroundColor: '#ccc',
    height: '1px'
  },
  container: {
    marginTop: theme.spacing(3)
  },
  btn: {
    margin: '0 auto'
  },
  textField: {
    margin: theme.spacing(1, 0, 2)
  },
  card: {
    width: '100%'
  },
  wrapperInput: {
    width: '500px',
    margin: '0 auto',
    border: '1px solid',
    padding: theme.spacing(5),
    borderRadius: '4px',
    borderColor: theme.palette.primary.main
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'center'
  }
}));
const initialValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
};

const validateSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required.'),
  newPassword: Yup.string()
    .matches(/^(?=.{8,})/, 'Password must be at least 8 characters.')
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match.')
    .required('Confirm password is required.')
});
function ChangePassword() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const clearBtn = useRef();
  const setError = useRef();
  const status = useSelector((state) => state.users.status);
  const message = useSelector((state) => state.users.message);
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, {
      variant: status,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center'
      }
    });

  useEffect(() => {
    if (status === apiStatus.SUCCESS) {
      showSnackbar('Change password success', 'success');
      clearBtn.current.click();
    } else if (status === apiStatus.ERROR) {
      setError.current('currentPassword', message);
    }
  }, [status]);
  useEffect(() => {
    return () => {
      dispatch(clearStatus());
    };
  }, []);
  return (
    <Page className={classes.root} title="Change password">
      <Header childTitle="Change password" urlChild="/change-password" />
      <Divider className={classes.divider} />
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validateSchema}
        onSubmit={(values, actions) => {
          dispatch(
            changePasswordAction({
              newPassword: values.newPassword,
              currentPassword: values.currentPassword
            })
          );
          setError.current = actions.setFieldError;
        }}
      >
        {(formikProps) => {
          return (
            <Card className={classes.card}>
              <Form>
                <CardContent>
                  <div className={classes.wrapperInput}>
                    <FastField
                      className={classes.textField}
                      name="currentPassword"
                      component={CustomTextField}
                      label="* Current password"
                      type="password"
                      margin="none"
                    />
                    <FastField
                      className={classes.textField}
                      name="newPassword"
                      component={CustomTextField}
                      label="* New password"
                      type="password"
                      margin="none"
                    />
                    <FastField
                      className={classes.textField}
                      name="confirmPassword"
                      component={CustomTextField}
                      label="* Confirm password"
                      type="password"
                      margin="none"
                    />
                  </div>
                </CardContent>
                <Divider className={classes.dividerAction} />
                <CardActions disableSpacing className={classes.cardActions}>
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: '#ef5350',
                      color: '#fff',
                      marginRight: '10px'
                    }}
                    color="inherit"
                    ref={clearBtn}
                    onClick={() => formikProps.resetForm()}
                  >
                    Clear
                  </Button>
                  <Button variant="contained" color="primary" type="submit">
                    Save Change
                  </Button>
                </CardActions>
              </Form>
            </Card>
          );
        }}
      </Formik>
    </Page>
  );
}

export default ChangePassword;
