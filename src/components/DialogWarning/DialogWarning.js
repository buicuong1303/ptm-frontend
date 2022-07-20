import React, { useEffect, useState } from 'react';
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
import { formatPhoneNumber } from 'utils/formatPhoneNumber';

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
    textAlign: 'center',
    '& .MuiPaper-root.MuiDialog-paper.MuiDialog-paperScrollPaper.MuiDialog-paperWidthSm.MuiPaper-elevation24.MuiPaper-rounded':
      {
        minWidth: '400px'
      }
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#e3942d'
  },
  warningBtn: {
    width: '90px',
    height: '90px',
    border: 'solid 3px #e3942d',
    borderRadius: '50%',
    color: '#e3942d',
    position: 'relative',
    margin: 'auto',
    marginTop: '20px'
  },
  dialogAction: {
    display: 'block',
    marginBottom: theme.spacing(2)
  },
  gotItBtn: {
    backgroundColor: '#e3942d',
    '&:hover': {
      backgroundColor: '#ab6d1a'
    }
  },
  cancelBtn: {
    backgroundColor: theme.palette.cancel.main,
    '&:hover': {
      backgroundColor: theme.palette.cancel.dark
    }
  },
  submitBtn: {
    backgroundColor: '#e3942d',
    '&:hover': {
      backgroundColor: '#ab6d1a'
    }
  }
}));

const DialogWarning = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    open,
    className,
    title,
    message,
    onClose,
    onLeave,
    submitTitle,
    listCampaignOut,
    handleConfirm,
    listPhoneOut,
    ...rest
  } = props;

  const [isClicked, setIsClicked] = useState(!open);

  useEffect(() => {
    setIsClicked(!open);
  }, [open]);

  return (
    <div className={className} {...rest}>
      <Dialog
        aria-labelledby="responsive-dialog-title"
        className={classes.dialog}
        fullScreen={fullScreen}
        open={open}
      >
        <Button className={classes.warningBtn}>
          <PriorityHigh style={{ fontSize: '30px' }} />
        </Button>

        <DialogContent hidden={listPhoneOut ? false : true}>
          {listPhoneOut ? (
            <div>
              <div style={{ textAlign: 'center' }}>
                <b style={{ fontSize: 15 }}>OPT Out:</b>
              </div>
              <div
                style={{
                  justifyContent: 'center',
                  textAlign: 'start',
                  minWidth: 50,
                  display: 'inline-block',
                  paddingTop: 5
                }}
              >
                <ul
                  style={{
                    fontSize: 13,
                    fontWeight: 11,
                    padding: 0,
                    listStyle: 'none'
                  }}
                >
                  {listPhoneOut.map((cp) => (
                    <li key={cp} style={{}}>
                      {formatPhoneNumber(cp)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </DialogContent>

        <DialogContent hidden={listCampaignOut ? false : true}>
          {listCampaignOut ? (
            <div>
              <div style={{ textAlign: 'center' }}>
                <b style={{ fontSize: 15 }}>OPT Out:</b>
              </div>
              <div
                style={{
                  justifyContent: 'center',
                  textAlign: 'start',
                  minWidth: 50,
                  display: 'inline-block',
                  paddingTop: 5
                }}
              >
                <ul
                  style={{
                    fontSize: 13,
                    fontWeight: 11,
                    padding: 0,
                    listStyle: 'none'
                  }}
                >
                  {listCampaignOut.map((cp) => (
                    <li key={cp.id} style={{}}>
                      {cp.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </DialogContent>

        <DialogTitle id="responsive-dialog-title">
          <div className={classes.title}>{title}</div>
        </DialogTitle>

        <DialogContent hidden={message ? false : true}>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>

        {listCampaignOut || listPhoneOut ? (
          <DialogActions className={classes.dialogAction}>
            <Button
              autoFocus
              className={classes.cancelBtn}
              color="primary"
              hidden={!onClose}
              onClick={() => {
                onClose();
                setIsClicked(true);
              }}
              variant="contained"
              disabled={isClicked}
            >
              No !!!
            </Button>
            <Button
              autoFocus
              className={classes.submitBtn}
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
        ) : (
          <DialogActions className={classes.dialogAction}>
            {onLeave && (
              <Button
                autoFocus
                className={classes.cancelBtn}
                color="primary"
                onClick={() => onLeave()}
                variant="contained"
              >
                Leave
              </Button>
            )}
            <Button
              autoFocus
              className={classes.gotItBtn}
              color="primary"
              onClick={() => onClose()}
              variant="contained"
            >
              {submitTitle ? submitTitle : 'Stay on page'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
};

DialogWarning.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  submitTitle: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onLeave: PropTypes.func,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

export default DialogWarning;
