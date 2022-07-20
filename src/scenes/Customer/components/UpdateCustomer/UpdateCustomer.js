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
  CardHeader,
  Card,
  CardContent
} from '@material-ui/core';
import { CustomButton, DialogConfirm } from 'components';
import { Cancel, Save } from '@material-ui/icons';
import { STATUS_OPTIONS } from 'constants/options';
import { FastField, Formik } from 'formik';
import { CustomSelectField, CustomTextField } from 'components/CustomFields';
import CompanyCustomerItem from '../CompanyCustomerItem';
import * as Yup from 'yup';
import CampaignCustomerItem from '../CampaignCustomerItem';

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
  }
}));

const UpdateCustomer = (props) => {
  // eslint-disable-next-line
  const { openUpdate, companies, campaigns, customer, newCompanyCustomers, newCampaignCustomers, handleCloseUpdateCustomer, handleSubmitUpdateCustomer, ...rest } = props;

  const classes = useStyles();

  //* init values formik form
  let formikManagement = null;
  const [formState, setFormState] = useState({
    companyCustomers: newCompanyCustomers,
    newCompanyCustomers: newCompanyCustomers,
    fullName: customer.fullName,
    phoneNumber: customer.phoneNumber,
    status: customer.status,
    emailAddress: customer.emailAddress ? customer.emailAddress : '',
    campaignCustomers: newCampaignCustomers,
    newCampaignCustomers: newCampaignCustomers
  });

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

  //* dialog confirm
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const handleConfirmDialog = () => {
    handleSubmitUpdateCustomer(customer.id, formikManagement.values);
    setDialogConfirm(false);
  };
  const handleCloseDialog = () => setDialogConfirm(false);
  const handleSubmit = async () => {
    formikManagement.setSubmitting(true);
    await formikManagement.validateForm();
    if (formikManagement.isValid) setDialogConfirm(true);
  };

  useEffect(() => {
    setFormState({
      companyCustomers: newCompanyCustomers,
      newCompanyCustomers: newCompanyCustomers,
      fullName: customer.fullName,
      phoneNumber: customer.phoneNumber,
      status: customer.status,
      emailAddress: customer.emailAddress ? customer.emailAddress : '',
      campaignCustomers: newCampaignCustomers,
      newCampaignCustomers: newCampaignCustomers
    });
  }, [newCompanyCustomers, newCampaignCustomers]);

  //* UI
  return (
    <div>
      <Grid item>
        <Dialog
          aria-labelledby="form-dialog-title"
          className={classes.dialogForm}
          open={openUpdate}
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle id="form-dialog-title">Update Client</DialogTitle>
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
                            label="Phone Number"
                            name="phoneNumber"
                            disable
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
                            textAlign: 'center',
                            marginLeft: '2%'
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
                      theme="gray-full"
                      variant="contained"
                      onClick={handleCloseUpdateCustomer}
                    >
                      <Cancel className={classes.icon} />
                    </CustomButton>
                    <CustomButton
                      content="Save Change"
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
        message="Update client in system"
        open={dialogConfirm}
      />
    </div>
  );
};

export default UpdateCustomer;

UpdateCustomer.propTypes = {
  customer: PropTypes.object,
  companies: PropTypes.array,
  campaigns: PropTypes.array,
  newCompanyCustomers: PropTypes.array,
  newCampaignCustomers: PropTypes.array,
  handleCloseUpdateCustomer: PropTypes.func,
  handleSubmitUpdateCustomer: PropTypes.func,
  openUpdate: PropTypes.bool
};
