/* eslint-disable prettier/prettier */
import { Backdrop, CircularProgress, Divider, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { DialogDelete, Header, Page, TableHead } from 'components';
import React, { useContext, useEffect, useState } from 'react';
import ButtonCreate from 'components/ButtonCreate';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import apiStatus from 'utils/apiStatus';
import SimpleDialog from './scenes/SimpleDialog';
import CampaignList from './scenes/CampaignList';
import { createCampaigns, deleteCampaigns, getCampaigns, updateCampaign } from './Campaign.asyncAction';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { clearStateCampaign } from './Campaign.slice';
import { PermissionContext } from 'contexts/PermissionProvider';
import AuthGuard from 'components/AuthGuard';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    margin: '0 auto',
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      width: '100%'
    }
  },
  backdrop: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  paper: {
    flex: '1',
    display: 'flex',
    minHeight: 0,
    flexDirection: 'column',
    zIndex: 0
  },
  divider: {
    backgroundColor: theme.palette.primary.main,
    border: 'none',
    height: '2px',
    margin: '10px 0px'
  },
  buttonCreate: {
    margin: '10px 0px',
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff'
  },
  title: {},
  tableHead: {
    padding: `0px ${theme.spacing(2)}px`
  }
}));

const columns = [
  {
    name: 'No.',
    flex: 1
  },
  {
    name: 'Name',
    flex: 6
  },
  {
    name: 'Status',
    flex: 1
  },
  {
    name: 'Actions',
    flex: 2,
    textAlign: 'center'
  }
];

function Campaign() {
  const classes = useStyles();
  const dispatch = useDispatch();

  //* show notification
  const { enqueueSnackbar } = useSnackbar();
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  //* listens state from redux
  const campaigns = useSelector((state) => state.campaign.campaigns);
  const campaignsStatus = useSelector((state) => state.campaign.status);
  const campaignsMessage = useSelector((state) => state.campaign.message);
  const backdrop = useSelector((state) => state.campaign.backdrop);


  //* init page state
  const [open, setOpen] = useState(false);
  const [recordEditing, setRecordEditing] = useState(null);

  //* Backdrop
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleToggleBackdrop = (backdrop) => {
    if (backdrop === apiStatus.PENDING) setOpenBackdrop(true);
    else setOpenBackdrop(false);
  };

  //* Dialog Delete
  const [dialogDeleteValue, setDialogDeleteValue] = useState({
    open: false,
    id: '',
    title: '',
    message: ''
  });
  const handleOpenDialogDelete = (campaignId, title, message = '') =>
    setDialogDeleteValue({
      open: true,
      id: campaignId,
      title: title,
      message: message
    });
  const handleCloseDialogDelete = () =>
    setDialogDeleteValue({ ...dialogDeleteValue, open: false });
  const handleSubmitDialogDelete = () => {
    dispatch(deleteCampaigns({ campaignId: dialogDeleteValue.id }));
    setDialogDeleteValue({ ...dialogDeleteValue, open: false });
  };

  //* handle show create form
  const handleCreate = () => setOpen(true);

  //* handle show update form
  const handleEdit = (index) => {
    setRecordEditing(campaigns[index]);
    setOpen(true);
  };

  //* handle show delete confirm
  const handleDelete = (index) =>
    handleOpenDialogDelete(
      campaigns[index].id,
      'Do you really want to delete campaign ?',
      'Delete campaign will set campaign disable, you can\'t find it in this feature'
    );

  //* handle close create or update form
  const handleClose = () => {
    setRecordEditing(null);
    setOpen(false);
  };

  //*Handle Author
  const { authorizer } = useContext(PermissionContext);
  const [authorPermission, setAuthorPermission] = useState({
    canRead: false,
    canUpdate: false,
    canDelete: false,
    canCreate: false
  });
  const getAuthor = async () => {
    setAuthorPermission({
      ...authorPermission,
      canRead: await authorizer.current.can('read', '/campaigns'),
      canUpdate: await authorizer.current.can('update', '/campaigns'),
      canDelete: await authorizer.current.can('delete', '/campaigns'),
      canCreate: await authorizer.current.can('create', '/campaigns')
    });
  };

  //* handle submit form create or update form
  const handleSubmit = async (values) => {
    if (values.id) {
      dispatch(
        updateCampaign({ campaignId: values.id, campaign: values })
      );
    } else dispatch(createCampaigns({ campaign: values }));
  };

  useEffect(() => {
    handleToggleBackdrop(backdrop);
    // eslint-disable-next-line
  }, [backdrop]);


  useEffect(() => {
    getAuthor();
    dispatch(getCampaigns());
    return () => dispatch(clearStateCampaign());
  }, []);

  //* listen status and show notification
  useEffect(() => {
    if (
      campaignsStatus === apiStatus.SUCCESS &&
      campaignsMessage === 'Create campaign success'
    ) {
      handleClose();
      showSnackbar(campaignsMessage, campaignsStatus);
    }
    if (
      campaignsStatus === apiStatus.SUCCESS &&
      campaignsMessage === 'Update campaign success'
    ) {
      handleClose();
      showSnackbar(campaignsMessage, campaignsStatus);
    }
    if (
      campaignsStatus === apiStatus.SUCCESS &&
      campaignsMessage === 'Delete campaign success'
    )
      showSnackbar(campaignsMessage, campaignsStatus);

    if (campaignsStatus === apiStatus.ERROR)
      showSnackbar(campaignsMessage, campaignsStatus);
    // eslint-disable-next-line
  }, [campaignsStatus]);

  //* render UI
  return (
    <AuthGuard
      requestPermissions={[
        { action: 'read', result: '/campaigns' },
        { action: 'read', result: '/manages' },
        { action: 'read', result: '/campaigns-manage' }
      ]}
    >
      <DialogDelete
        handleClose={handleCloseDialogDelete}
        handleConfirm={handleSubmitDialogDelete}
        message={dialogDeleteValue.message}
        open={dialogDeleteValue.open}
        title={dialogDeleteValue.title}
      />

      <Backdrop className={classes.backdrop} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Page title="Campaigns" className={classes.root}>
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Header childTitle="Campaigns" isParent />
            <NavigateNextIcon />
            <Header childTitle="Campaigns" urlChild="/campaigns" />
          </div>
          <Divider className={classes.divider} />
          <ButtonCreate
            className={classes.buttonCreate}
            disabled={!authorPermission.canCreate}
            onClick={handleCreate}
            size="small" // 'large' | 'medium' | 'small'
          />
          <Paper className={classes.paper} elevation={1} variant="outlined">
            <TableHead className={classes.tableHead} columns={columns} />
            <CampaignList
              campaigns={campaigns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              authorPermission={authorPermission}
            />
            <SimpleDialog
              title={recordEditing ? 'Update Campaign' : 'Create Campaign'}
              onClose={handleClose}
              onSubmit={handleSubmit}
              open={open}
              recordEditing={recordEditing}
            />
          </Paper>
        </div>
      </Page>
    </AuthGuard>
  );
}

export default Campaign;
