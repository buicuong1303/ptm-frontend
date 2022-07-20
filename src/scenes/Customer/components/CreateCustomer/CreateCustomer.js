import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardHeader,
  CardContent
} from '@material-ui/core';
import { CustomButton, DialogConfirm } from 'components';
import { Cancel, Save } from '@material-ui/icons';
import { STATUS_OPTIONS } from 'constants/options';
import { FastField, Formik } from 'formik';
import { CustomSelectField, CustomTextField } from 'components/CustomFields';
import CompanyCustomerItem from '../CompanyCustomerItem';
import CampaignCustomerItem from '../CampaignCustomerItem';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  root: {},
  dialogForm: {
    overflow: 'unset !important'
  },
  dialogContent: {
    overflow: 'unset !important',
    padding: theme.spacing(2)
  },
  subTitle: {
    textAlign: 'center'
  },
  text: {
    textAlign: 'center',
    marginTop: '10px',
    color: '#d9d9d9',
    fontSize: '14px'
  },
  gridItem: {
    marginBottom: theme.spacing(2)
  },
  status: {
    marginTop: theme.spacing(3)
  },
  statusFiled: {
    marginBottom: '0px'
  }
}));

const CreateCustomer = (props) => {
  // eslint-disable-next-line
  const { openCreate, companies, campaigns, handleCloseCreateCustomer, handleSubmitCreateCustomer, ...rest } = props;

  const classes = useStyles();

  //* init values formik form
  let formikManagement = null;
  const initialValues = {
    companyCustomers: [],
    newCompanyCustomers: [],
    fullName: '',
    phoneNumber: '',
    status: 'active',
    emailAddress: '',
    campaignCustomers: [],
    newCampaignCustomers: []
  };

  //* validate form
  const validationSchema = Yup.object().shape({
    emailAddress: Yup.string()
      .trim()
      .email('Invalid email address.')
      .nullable(),
    phoneNumber: Yup.string()
      .trim()
      .required('Phone number is required.')
      .test('phoneNumber', 'Invalid phone number.', function () {
        if (this.parent.phoneNumber) {
          if (this.parent.phoneNumber.indexOf('+') !== -1) {
            if (
              this.parent.phoneNumber.length === 12 &&
              this.parent.phoneNumber.indexOf('+') === 0
            )
              return true;
            return false;
          } else {
            if (this.parent.phoneNumber.length === 10) return true;
            return false;
          }
        }
      })
  });

  //* init form value
  const [formState, setFormState] = useState(initialValues);

  //* confirm dialog
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const handleConfirmDialog = () => {
    handleSubmitCreateCustomer(formikManagement.values);
    setDialogConfirm(false);
  };
  const handleCloseDialog = () => setDialogConfirm(false);
  const handleSubmit = async () => {
    formikManagement.setSubmitting(true);
    await formikManagement.validateForm();
    if (formikManagement.isValid) setDialogConfirm(true);
  };

  //* handle reset form
  const handleReset = () => {
    setFormState(initialValues);
    handleCloseCreateCustomer();
  };

  useEffect(() => {
    setFormState(initialValues);
  }, [openCreate]);

  return (
    <div>
      <Grid item sm={12} xs={12}>
        <Dialog
          aria-labelledby="form-dialog-title"
          className={classes.dialogForm}
          open={openCreate}
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle id="form-dialog-title">Create Client</DialogTitle>

          <Divider />
          <Formik
            enableReinitialize
            initialValues={formState}
            validationSchema={validationSchema}
          >
            {(formikProps) => {
              formikManagement = formikProps;
              return (
                <>
                  <DialogContent className={classes.dialogContent}>
                    <Grid container spacing={2}>
                      <Grid item md={4} sm={12} xs={12}>
                        <Grid className={classes.gridItem} item sm={12} xs={12}>
                          <FastField
                            component={CustomTextField}
                            label="Full Name"
                            name="fullName"
                          />
                        </Grid>
                        <Grid className={classes.gridItem} item sm={12} xs={12}>
                          <FastField
                            component={CustomTextField}
                            label="Email address"
                            name="emailAddress"
                          />
                        </Grid>
                        <Grid className={classes.gridItem} item sm={12} xs={12}>
                          <FastField
                            component={CustomTextField}
                            label="* Phone Number"
                            name="phoneNumber"
                            type="phone"
                          />
                        </Grid>
                        <Grid className={classes.status} item sm={12} xs={12}>
                          <FastField
                            component={CustomSelectField}
                            label="Status"
                            name="status"
                            options={STATUS_OPTIONS}
                            placeholder="Select Status"
                            className={classes.statusFiled}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        md={4}
                        sm={6}
                        xs={12}
                        style={{ display: 'flex', marginTop: '4px' }}
                      >
                        <Card
                          style={{
                            flex: '1',
                            textAlign: 'center'
                          }}
                        >
                          <CardHeader title="Companies" />
                          <Divider />
                          <CardContent
                            className={classes.CardContent}
                            component={CompanyCustomerItem}
                            companies={companies}
                            customer={formikManagement.values}
                            setFormState={setFormState}
                          />
                        </Card>
                      </Grid>
                      <Grid
                        item
                        md={4}
                        sm={6}
                        xs={12}
                        style={{ display: 'flex', marginTop: '4px' }}
                      >
                        <Card
                          style={{
                            flex: '1',
                            textAlign: 'center'
                          }}
                        >
                          <CardHeader title="Campaigns" />
                          <Divider />
                          <CardContent
                            className={classes.CardContent}
                            component={CampaignCustomerItem}
                            campaigns={campaigns}
                            customer={formikManagement.values}
                            setFormState={setFormState}
                          />
                        </Card>
                      </Grid>
                    </Grid>
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
                      content="Create New"
                      onClick={handleSubmit}
                      theme="blue-full"
                      variant="contained"
                      disabled={!formikProps.isValid}
                    >
                      <Save className={classes.icon} />
                    </CustomButton>
                  </DialogActions>
                </>
              );
            }}
          </Formik>

          <Divider />
        </Dialog>
      </Grid>
      <DialogConfirm
        handleClose={handleCloseDialog}
        handleConfirm={handleConfirmDialog}
        message="Create new client in system"
        open={dialogConfirm}
      />
    </div>
  );
};

export default CreateCustomer;

CreateCustomer.propTypes = {
  openCreate: PropTypes.bool,
  companies: PropTypes.array,
  campaigns: PropTypes.array,
  handleCloseCreateCustomer: PropTypes.func,
  handleSubmitCreateCustomer: PropTypes.func
};
