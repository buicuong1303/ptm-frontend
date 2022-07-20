/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Box,
  ClickAwayListener,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography
} from '@material-ui/core';
import { CustomButton } from 'components';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DateRangePicker from '@mui/lab/DateRangePicker';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUser } from 'scenes/User/User.asyncActions';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 70
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
  getContentAnchorEl: null
};

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: theme.palette.white,
    width: '100%',
    minHeight: 'unset',
    padding: 0,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  backButton: {
    marginRight: theme.spacing(2),
    '@media (min-width: 1023px)': {
      display: 'none'
    }
  },
  currentItem: {
    flexShrink: 0,
    flexGrow: 0,
    marginRight: '20px'
  },
  activity: {
    display: 'flex',
    alignItems: 'center'
  },
  statusBullet: {
    marginRight: theme.spacing(1)
  },
  search: {
    height: 40,
    padding: theme.spacing(0, 0, 0, 2),
    display: 'flex',
    alignItems: 'center',
    maxWidth: '500px',
    flex: '1 1 auto'
  },
  searchIcon: {
    marginRight: theme.spacing(2),
    color: '#546e7a !important'
  },
  searchInput: {
    flexGrow: 1
  },
  searchClear: {
    border: 'unset',
    backgroundColor: 'unset',
    outline: 'none'
  },
  formControl: {
    backgroundColor: 'white',
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: '5px'
    }
  },
  optionItem: {
    minWidth: '150px'
  }
}));

const Control = (props) => {
  const {
    className,
    handleReset,
    handleSubmit,
    formState,
    setFormState,
    current,
    total,
    users,
    ...rest
  } = props;

  const classes = useStyles();
  const dispatch = useDispatch();

  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);

  //* set form state when change form value
  const handleChange = (event) => {
    event.persist();
    setFormState({
      ...formState,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value
    });
  };

  const handleChangeDateRange = (values) => {
    setFormState({
      ...formState,
      from: values[0],
      to: values[1]
    });
  };

  return (
    <Toolbar {...rest} className={clsx(classes.root, className)}>
      <div className={classes.currentItem} style={{ flex: 1 }}>
        <Typography variant="h6">
          Current items: {current}/{total}
        </Typography>
      </div>
      <FormControl className={classes.formControl} variant="outlined">
        <InputLabel id="user-select-outlined-label" margin={'dense'}>
          User
        </InputLabel>
        <Select
          MenuProps={MenuProps}
          className={classes.optionItem}
          id="user-select-outlined"
          label="User"
          labelId="user-select-outlined-label"
          margin={'dense'}
          onChange={handleChange}
          value={formState?.userId}
          variant={'outlined'}
          name="userId"
        >
          <MenuItem value="">All</MenuItem>
          {users.map((user, index) => {
            return (
              <MenuItem key={user.id || index} value={user.id}>
                {user.firstName} {user.lastName} ({user.username})
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl} variant="outlined">
        <InputLabel id="log-action-select-outlined-label" margin={'dense'}>
          Log Action
        </InputLabel>
        <Select
          MenuProps={MenuProps}
          className={classes.optionItem}
          id="log-action-select-outlined"
          label="Log Action"
          labelId="log-action-select-outlined-label"
          margin={'dense'}
          onChange={handleChange}
          value={formState?.logAction}
          variant={'outlined'}
          name="logAction"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="mark_read">Mark read</MenuItem>
          <MenuItem value="mark_unread">Mark unread</MenuItem>
          <MenuItem value="mark_new">Mark new</MenuItem>
          <MenuItem value="mark_existing">Mark existing</MenuItem>
          <MenuItem value="mark_completed">Mark completed</MenuItem>
          <MenuItem value="mark_incomplete">Mark incomplete</MenuItem>
          <MenuItem value="select_labels">Select labels</MenuItem>
          <MenuItem value="update_client">Update client</MenuItem>
        </Select>
      </FormControl>
      <Box style={{ display: 'flex' }}>
        <ClickAwayListener
          onClickAway={() => {
            if (isDateRangeOpen) setIsDateRangeOpen(false);
          }}
        >
          <div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateRangePicker
                startText="From"
                endText="To"
                value={[formState.from, formState.to]}
                onChange={(values) => handleChangeDateRange(values)}
                open={isDateRangeOpen}
                selectsRange
                isClearable
                renderInput={(startProps, endProps) => (
                  <React.Fragment>
                    <TextField
                      {...startProps}
                      variant="outlined"
                      size="small"
                      style={{ marginRight: '8px', backgroundColor: 'white' }}
                      onClick={() => setIsDateRangeOpen(true)}
                    />
                    <TextField
                      {...endProps}
                      variant="outlined"
                      size="small"
                      style={{ marginRight: '8px', backgroundColor: 'white' }}
                      onClick={() => setIsDateRangeOpen(true)}
                    />
                  </React.Fragment>
                )}
              />
            </LocalizationProvider>
          </div>
        </ClickAwayListener>
        <CustomButton
          variant="contained"
          theme="blue"
          onClick={(e) => {
            if (
              !(
                !formState.from ||
                formState.from?.toString() === 'Invalid Date' ||
                !formState.to ||
                formState.to?.toString() === 'Invalid Date'
              )
            )
              handleSubmit();
          }}
          disabled={
            !formState.from ||
            formState.from?.toString() === 'Invalid Date' ||
            !formState.to ||
            formState.to?.toString() === 'Invalid Date'
          }
        >
          Load
        </CustomButton>
        <CustomButton variant="contained" theme="orange" onClick={handleReset}>
          Reset Filters
        </CustomButton>
      </Box>
    </Toolbar>
  );
};

Control.propTypes = {
  className: PropTypes.string,
  current: PropTypes.any,
  formState: PropTypes.object.isRequired,
  setFormState: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  total: PropTypes.any
};

export default Control;
