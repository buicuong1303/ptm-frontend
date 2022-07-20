/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Divider,
} from '@material-ui/core';
import {
  DialogConfirm,
  TextField as CustomFormikTextField
} from 'components';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import apiStatus from 'utils/apiStatus';
import { FastField, Formik } from 'formik';
import * as Yup from 'yup';
import { CustomTextField, CustomSelectField } from 'components/CustomFields';
import { GENDER_OPTIONS } from 'constants/options';
import CustomTextFormatField from 'components/CustomFields/CustomTextFormatField';
import { Link } from 'react-router-dom';

// eslint-disable-next-line no-undef
const emailAddressDomainName = window._env_.REACT_APP_EMAIL_ADDRESS_DOMAIN_NAME.split(',');

const useStyles = makeStyles((theme) => ({
  root: {},
  cardProfile: {},
  cardAction: {
    display: 'block',
    // textAlign: 'center'
  },
  form: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%'
    }
  },
  formControl: {
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  marginInput: {
    margin: '8px 0px !important'
  },
  formAction: {
    '& > *': {
      margin: theme.spacing(1)
    },
    padding: '20px',
    textAlign: 'right'
  },
  inputControl: {
    display: 'flex'
  },
  inputAction: {
    position: 'relative',
    bottom: '-30px'
  },
  textField: {
    // padding: '20px'
  },
  cancelButton: {
    float: 'right'
  },
  saveButton: {
    float: 'right'
  },
  resetPasswordButton: {
    backgroundColor: '#0069d9',
    '&:hover': {
      backgroundColor: '#0069d9',
      borderColor: '#0062cc',
      boxShadow: 'none',
    },
  }
}));

const ProfileInformation = (props) => {
  // eslint-disable-next-line
  const { profileFull, className, handleUpdateProfile, ...rest } = props;

  const classes = useStyles();

  //* show notification
  const { enqueueSnackbar } = useSnackbar();
  const showSnackbar = (message, status) => enqueueSnackbar(message, { variant: status });

  //* listen state
  const updateProfileStatus = useSelector((state) => state.profile.status);
  const updateProfileMessage = useSelector((state) => state.profile.message);
  const updateProfileError = useSelector((state) => state.profile.error);

  //* init values formik form
  let formikManagement = null;
  const [initialValues, setInitialValues] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    gender: 'male'
  });

  //* validate form
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().trim().required('First Name is required.'),
    lastName: Yup.string().trim().required('Last Name is required.'),
    email: Yup.string()
      .trim()
      .email('Invalid email address.')
      .required('Email is required.')
      .test(
        'email',
        `Email only ${emailAddressDomainName.toString().replace(/,/g, ', ')} domains are allowed.`,
        function () {
          if (this.parent.email) {
            const emailDomain = this.parent.email.split('@')[1];
            if (emailAddressDomainName.indexOf(emailDomain) === -1) return false;
            return true;
          }
          return true;
        }
      )
  });

  //* handle dialog form
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const handleCancelDialog = () => setDialogConfirm(false);
  const handleConfirmDialog = () => {
    setDialogConfirm(false);
    handleUpdateProfile(formikManagement.values);
  };

  //* handle submit form
  const handleSubmit = async () => {
    await formikManagement.validateForm();
    if (formikManagement.isValid) setDialogConfirm(true);
  };

  // handle reset password
  const handleResetPassword = () => {

  };

  useEffect(() => {
    setInitialValues({
      id: profileFull.id,
      firstName: profileFull.firstName,
      lastName: profileFull.lastName,
      email: profileFull.email,
      username: profileFull.username,
      gender: profileFull.gender
    });
  }, [profileFull]);

  //* listen status and show notification
  useEffect(() => {
    if (updateProfileStatus === apiStatus.SUCCESS && updateProfileMessage === 'Update profile success') showSnackbar(updateProfileMessage, 'success');
    if (updateProfileStatus === 'error') showSnackbar(updateProfileError, 'error');
    // eslint-disable-next-line
  }, [updateProfileStatus]);

  //* render ui
  return (
    <Grid item sm={8} xs={12}>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {(formik) => {
          formikManagement = formik;
          const { handleReset } = formik;
          return (
            <Card className={classes.cardProfile}>
              <form>
                <CardHeader title="Profile" />
                <Divider />
                <CardContent>
                  <Grid container spacing={4}>
                    <Grid style={{ padding: '8px' }} item md={6} xs={12}>
                      <FastField
                        className={classes.textField}
                        InputLabelProps={{ shrink: true }}
                        component={CustomTextField}
                        label="* First name"
                        name="firstName"
                        fullWidth
                        variant="outlined"
                        inputProps={{
                          style: {
                            padding: '20px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid style={{ padding: '8px' }} item md={6} xs={12}>
                      <FastField
                        className={classes.textField}
                        InputLabelProps={{ shrink: true }}
                        component={CustomTextField}
                        label="* Last name"
                        name="lastName"
                        fullWidth
                        variant="outlined"
                        inputProps={{
                          style: {
                            padding: '20px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid style={{ padding: '8px' }} item md={6} xs={12}>
                      <FastField
                        className={classes.textField}
                        InputLabelProps={{ shrink: true }}
                        component={CustomTextField}
                        label="* Username"
                        name="username"
                        fullWidth
                        variant="outlined"
                        inputProps={{
                          disabled: true,
                          style: {
                            padding: '20px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid style={{ padding: '8px' }} item md={6} xs={12}>
                      <FastField
                        className={classes.textField}
                        InputLabelProps={{ shrink: true }}
                        component={CustomTextField}
                        label="* Email"
                        name="email"
                        fullWidth
                        variant="outlined"
                        inputProps={{
                          style: {
                            padding: '20px'
                          }
                        }}
                      />
                    </Grid>
                    <Grid style={{ padding: '8px', margin: '8px 0px 4px' }} item md={6} xs={12}>
                      <FastField
                        className={classes.textField}
                        InputLabelProps={{ shrink: true }}
                        component={CustomSelectField}
                        label="Gender"
                        name="gender"
                        fullWidth
                        variant="outlined"
                        options={GENDER_OPTIONS}
                        style={{
                          height: '56px',
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
                <Divider />
                <CardActions className={classes.cardAction}>
                  <Link to={'/change-password'}>
                    <Button
                      onClick={handleResetPassword}
                      color="secondary"
                      type="button"
                      className={classes.resetPasswordButton}
                      variant="contained"
                    >
                    Change Password
                    </Button>
                  </Link>
                  <Button
                    className={classes.saveButton}
                    color="primary"
                    type="button"
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!formikManagement.isValid}
                  >
                    Update
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="contained"
                    className={classes.cancelButton}
                  >
                    Cancel
                  </Button>
                </CardActions>
              </form>
              <DialogConfirm
                handleClose={handleCancelDialog}
                handleConfirm={handleConfirmDialog}
                message={'Saving changes'}
                open={dialogConfirm}
              />
            </Card>
          );
        }}
      </Formik>
    </Grid>
  );
};

ProfileInformation.propTypes = {
  className: PropTypes.string,
  profileFull: PropTypes.object,
  handleUpdateProfile: PropTypes.func
};

export default ProfileInformation;
