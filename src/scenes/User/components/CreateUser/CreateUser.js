/* eslint-disable prettier/prettier */
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  Divider,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from '@material-ui/core';
import { Cancel, Save } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import clsx from 'clsx';
import { CustomButton, DialogConfirm } from 'components';
import {
  CustomMultiCheckBoxField,
  CustomTextField
} from 'components/CustomFields';
import CustomSelectField from 'components/CustomFields/CustomSelectField';
import { FastField, Field, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUser } from 'scenes/User/User.asyncActions';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
    overflow: 'auto'
    // width: '1200px'
  },
  dialog: {
    display: 'flex',
    flexDirection: 'column'
  },
  dialogContent: {
    display: 'flex',
    overflowY: 'auto'
  },
  cardColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  textTableContent: {
    width: '300px'
  },
  permissionTable: {
    marginLeft: '30px',
    border: '1.5px solid',
    height: '100%',
    padding: '10px 10px'
  },
  textFieldResource: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1)
  },
  textField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  button: {
    justifyContent: 'flex-end'
  },
  listItem: {
    marginBottom: 5
    // boxShadow: '1px 1px 3px #ccc'
  },
  list: {
    // marginTop: theme.spacing(1),
    maxWidth: 360,
    maxHeight: '380px',
    backgroundColor: theme.palette.background.paper,
    marginLeft: '5%',
    overflow: 'auto',
    position: 'relative',
    '&::-webkit-scrollbar': {
      width: '5px'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 5px grey'
    },
    '&:-webkit-scrollbar-thumb': {
      background: theme.palette.primary.main
    }
  }
}));

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  status: 'active',
  gender: 'male',
  role: [],
  permission: [],
  companies: []
};

const AddUser = (props) => {
  const {
    change,
    open,
    permission,
    role,
    status,
    message,
    openUserInformationDialog,
    ...rest
  } = props;

  const classes = useStyles();
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.company.companies);

  let formikManagement = null;

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().trim().required('First name is required.'),
    lastName: Yup.string().trim().required('Last name is required.'),
    email: Yup.string()
      .trim()
      .email('Invalid email.')
      .required('Email is required.'),
    username: Yup.string().trim().required('Username is required.')
  });

  const [active, setActive] = useState({
    open: false,
    change: ''
  });
  const [checked, setChecked] = useState([]);
  const [permissionChecked, setPermissionChecked] = useState([]);

  const handleCloseEditUser = () => {
    setActive({
      ...active,
      open: false
    });
  };

  const handleToggle = (value) => async () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handlePermissionToggle = (value) => async () => {
    const currentIndex = permissionChecked.indexOf(value);
    const newChecked = [...permissionChecked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setPermissionChecked(newChecked);
  };
  //* handle dialog form
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const handleCancelDialog = () => setDialogConfirm(false);
  const handleConfirmDialog = async () => {
    setDialogConfirm(false);
    try {
      const result = await dispatch(createUser(formikManagement.values));
      const dataUser = unwrapResult(result);

      const userInformation = {
        'First Name': dataUser?.firstName,
        'Last Name': dataUser?.lastName,
        'Username': dataUser?.username,
        'Password': dataUser?.initialPassword,
        'Gender': dataUser?.gender,
        'Status': dataUser?.status,
      };

      openUserInformationDialog(userInformation);

      handleCloseEditUser();
    } catch (error) {
      console.log(error);
    }
    handleCloseEditUser();
  };

  const handleSubmit = async () => {
    formikManagement.setSubmitting(true);
    await formikManagement.validateForm();

    if (formikManagement.isValid && formikManagement.dirty) {
      setDialogConfirm(true);
    }
  };

  useEffect(() => {
    const setValuePermission = async () => {
      if (formikManagement) {
        await formikManagement.setFieldValue('role', checked);
        await formikManagement.setFieldValue('permission', permissionChecked);
      }
    };
    setValuePermission();
  }, [checked, permissionChecked]);

  useEffect(() => {
    setActive({
      open: open,
      change: change
    });
    setChecked([]);
    setPermissionChecked([]);
    // eslint-disable-next-line
  }, [change]);

  useEffect(() => {
    if (status === 'success' && message === 'Create user success') {
      setActive({
        ...active,
        open: false
      });
    }
  }, [status]);

  return (
    <div>
      <Dialog
        {...rest}
        aria-labelledby="max-width-dialog-title"
        className={classes.root}
        open={active.open}
        fullWidth
        maxWidth="lg"
      >
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
        >
          {(formik) => {
            // eslint-disable-next-line
            formikManagement = formik;
            // const {values} = formik;
            return (
              <Card className={classes.dialog}>
                <CardHeader title="Create User" />
                <Divider />
                <CardContent className={classes.dialogContent}>
                  <div
                    className={clsx(
                      classes.textTableContent,
                      classes.cardColumn
                    )}
                    style={{ flex: '1' }}
                  >
                    <Field
                      className={classes.textFieldResource}
                      component={CustomTextField}
                      label="* First Name"
                      name="firstName"
                      styles={{ marginTop: 0 }}
                    />
                    <Field
                      className={classes.textFieldResource}
                      component={CustomTextField}
                      label="* Last Name"
                      name="lastName"
                    />
                    <Field
                      className={classes.textFieldResource}
                      component={CustomTextField}
                      label="* Email"
                      name="email"
                    />
                    <Field
                      className={classes.textFieldResource}
                      component={CustomTextField}
                      label="* Username"
                      name="username"
                    />
                    <FastField
                      className={classes.textField}
                      component={CustomSelectField}
                      label="Gender"
                      name="gender"
                      options={[
                        {
                          value: 'male',
                          label: 'Male'
                        },
                        {
                          value: 'female',
                          label: 'Female'
                        },
                        {
                          value: 'other',
                          label: 'Other'
                        }
                      ]}
                      placeholder="Select Gender"
                    />
                    <FastField
                      className={classes.textField}
                      component={CustomSelectField}
                      label="Status"
                      name="status"
                      options={[
                        {
                          value: 'active',
                          label: 'Active'
                        },
                        {
                          value: 'inactive',
                          label: 'Inactive'
                        }
                      ]}
                      placeholder="Select Status"
                    />
                  </div>
                  <Card
                    style={{ flex: '1', textAlign: 'center', marginLeft: '2%' }}
                    className={classes.cardColumn}
                  >
                    <CardHeader title="Roles" />
                    <Divider />
                    <List dense className={classes.list}>
                      {role.map((value) => {
                        const labelId = `checkbox-list-secondary-label-${value.role.slice(
                          5
                        )}`;
                        return (
                          <ListItem
                            className={classes.listItem}
                            key={value.role}
                            onClick={handleToggle(value.role)}
                            button
                          >
                            <ListItemText
                              id={labelId}
                              primary={value.role.slice(5)}
                            />
                            <ListItemSecondaryAction>
                              <Checkbox
                                edge="end"
                                onChange={handleToggle(value.role)}
                                checked={checked.indexOf(value.role) !== -1}
                                inputProps={{ 'aria-labelledby': labelId }}
                              />
                            </ListItemSecondaryAction>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Card>
                  <Card
                    style={{ flex: '1', textAlign: 'center', marginLeft: '2%' }}
                    className={classes.cardColumn}
                  >
                    <CardHeader title="Permissions" />
                    <Divider />
                    <List dense className={classes.list} style={{ flex: '1' }}>
                      {permission.map((value) => {
                        const labelId = `checkbox-list-secondary-label-${value[0]}`;
                        return (
                          <ListItem
                            className={classes.listItem}
                            key={value}
                            onClick={handlePermissionToggle(
                              value[1].indexOf('own') >= 0
                                ? `${value[2]} own ${value[1].slice(
                                  0,
                                  value[1].indexOf(':')
                                )} ${value[0].slice(1)}`
                                : `${value[2]} any ${value[1].slice(
                                  0,
                                  value[1].indexOf(':')
                                )} ${value[0].slice(1)}`
                            )}
                            button
                          >
                            <ListItemText
                              id={labelId}
                              primary={
                                value[1].indexOf('own') >= 0
                                  ? `${value[2]} own ${value[1].slice(
                                    0,
                                    value[1].indexOf(':')
                                  )} ${value[0].slice(1)}`
                                  : `${value[2]} any ${value[1].slice(
                                    0,
                                    value[1].indexOf(':')
                                  )} ${value[0].slice(1)}`
                              }
                            />
                            <ListItemSecondaryAction>
                              <Checkbox
                                edge="end"
                                onChange={handlePermissionToggle(
                                  value[1].indexOf('own') >= 0
                                    ? `${value[2]} own ${value[1].slice(
                                      0,
                                      value[1].indexOf(':')
                                    )} ${value[0].slice(1)}`
                                    : `${value[2]} any ${value[1].slice(
                                      0,
                                      value[1].indexOf(':')
                                    )} ${value[0].slice(1)}`
                                )}
                                checked={
                                  permissionChecked.indexOf(
                                    value[1].indexOf('own') >= 0
                                      ? `${value[2]} own ${value[1].slice(
                                        0,
                                        value[1].indexOf(':')
                                      )} ${value[0].slice(1)}`
                                      : `${value[2]} any ${value[1].slice(
                                        0,
                                        value[1].indexOf(':')
                                      )} ${value[0].slice(1)}`
                                  ) !== -1
                                }
                                inputProps={{ 'aria-labelledby': labelId }}
                              />
                            </ListItemSecondaryAction>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Card>
                  <Card
                    style={{ flex: '1', textAlign: 'center', marginLeft: '2%' }}
                    className={classes.cardColumn}
                  >
                    <CardHeader title="Companies" />
                    <Divider />
                    <FastField
                      // className={classes.textField}
                      name="companies"
                      component={CustomMultiCheckBoxField}
                      options={companies.map((item) => ({
                        label: item.name,
                        value: item.id
                      }))}
                    />
                  </Card>
                </CardContent>
                <Divider />
                <CardActions className={classes.button}>
                  <CustomButton
                    content="Cancel"
                    onClick={handleCloseEditUser}
                    theme="gray-full"
                    variant="contained"
                  >
                    <Cancel className={classes.icon} />
                  </CustomButton>
                  <CustomButton
                    content="Create New"
                    onClick={handleSubmit}
                    theme="blue-full"
                    variant="contained"
                    disabled={!formikManagement.isValid}
                  >
                    <Save className={classes.icon} />
                  </CustomButton>
                </CardActions>
              </Card>
            );
          }}
        </Formik>
        <DialogConfirm
          handleClose={handleCancelDialog}
          handleConfirm={handleConfirmDialog}
          message={'Create user in system'}
          open={dialogConfirm}
        />
      </Dialog>
    </div>
  );
};

AddUser.prototype = {};

export default AddUser;
