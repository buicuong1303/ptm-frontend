/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { ReCron } from '@sbzen/re-cron';
import {
  CustomButton,
  DialogConfirm,
  DialogWarning,
  Header,
  Page
} from 'components';
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
  ReCronField,
  SwitchField
} from 'components/CustomFields';
import { ExitToApp, Save, PlaylistAddCheck } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import '../../style.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  getScheduleMessage,
  updateScheduleMessage,
  validateScheduleMessage
} from 'scenes/ScheduleMessage/ScheduleMessage.asyncAction';
import { CompanyContext } from 'contexts/CompanyProvider';
import * as Yup from 'yup';
import { useHistory, useParams } from 'react-router';
import { unwrapResult } from '@reduxjs/toolkit';
import Error404 from 'components/Error404';
import { useSnackbar } from 'notistack';
import FILE from 'constants/file';
import _, { cloneDeep } from 'lodash';
import moment from 'moment';
import * as xlsx from 'xlsx';
import { DialogPreview } from '../components';
import DetailError from '../components/DetailError';
import {
  clearStateSchedule,
  clearStateValidateSchedule
} from 'scenes/ScheduleMessage/ScheduleMessage.slice';
import apiStatus from 'utils/apiStatus';
import limit from 'constants/limit';
import clsx from 'clsx';
import CustomCheckField from 'components/CustomFields/CustomCheckField';
import { Stack } from '@mui/material';

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
    // margin: theme.spacing(2, 0, 0, 0)
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
    zIndex: 9999,
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
  }
}));

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required('Name is required.'),
  content: Yup.mixed().test(
    'is-content-over-length',
    `Required and must be of length 1 to ${limit.maxMessageLength}.`,
    function (value) {
      if(value) {
        return value.length <= limit.maxMessageLength;
      } else {
        return false;
      }
    }
  ),
  company: Yup.string().trim().required('Company is required.'),
  campaign: Yup.string().trim().required('Campaign is required.'),
  customFields: Yup.lazy((customFields) => {
    if (customFields.length > 0) {
      return Yup.mixed().test(
        'is-require',
        'field is required.',
        function (value) {
          const res = value
            .filter((item) => item.status === 'active')
            .every((item) => {
              const valueRegex = /^\d+$/;
              return !valueRegex.test(item['field']) && !!item['field'];
            });
          return res;
        }
      );
    }
    return Yup.mixed().required('field is required.');
  }),
  customerUrl: Yup.lazy((customerFile) => {
    if (customerFile) {
      return Yup.mixed().test(
        'is-less',
        'File data requires min 1 record, max 1000 records; position [A1] = "phone".',
        function (value) {
          if (value.data) {
            const workbook = xlsx.read(value.data, { type: 'buffer' });
            const ws = workbook.Sheets[workbook.SheetNames[0]];
            // const endRow = xlsx.utils.decode_range(ws['!ref']).e.r;
            const data = xlsx.utils.sheet_to_json(ws, { raw: false });
            if (data.length < 1 || data.length > 1000) return false;
            const fields = ['phone', 'firstName', 'lastName'];
            for (const field of fields) {
              if (!Object.keys(data[0]).includes(field)) {
                return false;
              }
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
            total += item.detail?.size || item.size;
            return total;
          }, 0);
          return totalSize < FILE.MAX_SIZE;
        }
      );
    }
    return Yup.mixed().optional();
  })
});

function UpdateSchedule() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  let { id } = useParams();
  let getSchedulePromise = null;
  let updateSchedulePromise = null;
  let formikManagement = null;

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
  const [scheduleEditing, setScheduleEditing] = useState(null);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [error, setError] = useState(null);
  const [dialogWarning, setDialogWarning] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [dataPreview, setDataPreview] = useState(null);
  const [validateSuccess, setValidateSuccess] = useState(false);
  const [customerFile, setCustomerFile] = useState();

  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

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

  //* validate
  const handleValidateSchedule = () => {
    dispatch(
      validateScheduleMessage({
        customerUrl: customerFile || formikManagement?.values?.customerUrl,
        campaignId: formikManagement?.values?.campaign,
        content: formikManagement?.values?.content,
        customFields: formikManagement?.values?.customFields,
      })
    );
  };
  const handleClearStateValidateSchedule = () =>
    dispatch(clearStateValidateSchedule());

  //* dialog confirm
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const handleConfirmDialog = async (values) => {
    const prepareDataUpdate = values.customFields.reduce((total, item) => {
      if (item.status === 'active') {
        delete item['status'];
        return [...total, item];
      }
      return total;
    }, []);
    updateSchedulePromise = dispatch(
      updateScheduleMessage({
        id: id,
        ...values,
        customFields: prepareDataUpdate
      })
    );
    try {
      setOpenBackdrop(true);
      unwrapResult(await updateSchedulePromise);
      setTimeout(() => {
        setOpenBackdrop(false);
        showSnackbar('Update schedule success', 'success');
        history.push('/scheduling');
      }, 1000);
    } catch (error) {
      setOpenBackdrop(false);
      showSnackbar('Update schedule failed', 'error');
    }
    setDialogConfirm(false);
  };
  const handleCloseDialogConfirm = () => setDialogConfirm(false);
  const handleCloseDialogWarning = () => setDialogWarning(false);
  const handleSubmit = async (values) => setDialogConfirm(true);

  const handlePreview = (formikProps) => {
    formikProps.values.customFields = formikProps.values.customFields.filter(
      (item) => item.status === 'active'
    );
    setDataPreview(formikProps.values);
    setOpenPreview(true);
  };

  const handleLeave = () => history.push('/scheduling');

  useEffect(() => {
    if (status === apiStatus.PENDING) setOpenBackdrop(true);
    else setOpenBackdrop(false);

    if (status === apiStatus.SUCCESS) showSnackbar(message, 'success');

    if (status === apiStatus.ERROR) showSnackbar(message, 'error');
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
  useEffect(() => {
    async function fetchSchedule(scheduleId) {
      getSchedulePromise = dispatch(getScheduleMessage(scheduleId));
      try {
        const data = unwrapResult(await getSchedulePromise);
        setScheduleEditing({
          ...data,
          campaign: data.campaign.id
        });
        setError(false);
      } catch (error) {
        setError(true);
      }
    }
    fetchSchedule(id);
    return () => {
      getSchedulePromise.abort();
      if (updateSchedulePromise) updateSchedulePromise.abort();
      dispatch(clearStateSchedule());
    };
  }, []);

  return error === null ? (
    <></>
  ) : error ? (
    <Error404 />
  ) : (
    <Page title="Update Schedule" className={classes.root}>
      <Header
        className={classes.title}
        childTitle="Update schedule"
        urlChild="/scheduling"
      />
      <Divider className={classes.divider} />
      <Paper className={classes.paper} elevation={3} variant="outlined">
        <Formik
          enableReinitialize
          initialValues={scheduleEditing || initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnBlur={false}
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
                        name="content"
                        component={CustomTextField}
                        disable={scheduleEditing.backupScheduleMessageId ? true : false}
                        label="* Content"
                        multiline
                        maxRows={10}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                      <Stack style={{ marginTop: 16 }} direction="row">
                        <FastField
                          component={CustomSelectField}
                          disable={scheduleEditing.backupScheduleMessageId ? true : false}
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
                        <FastField
                          component={CustomSelectField}
                          label="* Campaign"
                          name="campaign"
                          disable={scheduleEditing.backupScheduleMessageId ? true : false}
                          options={campaigns.map((campaign) => ({
                            value: campaign.id,
                            label: campaign.name,
                            status: campaign.status
                          }))}
                          InputLabelProps={{
                            shrink: true
                          }}
                          placeholder="Select campaign"
                        />
                      </Stack>
                      {/* Retry */}
                      {!scheduleEditing.backupScheduleMessageId ?
                        <FastField
                          component={CustomCheckField}
                          label="Retry"
                          name="canRetry"
                          className={classes.checkBox}
                          // InputLabelProps={{
                          //   shrink: true
                          // }}
                          placeholder="Retry"
                        /> : ''
                      }
                      <div className={clsx(classes.groupInput, classes.textField)}>
                        <div style={{ width: '100%' }}>
                          <FastField
                            name="customerUrl"
                            component={FileUploadField}
                            disable={scheduleEditing.backupScheduleMessageId ? true : false}
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
                      <FastField
                        component={AttachmentsUploadField}
                        disable={scheduleEditing.backupScheduleMessageId ? true : false}
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
                        styles={{ marginTop: '24px '}}
                      />
                    </Grid>
                    <Grid item lg={4} xs={12}>
                      <FastField
                        component={GroupInputField}
                        disable={scheduleEditing.backupScheduleMessageId ? true : false}
                        label=""
                        name="customFields"
                        className={classes.customFields}
                      />
                    </Grid>
                    {/* <Grid item lg={8} xs={12}>
                      <FastField
                        component={SwitchField}
                        name="isCronExpression"
                        label="Cron expression"
                      />
                    </Grid> */}

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

                  <CustomButton
                    content=""
                    theme="gray-full"
                    variant="contained"
                    onClick={() => {
                      if (!_.isEqual(scheduleEditing, formikProps.values)) {
                        setDialogWarning(true);
                      } else history.push('/scheduling');
                    }}
                  >
                    <ExitToApp className={classes.icon} />
                    Back
                  </CustomButton>

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
                    content={scheduleEditing ? 'Save Change' : 'Create New'}
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ textTransform: 'capitalize' }}
                    disabled={!validateSuccess || !formikProps.isValid}
                  >
                    <Save className={classes.icon} />
                    Save Change
                  </Button>
                </DialogActions>
                <DialogConfirm
                  handleClose={handleCloseDialogConfirm}
                  handleConfirm={() => handleConfirmDialog(formikProps.values)}
                  message="Update schedule in system"
                  open={dialogConfirm}
                />
                <DialogWarning
                  title="Are you sure want to leave?"
                  onClose={handleCloseDialogWarning}
                  onLeave={handleLeave}
                  message="The changes you have made may not be saved"
                  open={dialogWarning}
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

export default UpdateSchedule;
