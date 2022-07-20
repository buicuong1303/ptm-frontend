/* eslint-disable no-unused-vars */
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import * as PropTypes from 'prop-types';
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    maxWidth: '450px'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});
const useStyles = makeStyles(() => ({
  content: {
    fontWeight: 300,
    padding: 18,
    maxHeight: 300,
    width: 500,
    borderTop: '1px solid #eee',
    wordBreak: 'break-all'
  }
}));
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
function CustomDialog(props) {
  const { title, content, open, onClose } = props;
  const classes = useStyles();
  return (
    <Dialog aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle
        id="customized-dialog-title"
        onClose={() => {
          if (onClose) onClose();
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent className={classes.content}>{content}</DialogContent>
    </Dialog>
  );
}
CustomDialog.propTypes = {
  title: PropTypes.string,
  content: PropTypes.any,
  open: PropTypes.bool
};
CustomDialog.defaultProps = {
  title: '',
  content: '',
  open: false
};
export default CustomDialog;
