/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
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
import clsx from 'clsx';
import { CustomButton, GroupInput } from 'components';
import { Cancel, Save } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    padding: '5px 0px'
  },
  label: {
    fontWeight: 'bold'
  },
  dateAndTime: {
    display: 'flex',
    marginBottom: '15px'
  },
  timeField: {
    marginLeft: '5px'
  },
  textField: {
    marginBottom: '15px',
    marginTop: '0px'
  },
  wrapperInput: {
    display: 'flex',
    width: '100%'
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
  content: '',
  attachments: [],
  customers: [],
  customFields: [
    {
      field: '',
      column: ''
    },
    {
      field: '',
      column: ''
    }
  ],
  date: new Date().toISOString().slice(0, 10),
  time: ''
};
function SimpleDialog({ open, onClose, recordEditing, onSubmit }) {
  const classes = useStyles();
  const handleClose = () => {
    onClose();
  };
  const handleSubmit = (values) => {
    if (onSubmit) onSubmit(values);
  };

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={recordEditing || initialValues}
        onSubmit={handleSubmit}
      >
        {(formikProps) => {
          return (
            <Dialog aria-labelledby="customized-dialog-title" open={open}>
              <DialogTitle id="customized-dialog-title">
                {recordEditing ? 'Update' : 'Create new'}
              </DialogTitle>
              <Form>
                <DialogContent dividers>
                  <FastField
                    className={classes.textField}
                    name="name"
                    component={CustomTextField}
                    label="Name"
                    type="text"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                  <FastField
                    className={classes.textField}
                    name="content"
                    component={CustomTextField}
                    label="Content"
                    multiline
                    maxRows={10}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                  <div className={classes.dateAndTime}>
                    <GroupInput label="Start at">
                      <div className={classes.wrapperInput}>
                        <FastField
                          name="date"
                          component={CustomTextField}
                          label="Date"
                          type="date"
                          InputLabelProps={{
                            shrink: true
                          }}
                          inputProps={{
                            min: `${new Date().toISOString().slice(0, 10)}`
                          }}
                        />
                        <FastField
                          className={classes.timeField}
                          name="time"
                          component={CustomTextField}
                          label="Time"
                          type="time"
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      </div>
                    </GroupInput>
                  </div>
                  {!recordEditing && (
                    <FastField
                      name="customers"
                      component={FileUploadField}
                      label="Choose or drag customer file"
                    />
                  )}
                  <FastField
                    component={AttachmentsUploadField}
                    label=""
                    name="attachments"
                    attachments={recordEditing && recordEditing.attachments}
                  />
                  <FastField
                    className={classes.textField}
                    component={GroupInputField}
                    label=""
                    name="customFields"
                    customFields={recordEditing && recordEditing.customFields}
                  />
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
                  <Button
                    content={recordEditing ? 'Save Change' : 'Create New'}
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    <Save className={classes.icon} />
                  </Button>
                </DialogActions>
              </Form>
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
  onClose: PropTypes.func
};
SimpleDialog.defaultProps = {
  open: true,
  onClose: null,
  onSubmit: null
};
export default SimpleDialog;
