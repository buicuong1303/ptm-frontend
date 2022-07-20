import React, { useState } from 'react';
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
import { CustomTextField } from 'components/CustomFields';
import CustomSelectField from 'components/CustomFields/CustomSelectField';
import {
  STATUS_OPTIONS,
  SENSITIVE_TYPE,
  DIRECTION_OPTIONS
} from 'constants/options';
import { CustomButton, DialogConfirm } from 'components';
import { Cancel, Save } from '@material-ui/icons';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textField: {
    margin: theme.spacing(1, 0, 2),
    width: '400px'
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
  sensitiveKey: '',
  type: '',
  direction: 'outbound',
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
    formikManagement.handleReset();
    setDialogConfirm(false);
  };

  //* validate form
  const validationSchema = Yup.object().shape({
    sensitiveKey: Yup.string()
      .trim()
      .required('Sensitive key is required.')
      .test('sensitiveKey', 'Enter only one word if it is normal.', (value) => {
        if (value && value.indexOf(' ') > 0) {
          if (formikManagement.values.type === 'normal') {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      }),
    type: Yup.string().trim().required('Type is required.')
  });

  const handleReset = async () => {
    handleClose();
    formikManagement.handleReset();
  };

  const handleSubmitForm = async () => {
    await formikManagement.validateForm();
    if (formikManagement.isValid) {
      setDialogConfirm(true);
    }
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
            <Dialog
              maxWidth="md"
              aria-labelledby="customized-dialog-title"
              open={open}
            >
              <DialogTitle id="customized-dialog-title">{title}</DialogTitle>
              <Form>
                <DialogContent dividers>
                  <FastField
                    className={classes.textField}
                    name="sensitiveKey"
                    component={CustomTextField}
                    label="* Sensitive Key"
                    type="text"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                  {/* <FastField
                    className={classes.textField}
                    name="type"
                    component={CustomTextField}
                    label="* Type"
                    multiline
                    maxRows={10}
                    InputLabelProps={{
                      shrink: true
                    }}
                  /> */}
                  <div style={{ display: 'flex' }}>
                    <FastField
                      className={classes.textField}
                      component={CustomSelectField}
                      label="* Type"
                      name="type"
                      options={SENSITIVE_TYPE}
                    />
                  </div>
                  <div style={{ display: 'flex' }}>
                    <FastField
                      className={classes.textField}
                      component={CustomSelectField}
                      label="Direction"
                      name="direction"
                      options={DIRECTION_OPTIONS}
                    />
                  </div>
                  <div style={{ display: 'flex' }}>
                    <FastField
                      className={classes.textField}
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
        message={
          recordEditing
            ? 'Update sensitive in system'
            : 'Create new sensitive in system'
        }
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
