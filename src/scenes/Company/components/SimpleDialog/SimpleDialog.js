import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { Typography, Dialog } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { FastField, Form, Formik } from 'formik';
import { CustomTextField, CustomSelectField } from 'components/CustomFields';
import { CustomButton, DialogConfirm } from 'components';
import { Cancel, Save } from '@material-ui/icons';
import { STATUS_OPTIONS } from 'constants/options';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 500
  },
  textField: {
    marginBottom: theme.spacing(3.5),
    marginTop: '0px',
    '&& .MuiFormHelperText-root.MuiFormHelperText-contained.Mui-error.MuiFormHelperText-marginDense':
      {
        position: 'absolute',
        top: '100%'
      }
  },
  group: {
    display: 'flex',
    marginBottom: theme.spacing(2),
    marginTop: '0px',
    '&& .MuiFormHelperText-root.MuiFormHelperText-contained.Mui-error': {
      position: 'absolute',
      top: '100%'
    }
  },
  signature: {
    marginRight: theme.spacing(1)
  },
  status: {
    marginLeft: theme.spacing(1)
  },
  content: {
    padding: '5px 0px'
  },
  label: {
    fontWeight: 'bold'
  },
  wrapperInput: {
    display: 'flex',
    alignItems: 'center'
  },
  listCustomFields: {
    height: '140px',
    overflow: 'auto'
  },
  customFieldItem: {
    margin: '5px 3px'
  },
  icon: {
    color: '#fff'
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'row'
  },
  companyInfor: {
    flex: '1',
    paddingRight: theme.spacing(1)
  },
  appInfor: {
    flex: '1',
    paddingLeft: theme.spacing(1)
  },
  titleGroupContent: {
    textAlign: 'center',
    marginBottom: theme.spacing(2)
  }
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    maxWidth: '450px'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle className={classes.root} disableTypography {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    minWidth: '450px'
  }
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

const validationCreateSchema = Yup.object().shape({
  name: Yup.string().trim().required('Name is required.'),
  phone: Yup.lazy((value) => {
    const regexpPlus = /^\+\d{11}$/gi;
    const regexp = /^\d{10}$/gi;

    if (value && value[0] === '+') {
      return Yup.string()
        .required('Phone is required.')
        .matches(regexpPlus, 'Phone number is invalid.');
    } else {
      return Yup.string()
        .required('Phone is required.')
        .matches(regexp, 'Phone number is invalid.');
    }
  }),
  code: Yup.string().required('Code is required.'),
  signature: Yup.string().trim().required('Signature is required.'),
  server: Yup.string().trim().required('Server is required.'),
  clientId: Yup.string().trim().required('Client Id is required.'),
  clientSecret: Yup.string().trim().required('Client Secret is required.'),
  username: Yup.string().trim().required('Username is required.'),
  password: Yup.string().trim().required('Password is required.'),
  dlrAddress: Yup.string().trim().required('Dlr Address is required.'),
  dlrMTT: Yup.string().trim().required('Dlr MTT is required.')
});

const validationUpdateSchema = Yup.object().shape({
  name: Yup.string().trim().required('Name is required.'),
  phone: Yup.lazy((value) => {
    const regexpPlus = /^\+\d{11}$/gi;
    const regexp = /^\d{10}$/gi;

    if (value && value[0] === '+') {
      return Yup.string()
        .required('Phone is required.')
        .matches(regexpPlus, 'Phone number is invalid.');
    } else {
      return Yup.string()
        .required('Phone is required.')
        .matches(regexp, 'Phone number is invalid.');
    }
  }),
  code: Yup.string().required('Code is required.'),
  signature: Yup.string().trim().required('Signature is required.'),
  server: Yup.string().trim().required('Server is required.'),
  username: Yup.string().trim().required('Username is required.'),
  dlrAddress: Yup.string().trim().required('Dlr Address is required.'),
  dlrMTT: Yup.string().trim().required('Dlr MTT is required.')
});

const initialValues = {
  name: '',
  phone: '',
  code: '',
  description: '',
  signature: '',
  status: 'active',
  server: '',
  clientId: '',
  clientSecret: '',
  username: '',
  password: '',
  extension: '',
  dlrAddress: '',
  dlrMTT: ''
};
function SimpleDialog(props) {
  const { open, onClose, recordEditing, onSubmit, errorResponses } = props;
  const classes = useStyles();

  const signatures = useSelector((state) => state.signature.signatures).map(
    (item) => ({ value: item.id, label: item.name })
  );

  let formikManagement = null;
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const handleSubmitForm = async () => {
    if (onSubmit) setDialogConfirm(true);
  };
  const handleClose = () => {
    formikManagement.resetForm();
    onClose();
  };
  const handleConfirmDialog = async (values) => {
    if (onSubmit) {
      onSubmit(values);
      setDialogConfirm(false);
    }
  };
  const handleCloseDialogConfirm = () => setDialogConfirm(false);

  useEffect(() => {
    errorResponses.map((item) => {
      formikManagement.setFieldError(item.property, item.message);
    });
  }, [errorResponses]);

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={recordEditing || initialValues}
        validationSchema={
          recordEditing ? validationUpdateSchema : validationCreateSchema
        }
        onSubmit={handleSubmitForm}
      >
        {(formikProps) => {
          formikManagement = formikProps;
          return (
            <Dialog
              aria-labelledby="customized-dialog-title"
              open={open}
              maxWidth={'md'}
            >
              <DialogTitle id="customized-dialog-title">
                {recordEditing ? 'Update Company' : 'Create Company'}
              </DialogTitle>
              <Form>
                <DialogContent className={classes.dialogContent} dividers>
                  <div className={classes.companyInfor}>
                    <div className={classes.titleGroupContent}>
                      Company Information
                    </div>
                    <FastField
                      className={classes.textField}
                      name="name"
                      component={CustomTextField}
                      label="* Name"
                      type="text"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                    <FastField
                      className={classes.textField}
                      name="code"
                      component={CustomTextField}
                      label="* Code"
                      type="text"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                    <div className={classes.group}>
                      <FastField
                        component={CustomSelectField}
                        label="* Default signature"
                        name="signature"
                        options={signatures}
                        className={classes.signature}
                        placeholder="Select type"
                      />
                      <FastField
                        component={CustomSelectField}
                        label="Status"
                        name="status"
                        className={classes.status}
                        options={STATUS_OPTIONS}
                      />
                    </div>
                    <FastField
                      className={classes.textField}
                      name="phone"
                      component={CustomTextField}
                      label="* Phone"
                      type="phone"
                      disable={!!recordEditing}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                    <FastField
                      className={classes.textField}
                      name="description"
                      component={CustomTextField}
                      label="Description"
                      multiline
                      rows={3}
                      maxRows={10}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </div>
                  <div className={classes.appInfor}>
                    <div className={classes.titleGroupContent}>
                      App Information
                    </div>
                    <FastField
                      className={classes.textField}
                      name="server"
                      component={CustomTextField}
                      label="* Server"
                      type="text"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                    <FastField
                      className={classes.textField}
                      name="clientId"
                      component={CustomTextField}
                      label={(recordEditing ? '' : '* ') + 'Client Id'}
                      type="password"
                      InputLabelProps={{
                        shrink: true
                      }}
                      placeholder={recordEditing ? '********' : ''}
                    />
                    <FastField
                      className={classes.textField}
                      name="clientSecret"
                      component={CustomTextField}
                      label={(recordEditing ? '' : '* ') + 'Client Secret'}
                      type="password"
                      InputLabelProps={{
                        shrink: true
                      }}
                      placeholder={recordEditing ? '********' : ''}
                    />
                    <div style={{ display: 'flex' }}>
                      <FastField
                        className={classes.textField}
                        name="username"
                        component={CustomTextField}
                        label="* Username"
                        type="text"
                        InputLabelProps={{
                          shrink: true
                        }}
                        styles={{ marginRight: '8px' }}
                      />
                      <FastField
                        className={classes.textField}
                        name="extension"
                        component={CustomTextField}
                        label="Extension"
                        type="text"
                        InputLabelProps={{
                          shrink: true
                        }}
                        styles={{ marginLeft: '8px' }}
                      />
                    </div>
                    <FastField
                      className={classes.textField}
                      name="password"
                      component={CustomTextField}
                      label={(recordEditing ? '' : '* ') + 'Password'}
                      type="password"
                      InputLabelProps={{
                        shrink: true
                      }}
                      placeholder={recordEditing ? '********' : ''}
                    />
                    <FastField
                      className={classes.textField}
                      name="dlrAddress"
                      component={CustomTextField}
                      label="* Dlr Address"
                      type="text"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                    <FastField
                      className={classes.textField}
                      name="dlrMTT"
                      component={CustomTextField}
                      label="* Dlr MTT"
                      type="text"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </div>
                </DialogContent>

                <DialogActions>
                  <CustomButton
                    content="Cancel"
                    onClick={handleClose}
                    theme="gray-full"
                    variant="contained"
                  >
                    <Cancel className={classes.icon} />
                  </CustomButton>
                  <CustomButton
                    content={recordEditing ? 'Save Change' : 'Create New'}
                    onClick={formikProps.handleSubmit}
                    theme="blue-full"
                    variant="contained"
                    disabled={!formikProps.isValid}
                  >
                    <Save className={classes.icon} />
                  </CustomButton>
                </DialogActions>
              </Form>
              <DialogConfirm
                handleClose={handleCloseDialogConfirm}
                handleConfirm={() => handleConfirmDialog(formikProps.values)}
                message={
                  recordEditing
                    ? 'Update company in system'
                    : 'Create new company in system'
                }
                open={dialogConfirm}
              />
            </Dialog>
          );
        }}
      </Formik>
    </div>
  );
}

SimpleDialog.propTypes = {
  recordEditing: PropTypes.object,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  errorResponses: PropTypes.array
};
SimpleDialog.defaultProps = {
  open: true,
  onClose: null,
  onSubmit: null
};
export default SimpleDialog;
