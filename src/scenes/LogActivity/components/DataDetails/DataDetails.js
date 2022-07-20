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
import ReactJson from 'react-json-view';

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
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'row'
  },
  oldData: {
    flex: 1
  },
  newData: {
    flex: 1
  }
}));

DataDetails.propTypes = {
  data: PropTypes.any.isRequired
};

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    minWidth: '500px',
    maxWidth: '600px',
    display: 'flex',
    alignItems: 'center'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(0),
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

export default function DataDetails({ open, onClose, data }) {
  const classes = useStyles();

  const handleClose = () => onClose();

  return (
    <div>
      {data ? (
        <Dialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            Data Details
          </DialogTitle>
          <DialogContent dividers className={classes.dialogContent}>
            <div className={classes.oldData}>
              {Object.keys(data?.oldData ? data?.oldData : {}).length > 0 ? (
                <>
                  <Typography>
                    <label className={classes.label}>{'Old Data: '}</label>
                  </Typography>
                  <ReactJson
                    displayDataTypes={false}
                    enableClipboard={false}
                    iconStyle="square"
                    src={data.oldData}
                  />
                </>
              ) : (
                ''
              )}
            </div>
            <div className={classes.newData}>
              {Object.keys(data?.newData ? data?.newData : {}).length > 0 ? (
                <>
                  <Typography>
                    <label className={classes.label}>{'New Data: '}</label>
                  </Typography>
                  <ReactJson
                    displayDataTypes={false}
                    enableClipboard={false}
                    iconStyle="square"
                    src={data.newData}
                  />
                </>
              ) : (
                ''
              )}
            </div>
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
