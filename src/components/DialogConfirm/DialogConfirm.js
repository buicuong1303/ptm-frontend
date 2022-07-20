import React, { useEffect, useState } from 'react';
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
    '& .MuiPaper-root.MuiDialog-paper.MuiDialog-paperScrollPaper.MuiDialog-paperWidthSm.MuiPaper-elevation24.MuiPaper-rounded':
      {
        minWidth: '400px'
      }
  },
  titleWarning: {
    fontSize: '18px !important',
    fontWeight: 'bold',
    color: '#2b8432'
  },
  titleConfirm: {
    fontSize: '18px !important',
    fontWeight: 'bold',
    color: '#eb9902'
  },
  warningBtn: {
    width: '90px',
    height: '90px',
    border: 'solid 3px #2b8432',
    borderRadius: '50%',
    color: '#2b8432',
    position: 'relative',
    margin: 'auto',
    marginTop: '20px'
  },
  confirmBtn: {
    width: '90px',
    height: '90px',
    border: 'solid 3px #eb9902',
    borderRadius: '50%',
    color: '#eb9902',
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
    backgroundColor: '#2b8432',
    '&:hover': {
      backgroundColor: '#014c07'
    }
  },
  warningConfirmBtn: {
    backgroundColor: '#eb9800',
    '&:hover': {
      backgroundColor: '#c07c02'
    }
  }
}));

const DialogConfirm = (props) => {
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
    isConfirm,
    ...rest
  } = props;

  const [isClicked, setIsClicked] = useState(!open);

  useEffect(() => {
    setIsClicked(!open);
  }, [open]);

  return (
    <div className={className} style={{ margin: '0px' }} {...rest}>
      <Dialog
        aria-labelledby="responsive-dialog-title"
        className={classes.dialogForm}
        fullScreen={fullScreen}
        // onClose={handleClose}
        open={open}
      >
        <Button className={isConfirm ? classes.confirmBtn : classes.warningBtn}>
          <i style={{ fontSize: '30px', fontWeight: '900' }}>?</i>
        </Button>

        <DialogTitle id="responsive-dialog-title">
          <div
            className={isConfirm ? classes.titleConfirm : classes.titleWarning}
          >
            {'Do you want to continue?'}
          </div>
        </DialogTitle>

        <DialogContent hidden={message ? false : true}>
          {message ? <DialogContentText>{message}</DialogContentText> : null}
        </DialogContent>

        <DialogActions className={classes.dialogAction}>
          <Button
            autoFocus
            className={classes.cancelBtn}
            color="primary"
            hidden={!handleClose}
            onClick={() => {
              handleClose();
              setIsClicked(true);
            }}
            variant="contained"
            disabled={isClicked}
          >
            No !!!
          </Button>
          <Button
            autoFocus
            className={
              isConfirm ? classes.warningConfirmBtn : classes.submitBtn
            }
            color="primary"
            onClick={() => {
              handleConfirm();
              setIsClicked(true);
            }}
            disabled={isClicked}
            variant="contained"
          >
            Yes, do it
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

DialogConfirm.propTypes = {
  className: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  message: PropTypes.string,
  open: PropTypes.bool.isRequired
};

export default DialogConfirm;
