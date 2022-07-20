import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  useMediaQuery,
  useTheme,
  DialogContentText,
  DialogContent
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { PriorityHigh } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {},
  icon: {
    height: '40px',
    width: '40px',
    margin: 'auto',
    display: 'block',
    color: theme.palette.error.main
  },
  dialog: {
    //backgroundColor: theme.palette.error.main,
    textAlign: 'center'
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ca3636'
  },
  warningBtn: {
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
  deleteBtn: {
    backgroundColor: '#ca3636',
    '&:hover': {
      backgroundColor: '#962828'
    }
  }
}));

const DialogDelete = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // eslint-disable-next-line
  const {
    open,
    className,
    title,
    message,
    handleClose,
    handleConfirm,
    ...rest
  } = props;

  return (
    <div className={className} {...rest}>
      <Dialog
        aria-labelledby="responsive-dialog-title"
        className={classes.dialog}
        fullScreen={fullScreen}
        // onClose={handleClose}
        open={open}
      >
        <Button className={classes.warningBtn}>
          <PriorityHigh style={{ fontSize: '30px' }} />
        </Button>

        <DialogTitle id="responsive-dialog-title">
          <div className={classes.title}>{title}</div>
        </DialogTitle>

        <DialogContent hidden={message ? false : true}>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>

        <DialogActions className={classes.dialogAction}>
          <Button
            autoFocus
            className={classes.cancelBtn}
            color="primary"
            onClick={handleClose}
            variant="contained"
          >
            No !!!
          </Button>

          <Button
            autoFocus
            className={classes.deleteBtn}
            color="primary"
            onClick={handleConfirm}
            variant="contained"
          >
            Yes, delete it
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

DialogDelete.propTypes = {
  className: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  message: PropTypes.string,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired
};

export default DialogDelete;
