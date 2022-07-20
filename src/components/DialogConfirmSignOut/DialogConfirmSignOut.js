/* eslint-disable prettier/prettier */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  useMediaQuery,
  useTheme,
  DialogContent,
  DialogContentText
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  root: {},
  dialogForm: {
    textAlign: 'center',
    '& .MuiDialog-container.MuiDialog-scrollPaper': {
      display: 'inline-block',
      paddingTop: '65px'
    },
    '& .MuiPaper-root.MuiDialog-paper.MuiDialog-paperScrollPaper.MuiDialog-paperWidthSm.MuiPaper-elevation24.MuiPaper-rounded':
      {
        minWidth: '400px',
        margin: '0px'
      }
  },
  titleConfirm: {
    fontSize: '18px !important',
    fontWeight: 'bold',
    color: '#ca3636'
  },
  confirmBtn: {
    width: '90px',
    height: '90px',
    border: 'solid 3px #ca3636',
    borderRadius: '50%',
    color: '#ca3636',
    position: 'relative',
    margin: 'auto',
    marginTop: '20px'
  },
  dialogAction: {
    display: 'block',
    marginBottom: theme.spacing(2)
  },
  cancelBtn: {
    backgroundColor: theme.palette.cancel.main,
    '&:hover': {
      backgroundColor: theme.palette.cancel.dark
    }
  },
  submitBtn: {
    backgroundColor: '#ca3636',
    '&:hover': {
      backgroundColor: '#962828'
    }
  }
}));

const DialogConfirmSignOut = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // eslint-disable-next-line
  const {
    open,
    className,
    message,
    handleClose,
    handleConfirm,
    ...rest } = props;

  return (
    <div className={className} {...rest}>
      <Dialog
        aria-labelledby="responsive-dialog-title"
        className={classes.dialogForm}
        fullScreen={fullScreen}
        // onClose={handleClose}
        open={open}
      >
        <Button className={classes.confirmBtn}>
          <i style={{ fontSize: '30px', fontWeight: '900' }}>!</i>
        </Button>

        <DialogTitle id="responsive-dialog-title">
          <div className={classes.titleConfirm}>
            {'Are you sure you want to log out?'}
          </div>
        </DialogTitle>

        <DialogContent hidden={message ? false : true}>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>

        <DialogActions className={classes.dialogAction}>
          <Button
            autoFocus
            className={classes.cancelBtn}
            color="primary"
            hidden={!handleClose}
            onClick={handleClose}
            variant="contained"
          >
            No !!!
          </Button>
          <Button
            autoFocus
            className={classes.submitBtn}
            color="primary"
            onClick={handleConfirm}
            variant="contained"
          >
            Yes, do it
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

DialogConfirmSignOut.propTypes = {
  className: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  message: PropTypes.string,
  open: PropTypes.bool.isRequired
};

export default DialogConfirmSignOut;
