/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Divider
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useSelector } from 'react-redux';
const useStyles = makeStyles((theme) => ({
  root: {},
  // dialogForm: {
  //   textAlign: 'center',
  //   '& .MuiDialog-container.MuiDialog-scrollPaper': {
  //     display: 'inline-block',
  //     paddingTop: '65px'
  //   },
  //   '& .MuiPaper-root.MuiDialog-paper.MuiDialog-paperScrollPaper.MuiDialog-paperWidthSm.MuiPaper-elevation24.MuiPaper-rounded':
  //     {
  //       minWidth: '400px',
  //       margin: '0px'
  //     }
  // },
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
    display: 'flex',
    marginBottom: theme.spacing(2),
    padding: '8px 24px'
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
  },
  select: {
    marginBottom: 15
  }
}));
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 120
    }
  },
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left'
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left'
  },
  getContentAnchorEl: null,
  formContent: {
    maxWidth: 450
  }
};
export default function MakeOptSuggestion({ open, onClose, onYes, data }) {
  const classes = useStyles();
  const campaigns = useSelector((state) => state.campaign.campaigns);
  const [campaign, setCampaign] = useState(null);
  const [reason, setReason] = useState('');
  const [optStatus, setOptStatus] = useState('out');
  const handleClose = () => {
    if (!onClose) return;
    onClose();
  };
  const handleConfirm = () => {
    if (!onYes) return;
    onYes({ campaign, reason, optStatus });
  };
  const handleCampaignChange = (e) => {
    setCampaign(e.target.value);
  };
  const handleOptStatusChange = (e) => {
    setOptStatus(e.target.value);
  };
  const handleChangeReason = (e) => {
    setReason(e.target.value);
  };
  useEffect(() => {
    if (campaigns && campaigns.length > 0) setCampaign(campaigns[0].id);
    if (data) setReason(data.text);
  }, [campaigns, data]);
  return (
    <div>
      <Dialog
        aria-labelledby="responsive-dialog-title"
        // onClose={handleClose}
        className={classes.formWrapper}
        open={open}
      >
        <DialogTitle id="responsive-dialog-title">
          {data?.direction === 'inbound'
            ? 'Are you sure you want to make opt suggestion?'
            : 'Are you sure you want to make sensitive word'}
        </DialogTitle>
        <Divider style={{ marginBottom: 8 }} />
        <DialogContent className={classes.formContent}>
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            label="Reason"
            style={{ marginBottom: '15px' }}
            value={reason}
            multiline
            rows={2}
            maxRows={4}
            onChange={handleChangeReason}
          />
          {data?.direction === 'inbound' && (
            <>
              <FormControl
                fullWidth
                variant="outlined"
                className={classes.formControl}
              >
                <InputLabel
                  className={classes.label}
                  id="demo-simple-select-outlined-label"
                  margin="dense"
                >
                  Campaign
                </InputLabel>
                <Select
                  // error={showError}
                  fullWidth
                  MenuProps={MenuProps}
                  className={classes.select}
                  id="demo-simple-select-outlined"
                  label="Campaign"
                  labelId="demo-simple-select-outlined-label"
                  margin="dense"
                  onChange={handleCampaignChange}
                  value={campaign}
                  // style={style}
                >
                  {campaigns &&
                    campaigns.map((item) => (
                      <MenuItem key={item.value} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                </Select>
                {/* {showError && <FormHelperText error>{errors[name]}</FormHelperText>} */}
              </FormControl>
              <FormControl
                fullWidth
                variant="outlined"
                className={classes.formControl}
              >
                <InputLabel
                  className={classes.label}
                  id="demo-simple-select-outlined-label"
                  margin="dense"
                >
                  Opt Status
                </InputLabel>
                <Select
                  // error={showError}
                  fullWidth
                  MenuProps={MenuProps}
                  className={classes.select}
                  id="demo-simple-select-outlined"
                  label="Campaign"
                  labelId="demo-simple-select-outlined-label"
                  margin="dense"
                  onChange={handleOptStatusChange}
                  value={optStatus}
                  defaultValue={'out'}
                  // style={style}
                >
                  <MenuItem value={'in'}>IN</MenuItem>
                  <MenuItem value={'out'}>OUT</MenuItem>
                </Select>
                {/* {showError && <FormHelperText error>{errors[name]}</FormHelperText>} */}
              </FormControl>
            </>
          )}
        </DialogContent>
        <Divider style={{ marginBottom: 8 }} />
        <DialogActions className={classes.dialogAction}>
          <Button
            autoFocus
            className={classes.cancelBtn}
            color="primary"
            // hidden={!handleClose}
            onClick={handleClose}
            variant="contained"
          >
            No !!!
          </Button>
          <Button
            autoFocus
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
}
