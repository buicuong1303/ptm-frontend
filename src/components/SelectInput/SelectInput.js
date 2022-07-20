/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-max-props-per-line */
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('md')]: {
      padding: '0px 5px'
    }
  },
  formControl: {
    width: '100%',
    margin: theme.spacing(1, 0, 0.5)
  },
  select: {}
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
  getContentAnchorEl: null
};
const SelectInput = (props) => {
  const {
    label,
    options,
    value,
    name,
    className,
    onChange,
    style,
    id,
    error,
    helperText,
    disabled,
    defaultValue
  } = props;

  const classes = useStyles();

  const handleSelectOptionChange = (e) => {
    if (onChange) {
      const event = {
        ...e,
        target: {
          ...e.target,
          id: id
        }
      };
      onChange(event);
    }
  };
  return (
    <FormControl
      className={clsx(classes.formControl, className)}
      variant="outlined"
      style={style}
    >
      <InputLabel
        className={classes.label}
        id="demo-simple-select-outlined-label"
        margin="dense"
      >
        {label}
      </InputLabel>
      <Select
        error={error}
        MenuProps={MenuProps}
        className={classes.select}
        label={label}
        labelId="demo-simple-select-outlined-label"
        margin="dense"
        onChange={handleSelectOptionChange}
        value={value}
        name={name}
        id={id}
        defaultValue={defaultValue}
        disabled={disabled ? disabled : false}
      >
        {/* <MenuItem value="">
          <em>None</em>
        </MenuItem> */}
        {options &&
          options.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
      </Select>
      {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default SelectInput;

SelectInput.propTypes = {
  label: PropTypes.string,
  options: PropTypes.array.isRequired,
  value: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  defaultValue: PropTypes.string,
};
SelectInput.defaultProps = {
  error: false,
  helperText: '',
  defaultValue: ''
};
