/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { FormControl, Input, InputLabel, MenuItem, Paper, Select, Toolbar, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Close } from '@material-ui/icons';
import { CustomButton } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { updateSearchValues } from 'scenes/Customer/Customer.slice';

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
    width: '97%',
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
  user: {
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
    outline: 'none',
    minWidth: '40px',
    minHeight: '40px',
    '&:hover': {
      transform: 'scale(125%)'
    }
  },
  formControl: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: '5px'
    },
    backgroundColor: 'white'
  },
  optionItem: {
    minWidth: '70px'
  },
}));

const Control = (props) => {
  const { className, current, limit, placeholder, setLimit, setStopLoading, total, ...rest } = props;

  const classes = useStyles();
  const dispatch = useDispatch();

  //* listen state
  const searchValues = useSelector((state) => state.customer.searchValues);

  //* init form value
  const [formState, setFormState] = useState({ searchValue: '' });
  const [option, setOption] = useState(limit);

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

  //* change select option
  const handleChangeOption = (event) => setOption(event.target.value);

  //* handle reset form
  const handleReset = () => setFormState({ searchValue: '' });

  useEffect(() => {
    setStopLoading(false);
    setLimit(option);
  }, [option]);

  let updateSearchValueTimeout = useRef('');
  useEffect(() => {
    clearTimeout(updateSearchValueTimeout.current);
    updateSearchValueTimeout.current = setTimeout(() => {
      setStopLoading(false);
      dispatch(updateSearchValues(formState.searchValue));
    }, 750);
  }, [formState]);

  useEffect(()=>{
    setFormState({ searchValue: searchValues });
  }, [searchValues]);

  return (
    <Toolbar {...rest} className={clsx(classes.root, className)}>
      <div className={classes.user}>
        <Typography variant="h6">
          Current items: {current}/{total}
        </Typography>
      </div>
      <FormControl className={classes.formControl} variant="outlined">
        <InputLabel id="demo-simple-select-outlined-label" margin={'dense'}>
        Option
        </InputLabel>
        <Select
          MenuProps={MenuProps}
          className={classes.optionItem}
          id="demo-simple-select-outlined"
          label="Option"
          labelId="demo-simple-select-outlined-label"
          margin={'dense'}
          onChange={handleChangeOption}
          value={option}
          variant={'outlined'}
        >
          <MenuItem value="20">20</MenuItem>
          <MenuItem value="50">50</MenuItem>
          <MenuItem value="100">100</MenuItem>
          <MenuItem value="500">500</MenuItem>
        </Select>
      </FormControl>
      <Paper className={classes.search} elevation={1}>
        <SearchIcon className={classes.searchIcon} />
        <Input
          className={classes.searchInput}
          disableUnderline
          placeholder={placeholder}
          name="searchValue"
          onChange={handleChange}
          value={formState.searchValue}
        />
        {formState.searchValue && (
          <CustomButton
            className={classes.searchClear}
            style={{
              border: 'unset',
              backgroundColor: 'unset',
              outline: 'none',
              color: '#546e7a !important',
              marginLeft: '0',
              marginRight: '0'
            }}
            theme="none"
            onClick={handleReset}
          >
            <Close />
          </CustomButton>
        )}
      </Paper>
    </Toolbar>
  );
};

Control.propTypes = {
  className: PropTypes.string,
  current: PropTypes.any,
  limit: PropTypes.any,
  placeholder: PropTypes.string,
  setLimit: PropTypes.func,
  setStopLoading: PropTypes.func,
  total: PropTypes.any
};

export default Control;
