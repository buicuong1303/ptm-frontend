/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import validate from 'validate.js';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Button, TextField } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useRouter } from 'hooks';
import { signInAction } from 'scenes/Authentication/Authen.asyncAction';
import { clearState } from 'scenes/Authentication/Authen.slice';
import apiStatus from 'utils/apiStatus';
import { setStateSignIn } from 'store/slices/session.slice';

const schema = {
  username: {
    presence: { allowEmpty: false, message: 'is required.' }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required.' }
  }
};

const useStyles = makeStyles((theme) => ({
  root: {},
  fields: {
    margin: theme.spacing(-1),
    display: 'flex',
    height: '165px',
    flexWrap: 'wrap',
    '& > *': {
      flexGrow: 1,
      margin: theme.spacing(1)
    }
  },
  submitButton: {
    marginTop: theme.spacing(2),
    width: '100%'
  }
}));

const SignInForm = (props) => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  //* listen state
  const status = useSelector((state) => state.authen.status);
  const message = useSelector((state) => state.authen.message);

  //* show notification
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, {
      variant: status,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center'
      }
    });

  //* init form value
  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      username: '',
      password: ''
    },
    touched: {},
    errors: {}
  });

  //* validate when change form value
  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  //* handle change form value
  const handleChange = (event) => {
    event.persist();

    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  //* handle submit form
  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(signInAction(formState.values));
    // const { data } = unwrapResult(actionResult);
    // if (data.token) {
    //   localStorage.setItem('accessToken', data.token);
    //   // dispatch()
    //   router.history.push('/');
    // }
  };

  //* check error form
  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  //* handle login success
  const handleLoginSuccess = () => {
    dispatch(setStateSignIn(true));

    router.history.push('/');
  };

  //* handle login failure
  const handleLoginFailure = () => showSnackbar(message, 'error');

  //* check status anh show notification
  useEffect(() => {
    if (status === apiStatus.SUCCESS) handleLoginSuccess();
    else if (status === apiStatus.ERROR) handleLoginFailure();
  }, [status]);

  //* clear state when unmount
  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  //* render ui
  return (
    <form
      {...rest}
      className={clsx(classes.root, className)}
      onSubmit={handleSubmit}
    >
      <div className={classes.fields}>
        <TextField
          error={hasError('username')}
          fullWidth
          helperText={
            hasError('username') ? formState.errors.username[0] : null
          }
          label="Username"
          name="username"
          onChange={handleChange}
          value={formState.values.username || ''}
          variant="outlined"
          autoFocus
        />
        <TextField
          error={hasError('password')}
          fullWidth
          helperText={
            hasError('password') ? formState.errors.password[0] : null
          }
          label="Password"
          name="password"
          onChange={handleChange}
          type="password"
          value={formState.values.password || ''}
          variant="outlined"
          autoComplete="off"
        />
      </div>
      <Button
        className={classes.submitButton}
        color="primary"
        disabled={!formState.isValid}
        size="large"
        type="submit"
        variant="contained"
      >
        Sign in
      </Button>
    </form>
  );
};

SignInForm.propTypes = {
  className: PropTypes.string
};

export default SignInForm;
