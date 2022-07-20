/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { Typography, Dialog, Button } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { FastField, Form, Formik } from 'formik';
import { CustomTextField, CustomSelectField } from 'components/CustomFields';
import { CustomButton, DialogConfirm } from 'components';
import { Cancel, Save } from '@material-ui/icons';
import { STATUS_OPTIONS } from 'constants/options';
import * as Yup from 'yup';
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 500
  },
  textField: {
    marginBottom: theme.spacing(2),
    marginTop: '0px'
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

function GroupDialog({ open, onClose, recordEditing, onSubmit }) {
  let initialValues = {
    name: '',
    description: '',
    status: 'active'
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Name is required.')
  });
  const classes = useStyles();
  let formikManagement = null;
  const handleClose = () => {
    onClose();
    formikManagement.resetForm();
  };
  //* handle dialog form
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const [valueSubmit, setValueSubmit] = useState(false);
  const handleCancelDialog = () => setDialogConfirm(false);
  const handleConfirmDialog = () => {
    setDialogConfirm(false);
    onSubmit(valueSubmit.values);
    valueSubmit.resetForm();
    handleClose();
  };
  const handleSubmit = async (values, { resetForm }) => {
    formikManagement.setSubmitting(true);
    await formikManagement.validateForm();
    if (onSubmit) {
      setDialogConfirm(true);
      setValueSubmit({
        values: values,
        resetForm: resetForm
      });
      // onSubmit(values);
      // resetForm();
    }
  };
  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={recordEditing || initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {(formikProps) => {
          formikManagement = formikProps;
          return (
            <Dialog aria-labelledby="customized-dialog-title" open={open}>
              <DialogTitle id="customized-dialog-title">
                {recordEditing ? 'Update Group' : 'Create Group'}
              </DialogTitle>
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
                  <FastField
                    component={CustomSelectField}
                    label="Status"
                    name="status"
                    options={STATUS_OPTIONS}
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
                  <Button type="submit" variant="contained" color="primary">
                    <Save className={classes.icon} />
                    <h4 style={{ textTransform: 'capitalize' }}>
                      {recordEditing ? 'Save Change' : 'Create New'}
                    </h4>
                  </Button>
                </DialogActions>
              </Form>
              <DialogConfirm
                handleClose={handleCancelDialog}
                handleConfirm={handleConfirmDialog}
                message={
                  recordEditing
                    ? 'Update group in system'
                    : 'Create new group in system'
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
GroupDialog.propTypes = {
  recordEditing: PropTypes.object,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func
};
GroupDialog.defaultProps = {
  open: true,
  onClose: null,
  onSubmit: null
};
export default GroupDialog;
