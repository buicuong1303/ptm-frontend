import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  colors,
  Dialog,
  Divider,
  InputAdornment
} from '@material-ui/core';
import { Cancel, Save } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { CustomButton, DialogConfirm } from 'components';
import { CustomTextField } from 'components/CustomFields';
import CustomSelectField from 'components/CustomFields/CustomSelectField';
// import { CustomSelectField } from 'components/CustomFields';
import { FastField, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPermission } from 'scenes/Permission/Permission.asyncActions';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto'
    // width: '1000px'
  },
  button: {
    // marginLeft: '30%',
    // marginRight: '30%',
    justifyContent: 'flex-end'
  },
  groupInput: {
    marginTop: '8px',
    width: '100%',
    display: 'flex',
    flexDirection: 'row'
  },
  action: {
    marginRight: theme.spacing(1)
  },
  effect: {
    marginLeft: theme.spacing(1)
  },
  textField: {
    marginBottom: theme.spacing(1),
    // marginLeft: '5%',
    // marginRight: '5%',
    width: '50%'
  },
  textFieldResource: {
    margin: theme.spacing(1, 0, 2),
    // marginLeft: '5%',
    // marginRight: '5%',
    width: '100%'
  },
  totalTextField: {
    marginBottom: theme.spacing(1),
    marginLeft: '5%',
    // marginRight: '5%',
    width: '43%',
    color: '#D69999'
  },
  dialogContent: {
    // backgroundColor: theme.palette.error.main,
    paddingBottom: theme.spacing(4),
    flexWrap: 'wrap'
  },
  dialogTitle: {
    textAlign: 'center',
    fontSize: '20px'
  },
  formTextField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: '5%',
    width: '43%'
  },
  status: {
    marginLeft: '10%'
  },
  menuItem: {
    '&:hover': {
      backgroundColor: colors.grey[500]
    }
  }
}));

const AddPermission = (props) => {
  const { change, open, ...rest } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  let formikManagement = null;
  const [active, setActive] = useState({
    open: false,
    change: ''
  });
  const initialValues = {
    name: '',
    action: 'create',
    resource: '',
    effect: 'allow',
    procession: 'any'
  };
  const validationSchema = Yup.object().shape({
    resource: Yup.string().trim().required('Resource is required.')
  });

  const handleCloseAddPermission = () => {
    setActive({
      ...active,
      open: false
    });
  };

  //* confirm dialog
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const handleConfirmDialog = () => {
    dispatch(addPermission(formikManagement.values));
    setDialogConfirm(false);
    handleCloseAddPermission();
  };
  const handleCloseDialog = () => setDialogConfirm(false);
  const handleSubmit = async () => {
    formikManagement.setSubmitting(true);
    await formikManagement.validateForm();
    if (formikManagement.isValid && formikManagement.dirty)
      setDialogConfirm(true);
  };

  useEffect(() => {
    setActive({
      open: open,
      change: change
    });
    // eslint-disable-next-line
  }, [change]);

  // useEffect(() => {
  //   if (status === 'success' && message === 'Create permission success') {
  //     setActive({
  //       ...active,
  //       open: false
  //     });
  //   }
  // }, [status]);

  return (
    <div>
      <Dialog
        {...rest}
        aria-labelledby="max-width-dialog-title"
        className={classes.root}
        open={active.open}
        fullWidth
        maxWidth="sm"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {(formik) => {
            // eslint-disable-next-line
            formikManagement = formik;
            return (
              <Form>
                <Card>
                  <CardHeader title="Create Permission" />
                  <Divider />
                  <CardContent className={classes.dialogContent}>
                    <Field
                      className={classes.textFieldResource}
                      component={CustomTextField}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">/</InputAdornment>
                        )
                      }}
                      label="* Resource"
                      name="resource"
                    />
                    <div className={classes.groupInput}>
                      <FastField
                        className={clsx(classes.textField, classes.action)}
                        component={CustomSelectField}
                        label="Action"
                        name="action"
                        options={[
                          {
                            value: 'read',
                            label: 'Read'
                          },
                          {
                            value: 'update',
                            label: 'Update'
                          },
                          {
                            value: 'delete',
                            label: 'Delete'
                          },
                          {
                            value: 'create',
                            label: 'Create'
                          }
                        ]}
                        placeholder="Select team"
                      />
                      <FastField
                        className={clsx(classes.textField, classes.effect)}
                        component={CustomSelectField}
                        label="Effect"
                        name="effect"
                        options={[
                          {
                            value: 'allow',
                            label: 'Allow'
                          }
                          // {
                          //   value: 'deny',
                          //   label: 'Deny'
                          // }
                        ]}
                        placeholder="Select team"
                      />
                    </div>
                  </CardContent>
                </Card>
                <CardActions className={classes.button}>
                  <CustomButton
                    onClick={handleCloseAddPermission}
                    content="Cancel"
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
                    style={{ marginRight: '0px' }}
                    disabled={!formikManagement.isValid}
                  >
                    <Save className={classes.icon} />
                  </CustomButton>
                </CardActions>
              </Form>
            );
          }}
        </Formik>
      </Dialog>
      <DialogConfirm
        handleClose={handleCloseDialog}
        handleConfirm={handleConfirmDialog}
        message="Create new permission in system"
        open={dialogConfirm}
      />
    </div>
  );
};

AddPermission.prototype = {};

export default AddPermission;
