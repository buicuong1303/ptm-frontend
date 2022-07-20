/* eslint-disable indent */
import React, { useContext, useEffect, useState } from 'react';
import { CustomButton, DialogConfirm, Header, Page } from 'components';
import { FastField, Form, Formik } from 'formik';
import {
  Backdrop,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  Paper
} from '@material-ui/core';
import {
  AttachmentsUploadField,
  CustomSelectField,
  CustomTextField,
  DateTimePickerField,
  FileUploadField,
  GroupInputField,
  ReCronField
} from 'components/CustomFields';
import { ExitToApp, PlaylistAddCheck, Save } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import '../../style.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  createScheduleMessage,
  validateScheduleMessage
} from 'scenes/ScheduleMessage/ScheduleMessage.asyncAction';
import { CompanyContext } from 'contexts/CompanyProvider';
import * as Yup from 'yup';
import apiStatus from 'utils/apiStatus';
import { useHistory } from 'react-router';
import {
  clearStateSchedule,
  clearStateValidateSchedule
} from 'scenes/ScheduleMessage/ScheduleMessage.slice';
import { useSnackbar } from 'notistack';
import FILE from 'constants/file';
import moment from 'moment';
import { Link } from 'react-router-dom';
import * as xlsx from 'xlsx';
import { DialogPreview } from '../components';
import DetailError from '../components/DetailError';
import { cloneDeep } from 'lodash';
import limit from 'constants/limit';
import clsx from 'clsx';
import Stack from '@mui/material/Stack';
import CustomCheckField from 'components/CustomFields/CustomCheckField';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '0 auto',
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      width: '100%'
    }
  },
  icon: {
    marginRight: theme.spacing(0.5)
  },
  fileUpload: {
    // margin: theme.spacing(2, 0, 0, 0),
    width: '100%'
  },
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
    margin: theme.spacing(2, 0, 1)
  },
  wrapperInput: {
    display: 'flex'
  },
  paper: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column'
  },
  divider: {
    backgroundColor: theme.palette.primary.main,
    border: 'none',
    height: '2px',
    margin: '10px 0px'
  },
  checkBox: {
    margin: 0,
    height: 38
  },
  backdrop: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  groupInput: {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    '& .MuiFormHelperText-root': {
      position: 'absolute',
      top: '100%',
      marginTop: 0
    }
  },
  countCharacter: {
    margin: '0px 0px 10px 0px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    color: theme.palette.text.secondary,
    fontSize: '15px'
  }
}));

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required('Name is required.'),
  content: Yup.mixed().test(
    'is-content-over-length',
    `Required and must be of length 1 to ${limit.maxMessageLength}.`,
    function (value) {
      if (value) {
        return value.length <= limit.maxMessageLength;
      } else {
        return false;
      }
    }
  ),
  company: Yup.string().trim().required('Company is required.'),
  campaign: Yup.string().trim().required('Campaign is required.'),
  // eslint-disable-next-line no-unused-vars
  customFields: Yup.lazy((customFields) => {
    return Yup.mixed();
  }),
  customerUrl: Yup.lazy((customerFile) => {
    if (customerFile) {
      return Yup.mixed().test(
        'is-less',
        'File data requires min 1 record, max 1000 records; position [A1] = "phone".',
        function (value) {
          const workbook = xlsx.read(value.data, { type: 'buffer' });
          const ws = workbook.Sheets[workbook.SheetNames[0]];
          const data = xlsx.utils.sheet_to_json(ws, { raw: false });
          if (data.length < 1 || data.length > 1000) return false;
          const fields = ['phone'];
          for (const field of fields) {
            if (!Object.keys(data[0]).includes(field)) {
              return false;
            }
          }
          return true;
        }
      );
    }
    return Yup.mixed().required('Customer file is required.');
  }),
  dateTime: Yup.lazy((dateTime) => {
    if (dateTime) {
      return Yup.mixed().test(
        'is-greater',
        'Time must be after at the moment 5 minutes.',
        function (value) {
          return moment(value).isAfter(
            moment(new Date().getTime() + 5 * 60000)
            // moment(new Date().getTime() + 1 * 60000)
          );
        }
      );
    }
  }),
  attachmentUrls: Yup.lazy((attachments) => {
    if (attachments) {
      if (attachments.length > FILE.NUMBER_OF_FILES)
        return Yup.array().test(
          'is-over-limit',
          `Up to ${FILE.NUMBER_OF_FILES} files.`,
          function (attachments) {
            return attachments.length < FILE.NUMBER_OF_FILES;
          }
        );

      return Yup.array().test(
        'is-over-limit',
        'The file must be less than 1.5 MB in size.',
        function (attachments) {
          const totalSize = attachments.reduce((total, item) => {
            total += item.detail.size;
            return total;
          }, 0);
          return totalSize < FILE.MAX_SIZE;
        }
      );
    }
    return Yup.mixed().optional();
  })
});

// eslint-disable-next-line no-unused-vars
function CreateSchedule({ recordEditing, onSubmit }) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { companies } = useContext(CompanyContext);
  const campaigns = useSelector((state) => state.campaign.campaigns);
  const status = useSelector((state) => state.schedule.status);
  const message = useSelector((state) => state.schedule.message);
  const validateSchedule = useSelector(
    (state) => state.schedule.validateSchedule
  );

  const [initialValues] = useState({
    name: '',
    content: '',
    attachmentUrls: [],
    canRetry: false,
    company: '',
    campaign: '',
    customerUrl: '',
    customFields: [],
    cronExpression: '* * * * *',
    dateTime: moment(new Date(), 'YYYY-MM-DD hh:mm:ss A').add(5, 'm').format(),
    isCronExpression: false
  });
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [dataPreview, setDataPreview] = useState(null);
  const [validateSuccess, setValidateSuccess] = useState(false);
  const [customerFile, setCustomerFile] = useState();

  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  let formikManagement = null;

  //* validate
  const handleValidateSchedule = () => {
    dispatch(
      validateScheduleMessage({
        content: formikManagement?.values?.content,
        customFields: formikManagement?.values?.customFields,
        customerUrl: customerFile,
        campaignId: formikManagement?.values?.campaign
      })
    );
  };
  const handleClearStateValidateSchedule = () =>
    dispatch(clearStateValidateSchedule());

  //* detail error
  const defaultDataError = {
    open: false,
    fileName: '',
    errors: []
  };
  const [dataError, setDataError] = useState(defaultDataError);
  const handleOpenDetailError = (errors) =>
    setDataError({
      open: true,
      fileName: errors.fileName,
      invalidPhoneNumber: errors.invalidPhoneNumber,
      optOutPhoneNumber: errors.optOutPhoneNumber
    });
  const handleCloseDetailError = () => setDataError(defaultDataError);

  //* dialog confirm
  const [dialogConfirm, setDialogConfirm] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const handleSubmit = (values) => setDialogConfirm(true);
  const handleConfirmDialog = (values) => {
    values.customFields = values.customFields.reduce((total, item) => {
      if (item.status === 'active') {
        delete item['status'];
        return [...total, item];
      }
      return total;
    }, []);
    dispatch(createScheduleMessage(values));
    setDialogConfirm(false);
  };
  const handleCloseDialog = () => setDialogConfirm(false);

  //* preview
  const handlePreview = (formikProps) => {
    formikProps.values.customFields = formikProps.values.customFields.filter(
      (item) => item.status === 'active'
    );
    setDataPreview(formikProps.values);
    setOpenPreview(true);
  };

  useEffect(() => {
    if (status === apiStatus.PENDING) setOpenBackdrop(true);
    else setOpenBackdrop(false);

    if (status === apiStatus.SUCCESS) {
      showSnackbar(message, 'success');

      if (message === 'Create schedule success') {
        setTimeout(() => {
          dispatch(clearStateSchedule());
          history.push('/scheduling');
        }, 1000);
      }
    }

    if (status === apiStatus.ERROR) {
      showSnackbar(message, 'error');
      dispatch(clearStateSchedule());
    }
  }, [status]);

  useEffect(() => {
    if (
      validateSchedule.validated &&
      validateSchedule.invalidPhoneNumber?.length === 0 &&
      validateSchedule.optOutPhoneNumber?.length === 0
    )
      setValidateSuccess(true);
    else setValidateSuccess(false);
  }, [validateSchedule]);

  // Handle campaign All
  const [campaignData, setCampaignData] = useState([]);
  useEffect(() => {
    const campaignsData = campaigns.filter((item) => {
      if (item.name === 'All') {
        return false;
      }
      return true;
    });
    setCampaignData(campaignsData);
  }, [campaigns]);

  useEffect(() => {
    return () => dispatch(clearStateSchedule());
  }, []);

  return (
    <Page title="Create schedule" className={classes.root}>
      <Header
        className={classes.title}
        childTitle="Create schedule"
        urlChild="/scheduling"
      />
      <Divider className={classes.divider} />
      <Paper className={classes.paper} elevation={3} variant="outlined">
        <Formik
          enableReinitialize
          initialValues={recordEditing || initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnBlur
        >
          {(formikProps) => {
            formikManagement = formikProps;
            return (
              <Form>
                <DialogContent
                  dividers
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <Grid container spacing={2}>
                    <Grid item lg={8} xs={12}>
                      {/* Name */}
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
                      {/* Content */}
                      <FastField
                        className={classes.textField}
                        name="content"
                        component={CustomTextField}
                        label={`* Content ${
                          formikManagement?.values?.content?.length ?? '0'
                        }/${limit.maxMessageLength.toString()}`}
                        multiline
                        maxRows={10}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />

                      <Stack style={{ marginTop: 16 }} direction="row">
                        {/* Company */}
                        <FastField
                          component={CustomSelectField}
                          style={{ marginRight: 16 }}
                          label="* Company"
                          name="company"
                          options={companies.map((company) => ({
                            value: company.id,
                            label: company.name
                          }))}
                          InputLabelProps={{
                            shrink: true
                          }}
                          placeholder="Select company"
                        />
                        {/* Campaign */}
                        <FastField
                          component={CustomSelectField}
                          label="* Campaign"
                          name="campaign"
                          options={campaignData.map((campaign) => {
                            return {
                              value: campaign.id,
                              label: campaign.name
                            };
                          })}
                          InputLabelProps={{
                            shrink: true
                          }}
                          placeholder="Select campaign"
                        />
                      </Stack>
                      {/* Retry */}
                      <FastField
                        component={CustomCheckField}
                        label="Retry"
                        name="canRetry"
                        className={classes.checkBox}
                        // InputLabelProps={{
                        //   shrink: true
                        // }}
                        placeholder="Retry"
                      />
                      {/* Chose File */}
                      <div
                        className={clsx(classes.groupInput, classes.textField)}
                      >
                        <div style={{ width: '100%' }}>
                          <FastField
                            name="customerUrl"
                            component={FileUploadField}
                            handleClearStateValidateSchedule={
                              handleClearStateValidateSchedule
                            }
                            setCustomerFile={setCustomerFile}
                            label="* Customer file"
                            className={classes.fileUpload}
                            accept={['.xlsx']}
                            placeholder="* Choose customer file"
                            style={{ margin: '0px 0px' }}
                          />
                        </div>
                        {validateSchedule?.validated &&
                          (validateSchedule?.invalidPhoneNumber?.length > 0 ||
                            validateSchedule?.optOutPhoneNumber?.length >
                              0) && (
                            <CustomButton
                              content={'Detail Error'}
                              theme="orange-full"
                              color={'white'}
                              variant="contained"
                              style={{
                                textTransform: 'capitalize',
                                color: 'white',
                                margin: '0px 0px 0px 8px'
                              }}
                              onClick={() =>
                                handleOpenDetailError(
                                  cloneDeep(validateSchedule)
                                )
                              }
                            />
                          )}
                      </div>
                      {/* Attachments */}
                      <FastField
                        component={AttachmentsUploadField}
                        label="Attachments"
                        name="attachmentUrls"
                        className={classes.textField}
                        accept={[
                          '.jpg',
                          '.png',
                          '.jpeg',
                          '.gif',
                          '.tif',
                          '.tiff',
                          '.bmp',
                          '.mp4',
                          '.mpeg',
                          '.mp3',
                          '.vcf',
                          '.vcard',
                          '.rtf',
                          '.zip'
                        ]}
                        placeholder="Choose attachments"
                        multiple
                        styles={{ marginTop: '24px ' }}
                      />
                    </Grid>
                    {/* Custom fields */}
                    <Grid item lg={4} xs={12}>
                      <FastField
                        component={GroupInputField}
                        label=""
                        name="customFields"
                        className={classes.customFields}
                        customFields={
                          recordEditing && recordEditing.customFields
                        }
                      />
                    </Grid>

                    {/* <Grid
                      item
                      lg={8}
                      xs={12}
                      style={{ paddingTop: 0, paddingBottom: 0 }}
                    >
                      <FastField
                        component={SwitchField}
                        name="isCronExpression"
                        label="Cron expression"
                      />
                    </Grid> */}
                    {/* Chose time run */}
                    {formikProps.values.isCronExpression ? (
                      <div>
                        <FastField
                          name="cronExpression"
                          component={ReCronField}
                        />
                      </div>
                    ) : (
                      <Grid item lg={8} xs={12}>
                        <FastField
                          component={DateTimePickerField}
                          label="* Date and Time"
                          name="dateTime"
                        />
                      </Grid>
                    )}
                  </Grid>
                </DialogContent>

                <DialogActions
                  style={{ paddingLeft: '24px', paddingRight: '24px' }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ textTransform: 'capitalize' }}
                    onClick={() => handlePreview(formikProps)}
                    disabled={!validateSuccess || !formikProps.isValid}
                  >
                    Preview
                  </Button>
                  <Link to={'/scheduling'}>
                    <CustomButton
                      content=""
                      theme="gray-full"
                      variant="contained"
                    >
                      <ExitToApp className={classes.icon} />
                      Back
                    </CustomButton>
                  </Link>

                  <CustomButton
                    content={'Validate'}
                    theme="orange-full"
                    color={'white'}
                    variant="contained"
                    style={{ textTransform: 'capitalize', color: 'white' }}
                    disabled={
                      !formikManagement.values.campaign ||
                      !formikManagement.values.customerUrl
                    }
                    onClick={handleValidateSchedule}
                  >
                    <PlaylistAddCheck className={classes.icon} />
                  </CustomButton>
                  <Button
                    content={recordEditing ? 'Save Change' : 'Create New'}
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ textTransform: 'capitalize', color: 'white' }}
                    disabled={!validateSuccess || !formikProps.isValid}
                  >
                    <Save className={classes.icon} />
                    Create New
                  </Button>
                </DialogActions>

                <DialogConfirm
                  handleClose={handleCloseDialog}
                  handleConfirm={() => handleConfirmDialog(formikProps.values)}
                  message="Create new schedule in system"
                  open={dialogConfirm}
                />
              </Form>
            );
          }}
        </Formik>
      </Paper>

      <DialogPreview
        open={openPreview}
        schedule={dataPreview}
        onClose={() => setOpenPreview(false)}
      />

      <DetailError
        dataError={dataError}
        handleCloseDetailError={handleCloseDetailError}
      />

      <Backdrop className={classes.backdrop} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Page>
  );
}

export default CreateSchedule;
