/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { Typography, Dialog, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import { FastField, Form, Formik } from 'formik';
import {
  CustomTextField,
  FileUploadField,
  AttachmentsUploadField,
  GroupInputField
} from 'components/CustomFields';
import CustomSelectField from 'components/CustomFields/CustomSelectField';
import { STATUS_OPTIONS, TYPE_OPTIONS } from 'constants/options';
import { CustomButton, DialogConfirm } from 'components';
import { Cancel, Save } from '@material-ui/icons';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import apiStatus from 'utils/apiStatus';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textField: {
    margin: theme.spacing(2, 0, 1.5)
  },
  content: {
    padding: theme.spacing(1, 0)
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
    maxWidth: '450px'
  }
}))(MuiDialogContent);
const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);
const initialValues = {
  name: '',
  value: '',
  status: 'active'
};

function SimpleDialog({ open, onClose, title, recordEditing, onSubmit }) {
  const classes = useStyles();
  const handleClose = () => onClose();

  let formikManagement = null;

  //* handle dialog form
  const [dialogConfirm, setDialogConfirm] = useState(false);

  const handleCancelDialog = () => setDialogConfirm(false);
  const handleConfirmDialog = () => {
    onSubmit(formikManagement.values);
    setDialogConfirm(false);
  };

  //* validate form
  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Name is required.'),
    value: Yup.string().trim().required('Value is required.')
  });

  const handleReset = async () => {
    handleClose();
    formikManagement.handleReset();
  };

  const handleSubmitForm = async () => {
    await formikManagement.validateForm();
    if (formikManagement.isValid) setDialogConfirm(true);
  };

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={recordEditing || initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmitForm}
      >
        {(formik) => {
          formikManagement = formik;
          const { handleSubmit } = formik;
          return (
            <Dialog aria-labelledby="customized-dialog-title" open={open}>
              <DialogTitle id="customized-dialog-title">{title}</DialogTitle>
              <Form>
                <DialogContent dividers>
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
                    name="value"
                    component={CustomTextField}
                    label="* Value"
                    multiline
                    maxRows={10}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                  <div style={{ display: 'flex', margin: '16px 0px 12px' }}>
                    <FastField
                      component={CustomSelectField}
                      label="Status"
                      name="status"
                      options={STATUS_OPTIONS}
                    />
                  </div>
                </DialogContent>

                <DialogActions>
                  <CustomButton
                    content="Cancel"
                    onClick={handleReset}
                    theme="gray-full"
                    variant="contained"
                  >
                    <Cancel className={classes.icon} />
                  </CustomButton>
                  <CustomButton
                    content={recordEditing ? 'Save Change' : 'Create New'}
                    onClick={handleSubmit}
                    theme="blue-full"
                    variant="contained"
                    disabled={!formikManagement.isValid}
                  >
                    <Save className={classes.icon} />
                  </CustomButton>
                </DialogActions>
              </Form>
            </Dialog>
          );
        }}
      </Formik>
      <DialogConfirm
        handleClose={handleCancelDialog}
        handleConfirm={handleConfirmDialog}
        message={recordEditing ? 'Update signature in system' : 'Create new signature in system'}
        open={dialogConfirm}
      />
    </div>
  );
}

SimpleDialog.propTypes = {
  recordEditing: PropTypes.object,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  title: PropTypes.string
};

SimpleDialog.defaultProps = {
  open: true,
  onClose: null,
  onSubmit: null,
  title: 'Title From'
};
export default SimpleDialog;
