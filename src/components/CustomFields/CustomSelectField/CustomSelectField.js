/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-max-props-per-line */
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('md')]: {
      padding: '0px 5px'
    }
  },
  formControl: {
    width: '100%',
    marginBottom: theme.spacing(2),
    '& .MuiFormHelperText-root': {
      position: 'absolute',
      top: '100%',
      marginTop: 0
    }
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
  getContentAnchorEl: null
};
const CustomSelectField = (props) => {
  const classes = useStyles();

  const { field, form, label, disable, options, className, style } = props;
  const { name } = field;
  const { errors, isValid, touched, isSubmitting } = form;
  let showError = false;

  if ((errors[name] && touched[name]) || (errors[name] && isSubmitting))
    showError = true;
  const handleSelectOptionChange = (e) => {
    const selectedValue = e.target.value;
    const changeEvent = {
      target: {
        name: name,
        value: selectedValue
      }
    };
    field.onChange(changeEvent);
  };
  return (
    <FormControl
      className={clsx(classes.formControl, className)}
      variant="outlined"
    >
      <InputLabel
        className={classes.label}
        id="demo-simple-select-outlined-label"
        margin="dense"
      >
        {label}
      </InputLabel>
      <Select
        error={showError}
        MenuProps={MenuProps}
        disabled={disable}
        className={classes.select}
        id="demo-simple-select-outlined"
        label={label}
        labelId="demo-simple-select-outlined-label"
        margin="dense"
        {...field}
        onChange={handleSelectOptionChange}
        style={style}
      >
        {options &&
          options.map((item) => (
            <MenuItem style={style} key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
      </Select>
      {showError && <FormHelperText error>{errors[name]}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelectField;
