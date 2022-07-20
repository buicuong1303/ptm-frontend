import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { Typography, Dialog } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '3px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  content: {
    padding: '5px 0px'
  },
  label: {
    fontWeight: 'bold'
  }
}));

AppDetails.propTypes = {
  data: PropTypes.object.isRequired
};

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    minWidth: '500px',
    maxWidth: '600px'
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
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

export default function AppDetails({ open, onClose, data }) {
  const classes = useStyles();

  const handleClose = () => onClose();

  return (
    <div>
      {data ? (
        <Dialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            App Information
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              <label className={classes.label}>{'Company Name: '}</label>
              {data.name}
            </Typography>
            <Typography gutterBottom>
              <label className={classes.label}>{'Server: '}</label>
              {data.server}
            </Typography>
            <Typography gutterBottom>
              <label className={classes.label}>{'Client Id: '}</label>
              {data.clientId || '********'}
            </Typography>
            <Typography gutterBottom>
              <label className={classes.label}>{'Client Secret: '}</label>
              {data.clientSecret || '********'}
            </Typography>
            <Typography gutterBottom>
              <label className={classes.label}>{'Username: '}</label>
              {data.username}
            </Typography>
            <Typography gutterBottom>
              <label className={classes.label}>{'Password: '}</label>
              {data.password || '********'}
            </Typography>
            <Typography gutterBottom>
              <label className={classes.label}>{'Extension: '}</label>
              {data.extension}
            </Typography>
            <Typography gutterBottom>
              <label className={classes.label}>{'Dlr Address: '}</label>
              {data.dlrAddress}
            </Typography>
            <Typography gutterBottom>
              <label className={classes.label}>{'Dlr MTT: '}</label>
              {data.dlrMTT}
            </Typography>
            {/* {Object.keys(jsonData.data ? jsonData.data : {}).length > 0 ? (
          <>
            <Typography>
              <label className={classes.label}>{'Data: '}</label>
            </Typography>
            <ReactJson
              displayDataTypes={false}
              enableClipboard={false}
              iconStyle="square"
              src={jsonData.data}
            />
          </>
        ) : (
          ''
        )} */}
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        ''
      )}
    </div>
  );
}
